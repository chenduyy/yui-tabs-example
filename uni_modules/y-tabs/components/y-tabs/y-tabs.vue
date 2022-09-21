<template>
	<view class="yui-tabs" :class="[tabsClass]">
		<!-- 依赖元素，用于处理滚动吸顶所需 -->
		<view class="depend-wrap"></view>
		<!-- 标签区域 -->
		<view class="yui-tabs__wrap" :style="[innerWrapStyle,wrapStyle]">
			<scroll-view class="yui-tabs__scroll" :class="[scrollX?'enable-sroll':'']" :scroll-x="scrollX"
				:scroll-anchoring="true" enable-flex :scroll-left="scrollLeft"
				:scroll-into-view="!scrollToCenter?scrollId:''" scroll-with-animation :style="[scrollStyle]">
				<view class="yui-tabs__nav" :class="[navClass]" :style="[navStyle]">
					<view class="yui-tab" v-for="(tab,index) in tabs" :key="index" @tap.stop="onClick(index,true)"
						:id="`tab_${index}`" :class="[tabClass(index),tab.titleClass]"
						:style="[tabStyle(index),tab.titleStyle]">
						<view class="yui-tab__text">
							<!-- #ifndef VUE3 -->
							<slot :name="tab.titleSlot">{{tab.title}}</slot>
							<!-- #endif -->
							<!-- #ifdef VUE3 -->
							{{tab.title}}
							<!-- #endif -->
							<text :class="[infoClass(tab)]" v-if="tab.badge || tab.dot">{{tab.badge}}</text>
						</view>
					</view>
					<view v-if="isLine" class="yui-tabs__line" :style="[lineStyle,lineAnimatedStyle]"></view>
				</view>
			</scroll-view>
			<view class="yui-tabs__extra">
				<slot name="extra"></slot>
			</view>
		</view>

		<view v-if="isFixed" class="yui-tabs__placeholder" :style="[{height:placeholderHeight+'px'}]"></view>
		<!-- 标签内容 -->
		<view class="yui-tabs__content"
			:class="{'yui-tabs__content--animated':animated,'yui-tabs__content--scrollspy':scrollspy}">
			<view class="yui-tabs__track" :style="[trackStyle]">
				<slot></slot>
			</view>
		</view>
	</view>
</template>
<script>
	/**
	 * 滑动时半屏时通过setLine改变线条
	 * 导航栏背景色渐变，需要控制格式
	 */

	import {
		isNull,
		addUnit,
		isDef,
		isObject,
		callInterceptor,
	} from "../js/uitls"

	import {
		model,
		emits,
		props,
	} from "../js/const"

	export default {
		name: 'yTabs',
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		model,
		emits,
		props,
		data() {
			return {
				childrens: [], // 存放子组件数组
				tabs: [],
				watchTabKey: `watchTab_${this.pKey}`, //监听导航变化事件
				putChangeKey: `putChange_${this.pKey}`, //推动导航变化事件
				timer: null,
				currentIndex: -1, //当前选中下标
				scrollId: '', //值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
				scrollLeft: 0, //设置横向滚动条位置
				// 标签栏底部线条动画相关
				lineAnimated: false, //是否开启标签栏底部线条动画（首次不开启）
				lineAnimatedStyle: {
					transform: `translateX(-100%) translateX(-50%)`,
					transitionDuration: `0s`
				}, //标签栏底部线条动画样式
				isFixed: false, //是否吸顶
				extraWidth: 0, //标签栏右侧额外区域宽度
				contentWidth: 0, //标签内容宽度
				trackStyle: null, //标签内容滑动轨道样式
				isTabClick: false, //是否为标签标题点击
				placeholderHeight: 0, //标题栏占位高度
				windowHeight: 0, //屏幕高度
				paneHeight: 0, //标签内容当前默认的高度
				lockedScrollspy: false, //锁定滚动导航模式下点击标题栏触发的滚动逻辑
			}
		},
		computed: {
			// 样式风格是否为line
			isLine() {
				return this.type === "line"
			},
			// 标签页容器class
			tabsClass() {
				return `yui-tabs--${this.type} ${ this.isFixed?'yui-tabs--fixed':''}`
			},
			// 标签栏class
			navClass() {
				return `yui-tabs__nav--${this.type}`
			},
			// 标签栏style
			navStyle() {
				const style = {}
				if (this.type === "card") style.borderColor = this.color
				return style
			},
			// 标签栏包裹层样式
			innerWrapStyle() {
				const style = { background: this.background }
				// 滚动吸顶下
				if (this.isFixed) {
					style.top = this.offsetTop + "px"
					style.zIndex = this.zIndex
				}
				return style
			},
			// 滚动区域样式
			scrollStyle() {
				return {
					width: `calc(100% - ${this.extraWidth}px)`
				}
			},
			// 标签栏底部线条样式
			lineStyle() {
				const {
					lineWidth,
					lineHeight,
					duration
				} = this;
				const lineStyle = {
					width: addUnit(lineWidth),
					backgroundColor: this.color,
				}

				if (isDef(lineHeight)) {
					lineStyle.height = addUnit(lineHeight);
					lineStyle.borderRadius = lineStyle.height;
				}
				return lineStyle
			},
			// 是否允许横向滚动
			scrollX() {
				return !this.ellipsis && this.type !== "card" && this.tabs.length > this.scrollThreshold
			},
			// 标签数量
			dataLen() {
				return this.tabs.length
			},
			// 滑动动画时长(ms)
			msDuration() {
				return this.animated ? this.duration * 1000 : 0
			},
			// 粘性布局下的滚动偏移量
			scrollOffset() {
				return this.sticky ? this.offsetTop + this.placeholderHeight : 0;
			},
		},
		watch: {
			// 监听父组件的props，设置给子组件
			$props: {
				deep: true,
				immediate: true,
				handler(newValue) {
					this.childrens.forEach((child) => {
						child.swipeable = newValue.swipeable;
						child.swipeAnimated = newValue.swipeAnimated;
					});
				},
			},
			// 监听子组件数组长度变化，赋index值
			"childrens.length"() {
				this.childrens.forEach((child, index) => {
					child.index = index;
					child.swipeable = this.swipeable;
					child.swipeAnimated = this.swipeAnimated;
				});
			},
			// 监听选中下标变化
			currentIndex(newIdx, oldIdx) {
				// console.log(this.currentIndex);
				this.changeStatus(newIdx, oldIdx) // 状态变更
				this.setLine(); //设置底部线条位置
				this.scrollIntoView() //将激活的tab滚动到视图中
				this.changeStyle() // 样式切换
			},
		},
		created() {
			// 监听选中标识符变化
			this.$watch(model.prop, (index) => {
				if (index !== this.currentIndex) {
					this.setCurrentIndex(index) //更新当前选中下标
				}
			})
		},
		methods: {
			// @exposed-api
			resize() {
				// 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘
				this.init()
			},
			// 添加tab
			putTab({ newValue, oldValue }) {
				this.tabs.push({ ...newValue })
				if (this.timer) clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.init() //初始化
					this.bindListener(); //监听事件
				}, 5)
			},
			// 更新tab
			updateTab({ newValue, oldValue, index }) {
				const tab = this.tabs[index]
				Object.keys((newValue || {})).forEach(key => {
					this.$set(tab, key, newValue[key])
				})
			},
			// 标签项class
			tabClass(index) {
				const activated = this.currentIndex === index
				return `yui-tab_${index} ${activated?'yui-tab--active':''} ${this.ellipsis && !this.scrollX?'yui-tab__ellipsis':''}`
			},
			// 标签项style
			tabStyle(index) {
				const activated = this.currentIndex === index
				let { titleActiveColor: color, titleInactiveColor: defColor } = this
				let background = ""
				let borderColor = ""
				// type="line" 时
				if (this.type === "line") {
					if (isNull(color)) color = "#646566"
					if (isNull(defColor)) defColor = "#323233"
				} else if (this.type === "text") { // type="text" 时，选中时使用主题色
					if (isNull(color)) color = this.color
					if (isNull(defColor)) defColor = "#323233"
				} else if (this.type === "card") { // type="card" 时，未选中则使用主题色
					background = this.color
					if (isNull(color)) color = "#fff"
					if (isNull(defColor)) defColor = this.color
				} else if (this.type === "button") { // type="button" 时
					background = this.color
					if (isNull(color)) color = "#fff"
					if (isNull(defColor)) defColor = "#323233"
				} else if (this.type === "line-button") { // type="line-button" 时
					borderColor = this.color
					if (isNull(color)) color = this.color
					if (isNull(defColor)) defColor = "#323233"
				}
				return {
					color: activated ? color : defColor,
					background: activated ? background : "",
					borderColor: activated ? borderColor : "",
				}
			},
			// 标题右上角信息class
			infoClass(tab) {
				return ` yui-tab__info ${tab.dot?'yui-tab__info--dot':''}`
			},
			// 获取查询节点信息的对象
			getSelectorQuery() {
				let query = null
				// #ifdef MP-ALIPAY
				query = uni.createSelectorQuery()
				// #endif
				// #ifndef MP-ALIPAY
				query = uni.createSelectorQuery().in(this)
				// #endif
				return query
			},
			// 获取元素位置信息
			getRect(...selectors) {
				return new Promise((resolve, reject) => {
					if (!selectors) reject('Parameter is empty');
					const query = this.getSelectorQuery()
					selectors.forEach(seletor => {
						query.select(seletor).boundingClientRect()
					})
					query.exec(data => {
						data = data || []
						resolve(data.length === 1 ? data[0] : data)
					});
				})
			},
			// 绑定监听事件
			bindListener() {
				const that = this
				if (that.sticky || that.scrollspy) {
					uni.$on('onPageScroll', function(e) {
						const { stickyThreshold, offsetTop, scrollspy, lockedScrollspy } = that
						// 粘性定位布局的吸顶处理
						that.getRect('.depend-wrap').then((rect) => {
							// TODO 优化触发边界值
							that.isFixed = rect.bottom - stickyThreshold <= offsetTop
							// 	滚动时触发，仅在 sticky 模式下生效,{ scrollTop: 距离顶部位置, isFixed: 是否吸顶 }
							that.$emit("scroll", {
								scrollTop: e.scrollTop,
								isFixed: that.isFixed
							})
						})

						// 滚动导航模式下对选中标签的处理
						if (scrollspy && !lockedScrollspy) {
							that.getCurrIndexOnScroll().then(index => {
								that.setCurrentIndex(index) //设置当前下标
							})
						}
					})
				}
			},
			// 滚动时获取要选中的下标
			getCurrIndexOnScroll(res = []) {
				return new Promise((resolve, rejct) => {
					const promises = this.childrens.map(child => child.getRect())
					Promise.all(promises).then(res => {
						// 标签内容的top小于标题栏的top，则说明已经与标题栏部分重合
						let index = res.reduce((idx, o, i) => o.top < this.scrollOffset ? i : idx, 0)
						// 判断最后一个标签内容是否完整显示在底部，是则默认选中
						// const lastRect = res[res.length - 1] //最后一个标签内容
						// if (lastRect.bottom <= this.windowHeight) index = res.length - 1
						resolve(index)
					})
				})
			},
			// 初始化操作
			async init() {
				//屏幕高度
				this.windowHeight = uni.getSystemInfoSync().windowHeight;

				//获取额外区域的宽度
				let rect = await this.getRect('.yui-tabs__extra')
				this.extraWidth = rect ? rect.width : 0

				//获取标签内容区域的宽度
				rect = await this.getRect('.yui-tabs__content')
				this.contentWidth = rect ? rect.width : 0

				// 获取标题栏包裹层的rect
				rect = await this.getRect('.yui-tabs__wrap')
				const halfWrapWidth = rect ? rect.width / 2 : 0
				this.placeholderHeight = rect ? rect.height : 0


				//获取标签容器距离视口左侧的left值
				rect = await this.getRect('.yui-tabs')
				const parentLeft = rect ? rect.left : 0

				// 添加额外属性
				this.tabs.forEach((tab, index) => {
					this.$set(tab, "titleSlot", 'title' + index) ////标题插槽名，以"title"+下标命名,vue3不支持自定义标题插槽
					this.$set(tab, "show", this.scrollspy) //是否显示内容（滚动导航模式默认显示）
					//标记是否渲染过，非懒加载与滚动导航模式下默认渲染
					this.childrens[index].rendered = !this.isLazyRender || this.scrollspy
				})

				// 计算每个tab的相关参数
				const selectors = this.tabs.reduce((arr, tab, index) => {
					arr.push(`.yui-tab_${index}`)
					return arr
				}, [])
				const rects = await this.getRect(...selectors);
				this.tabs.forEach((tab) => {
					const [r] = rects.splice(0, 1)
					const translateX = r ? r.left + r.width / 2 - parentLeft : 0
					this.$set(tab, "translateX", translateX) //标签线条偏移量
					this.$set(tab, "scrollLeft", translateX - halfWrapWidth) //标签相对于屏幕左侧的距离值
				})

				if (this.scrollspy) { //滚动导航模式
					const promises = this.childrens.map(child => child.getRect())
					const res = await Promise.all(promises) || [];
					res.forEach((r, index) => {
						this.$set(this.tabs[index], "paneTop", r ? r.top : 0) //标签内容相对于屏幕顶部的距离值
					})
					console.log(this.tabs);
				}

				this.setCurrentIndex(this[model.prop]) //设置当前下标
			},
			// 标签点击事件
			onClick(index, isTabClick = false) {
				this.isTabClick = isTabClick // 是否为标签标题点击
				if (isTabClick) this.$emit('click', index, this.tabs[index], this.isTabClick) // 标签点击事件
				callInterceptor({
					interceptor: this.beforeChange,
					args: [index],
					done: () => {
						this.setCurrentIndex(index) //设置当前下标
						setTimeout(() => {
							this.scrollToTop() //滚动到顶 
							this.scrollToCurrContent() //滚动到当前标签内容
						}, 0)
					},
				});
			},
			// 设置当前下标
			setCurrentIndex(newIdx) {
				const shouldEmit = this.currentIndex !== newIdx
				const shouldEmitChange = this.currentIndex !== null
				const currTab = this.tabs[newIdx] //当前tab
				// 非滚动导航模式下,触发rendered事件
				if (this.isLazyRender && !this.scrollspy && !currTab.rendered) {
					this.$emit('rendered', newIdx, this.tabs[newIdx])
				}

				this.currentIndex = newIdx
				if (shouldEmit) { //禁止重复切换
					this.$emit(emits[0], newIdx) // 更新v-model绑定的值

					if (shouldEmitChange) {
						this.$emit('change', newIdx, this.tabs[newIdx], this.isTabClick)
					}
				}
			},
			toJSON() {

			},
			// 设置底部线条位置
			setLine() {
				if (this.isLine) { // 仅在 type="line" 时有效
					const val = this.tabs[this.currentIndex].translateX
					const transform = `translateX(${isDef(val) ? val + "px" : '-100%'}) translateX(-50%)`
					const duration = `${this.lineAnimated?this.duration:'0'}s`
					this.$set(this.lineAnimatedStyle, 'transform', transform)
					this.$set(this.lineAnimatedStyle, 'transitionDuration', duration)
					this.lineAnimated = true //是否开启标签栏动画
				}
			},
			// 将激活的tab滚动到视图中
			scrollIntoView() {
				// 标签栏允许滚动:设置横向滚动条位置，scrollToCenter为true，当前标签则滚动至中心位置
				if (this.scrollX) {
					if (this.scrollToCenter) this.scrollLeft = this.tabs[this.currentIndex].scrollLeft
					else this.scrollId = `tab_${this.currentIndex-1}`;
				}
			},
			// 滚动到顶
			scrollToTop() {
				//标签点击时页面回滚顶部
				if (!this.scrollspy && this.tabClickScrollTop) {
					setTimeout(function() {
						uni.pageScrollTo({ scrollTop: 0, duration: 0 });
					}, this.msDuration);
				}
			},
			// 滚动到当前标签内容
			scrollToCurrContent(immediate = false) {
				if (this.scrollspy) { //滚动导航模式下
					const duration = immediate ? 0 : this.msDuration
					this.lockedScrollspy = true
					uni.pageScrollTo({ scrollTop: this.tabs[this.currentIndex].paneTop, duration });
					setTimeout(() => {
						this.lockedScrollspy = false
					}, duration * 2)
				}
			},
			// 状态变更
			changeStatus(newIdx, oldIdx) {
				if (!this.scrollspy) { //非滚动导航模式下
					(this.tabs[oldIdx] || {}).show = false; //隐藏旧tab的内容
					(this.tabs[newIdx] || {}).show = true; //显示当前tab的内容
					this.childrens[newIdx].rendered = true; //标记当前tab的内容渲染过
				}

				this.childrens.forEach((child, index) => {
					child.active = newIdx === index
				})
			},
			// 样式切换
			changeStyle() {
				// 非滚动导航模式下
				if (!this.scrollspy) {
					this.changeTrackStyle(false, this.duration) //改变标签内容滑动轨道样式
					this.changePaneStyle() //改变标签内容样式
				}
			},
			// 改变标签内容滑动轨道样式
			changeTrackStyle(isSlide = false, duration, offsetWidth = 0) {
				duration = isNull(duration) ? this.duration : duration
				if (this.animated) {
					// isSlide为true，表示左右滑动；false表示点击标签的转场动画
					this.trackStyle = {
						'transform': isSlide ? `translate3d(${offsetWidth}px,0,0)` :
							`translateX(${-100 * this.currentIndex}%)`,
						'transition': `transform ${duration}s ease-in-out`
					}
				}
			},
			// 改变标签内容样式
			async changePaneStyle() {
				const rect = await this.childrens[this.currentIndex].getRect();
				const height = rect && this.swipeAnimated ? rect.height : 0 //拖拽动画时才需要该高度
				this.tabs.forEach((tab, index) => {
					// 有拖动动画时或指定标签内容显示时，为visible
					const paneStyle = this.animated ? {
						visibility: this.swipeAnimated || tab.show ? 'visible' : 'hidden',
						height: tab.show ? 'auto' : height + 'px'
					} : { display: tab.show ? 'block' : 'none' };
					this.childrens[index].paneStyle = paneStyle
				})
			},
		}
	}
</script>
<style lang="less" scoped>
	@import url("../css/index.less");
</style>
