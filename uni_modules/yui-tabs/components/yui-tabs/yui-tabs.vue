<template>
	<view class="yui-tabs" :class="[tabsClass]">
		<!-- 依赖元素，用于处理滚动吸顶所需 -->
		<view class="depend-wrap"></view>
		<!-- 标签区域 -->

		<view class="yui-tabs__wrap" :style="[innerWrapStyle,wrapStyle]">
			<!-- scrollX为true，表示允许横向滚动 -->
			<scroll-view class="yui-tabs__scroll" :class="[scrollX?'enable-sroll':'']" :scroll-x="scrollX" :scroll-anchoring="true" enable-flex :scroll-left="scrollLeft"
				:scroll-into-view="!scrollToCenter?scrollId:''" scroll-with-animation :style="[scrollStyle]">
				<view class="yui-tabs__nav" :class="[navClass]" :style="[navStyle]">
					<view class="yui-tab" v-for="(tab,index) in tabList" :key="index" @tap.stop="onClick(index,true)" :id="`tab_${index}`" :class="[tabClass(index, tab)]" :style="[tabStyle(tab)]">
						<view class="yui-tab__text">
							<!-- #ifndef VUE3 -->
							<slot :name="tab.titleSlot">{{tab.label}}</slot>
							<!-- #endif -->
							<!-- #ifdef VUE3 -->
							{{tab.label}}
							<!-- #endif -->
							<text :class="[infoClass(tab)]" v-if="tab.badge || tab.dot">{{tab.badge}}</text>
						</view>
					</view>
					<view v-if="isLine" class="yui-tabs__line" :style="[lineStyle,lineAnimatedStyle]"></view>
				</view>
			</scroll-view>
			<!-- 标签栏额外内容 -->
			<view class="yui-tabs__extra">
				<slot name="extra"></slot>
			</view>
		</view>
		<view v-if="isFixed" class="yui-tabs__placeholder" :style="[{height:placeholderHeight+'px'}]"></view>
		<!-- 标签内容：普通实现 -->
		<view v-if="!noRenderConent && !swiper" class="yui-tabs__content" :class="{'yui-tabs__content--animated':animated,'yui-tabs__content--scrollspy':scrollspy}">
			<view class="yui-tabs__track" :style="[trackStyle]">
				<view class="yui-tab__pane" :class="[paneClass(index,tab)]" v-for="(tab,index) in tabList" :key="index" :style="[tab.paneStyle]" @touchstart="touchStart"
					@touchmove="touchMove($event,index)" @touchend="touchEnd($event,index)">
					<view v-if="tab.rendered ? true :value == index">
						<slot :name="tab.slot"></slot>
					</view>
				</view>
			</view>
		</view>

		<!-- 标签内容：使用swiper组件实现左右滑动 -->
		<swiper v-if="!noRenderConent && swiper" class="yui-tabs__swiper" :current="current" :duration="swiperDuration" @change="onSwiperChange">
			<swiper-item class="yui-tabs__swiper--item" v-for="(tab,index) in tabList" :key="index" @touchmove="stopTouchMove">
				<view class="yui-tabs__swiper--wrap" v-if="tab.rendered ? true :value == index">
					<slot :name="tab.slot"></slot>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		isNull,
		addUnit,
		isDef,
		isObject,
		getDirection,
		callInterceptor,
	} from "../yui-tabs/utils/uitls"
	import {
		emits,
		props,
		valueField
	} from "../yui-tabs/utils/const"
	import { touchMixin } from "../yui-tabs/utils/touchMixin"

	export default {
		name: "yui-tabs",
		mixins: [touchMixin],
		emits,
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		props,
		data() {
			return {
				currentIndex: null,
				tabList: [], //标签页数据
				scrollId: 'tab_0', //值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
				scrollLeft: 0, //设置横向滚动条位置
				extraWidth: 0, //标签栏右侧额外区域宽度
				contentWidth: 0, //标签内容宽度
				trackStyle: null, //标签内容滑动轨道样式
				touchInfo: {
					inited: false, //标记左右滑动时的初始化状态
					startX: null, //记录touch位置的横坐标
					startY: null, //记录touch位置的纵坐标
					moved: false, //用来判断是否是一次移动
					deltaX: 0, //记录拖动的横坐标距离
					isLeftSide: false, //标记是否为左滑
				},
				// 标签栏底部线条动画相关
				lineAnimated: false, //是否开启标签栏底部线条动画（首次不开启）
				lineAnimatedStyle: {
					transform: `translateX(-100%) translateX(-50%)`,
					transitionDuration: `0s`
				}, //标签栏底部线条动画样式
				isFixed: false, //是否吸顶
				current: this.currentIndex, //当前显示的滚动卡片
				isTabClick: false, //是否为标签标题点击
				placeholderHeight: 0, //标题栏占位高度
				windowHeight: 0, //屏幕高度
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
				return `yui-tabs--${this.type} ${this.visible?'yui-tabs--visible':''} ${this.fixed || this.isFixed?'yui-tabs--fixed':''} ${this.swiper?'yui-tabs--swiper':''} `
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
				const style = {
					background: this.background,
				}
				// 滚动吸顶下
				if (this.fixed || this.isFixed) {
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
					const height = addUnit(lineHeight);
					lineStyle.height = height;
					lineStyle.borderRadius = height;
				}
				return lineStyle
			},
			// 是否允许横向滚动
			scrollX() {
				return !this.ellipsis && this.type !== "card" && this.tabs.length > this.scrollThreshold
			},
			// 标签数量
			dataLen() {
				return this.tabList.length
			},
			// swiper组件滑动动画时长
			swiperDuration() {
				return this.animated ? this.duration * 1000 : 0
			},
			// 粘性布局下的滚动偏移量
			scrollOffset() {
				return this.sticky ? this.offsetTop + this.placeholderHeight : 0;
			},
		},
		watch: {
			// 监听tabs变化，重新初始化tabList
			tabs: {
				handler() {
					this.updateTabList(); //更新tabList
				},
				deep: true
			},
			currentIndex: {
				handler(newIdx, oldIdx) {
					this.current = newIdx
					this.tabChange(newIdx, oldIdx) //标签切换
					this.changeStyle() // 样式切换
				},
			},
		},
		created() {
			// 监听选中标识符变化
			this.$watch(valueField, (index) => {
				if (index !== this.currentIndex) {
					this.setCurrentIndex(index) //设置当前下标
					setTimeout(() => {
						this.scrollToTop() //滚动到顶 
						this.scrollToCurrContent() //滚动到当前标签内容
					}, 0)
				}
			})
			this.initTabList() // 初始化tabList
		},
		mounted() {
			this.$nextTick(() => {
				this.init() //初始化操作
				this.listenEvent(); //监听事件
			})
		},
		methods: {
			// @exposed-api
			resize() {
				// 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘
				this.init()
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
			// 标签项class
			tabClass(index, tab) {
				return `yui-tab_${index} ${tab.active?'yui-tab--active':''} ${this.ellipsis && !this.scrollX?'yui-tab__ellipsis':''}`
			},
			// 标签内容class
			paneClass(index, tab) {
				return `yui-tab__pane${index} ${tab.active?'yui-pane--active':''}`
			},
			// 标签项style
			tabStyle(tab) {
				let activeColor = this.titleActiveColor
				let inactiveColor = this.titleInactiveColor
				let background = ""
				let borderColor = ""
				// type="line" 时
				if (this.type === "line") {
					if (isNull(activeColor)) activeColor = "#646566"
					if (isNull(inactiveColor)) inactiveColor = "#323233"
				} else if (this.type === "text") { // type="text" 时，选中时使用主题色
					if (isNull(activeColor)) activeColor = this.color
					if (isNull(inactiveColor)) inactiveColor = "#323233"
				} else if (this.type === "card") { // type="card" 时，未选中则使用主题色
					background = this.color
					if (isNull(activeColor)) activeColor = "#fff"
					if (isNull(inactiveColor)) inactiveColor = this.color
				} else if (this.type === "button") { // type="button" 时
					background = this.color
					if (isNull(activeColor)) activeColor = "#fff"
					if (isNull(inactiveColor)) inactiveColor = "#323233"
				} else if (this.type === "line-button") { // type="line-button" 时
					borderColor = this.color
					if (isNull(activeColor)) activeColor = this.color
					if (isNull(inactiveColor)) inactiveColor = "#323233"
				}
				return {
					color: tab.active ? activeColor : inactiveColor,
					background: tab.active ? background : "",
					borderColor: tab.active ? borderColor : "",
				}
			},
			// 标题右上角信息class
			infoClass(tab) {
				return ` yui-tab__info ${tab.dot?'yui-tab__info--dot':''}`
			},
			// 监听事件
			listenEvent() {
				const that = this
				if (that.sticky || that.scrollspy) {
					uni.$on('onPageScroll', function(e) {
						const {
							stickyThreshold,
							offsetTop,
							scrollspy,
							lockedScrollspy,
						} = that
						// 粘性定位布局的吸顶处理
						that.getRect('.depend-wrap').then((rect) => {
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
					const selectors = this.tabList.map((o, i) => '.yui-tab__pane' + i)
					this.getRect(...selectors).then(res => {
						// 标签内容的top小于标题栏的top，则说明已经与标题栏部分重合
						let index = res.reduce((idx, o, i) => o.top < this.scrollOffset ? i : idx, 0)
						// 判断最后一个标签内容是否完整显示在底部，是则默认选中
						// const lastRect = res[res.length - 1] //最后一个标签内容
						// if (lastRect.bottom <= this.windowHeight) index = res.length - 1
						resolve(index)
					})
				})
			},
			// 初始化tabList
			initTabList() {
				const tabs = this.tabs.filter(o => !isNull(o))
				this.tabList = tabs.map((item, index) => {
					const isCurr = this.currentIndex == index
					const tab = {
						label: '', //标签名称
						slot: 'pane' + index, //标签内容的插槽名称，默认以"pane"+标签下标命名
						titleSlot: 'title' + index, //标签标题的插槽名称，默认以"title"+标签下标命名
						disabled: false, //是否禁用标签
						active: false, //是否选中
						rendered: !this.isLazyRender || this.scrollspy, //标记是否渲染过，非懒加载与滚动导航模式下默认渲染
						show: this.scrollspy, // 是否显示内容（滚动导航模式默认显示）
						dot: false, //是否在标题右上角显示小红点
						translateX: 0, //底部线条translateX值，
						scrollLeft: 0, //当前标签对应的横向滚动条位置
						paneTop: 0, //滚动导航模式下标签内容距离屏幕顶部的距离
					}

					tab.paneStyle = this.animated ? {
						visibility: tab.show ? 'visible' : 'visible',
						height: tab.show ? 'auto' : '0px'
					} : {
						display: tab.show ? 'block' : 'none'
					};
					// 读取标签对象值
					if (isObject(item)) {
						tab.label = item.label
						tab.slot = isNull(item.slot) ? tab.slot : item.slot
						tab.titleSlot = isNull(item.titleSlot) ? tab.titleSlot : item.titleSlot
						tab.dot = isNull(item.dot) ? tab.dot : item.dot
						tab.badge = !isNull(item.badge) && !tab.dot ? item.badge : ""
					} else {
						tab.label = item
					}
					return tab
				})

			},
			// 更新tabList
			updateTabList() {
				// 如果长度有变化,表示tabs有删除或新增,重新init一次
				if (this.tabs.length != this.dataLen) {
					this.initTabList() //初始化tabList
				} else {
					// 否则仅仅更改label,badge,dot值
					this.tabs.forEach((item, i) => {
						const tab = this.tabList[i]
						// 读取标签对象值
						if (isObject(item)) {
							this.$set(tab, "label", item.label)
							this.$set(tab, "dot", isNull(item.dot) ? tab.dot : item.dot)
							this.$set(tab, "badge", !isNull(item.badge) && !tab.dot ? item.badge : "")
						} else {
							this.$set(tab, "label", item)
						}
					})
				}

				this.$nextTick(() => {
					this.init() //初始化操作
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

				// 计算每个tab的相关参数
				const isSpy = this.scrollspy //是否滚动导航模式
				const selectors = this.tabList.reduce((arr, tab, index) => {
					arr.push('.yui-tab_' + index)
					if(isSpy) arr.push('.yui-tab__pane' + index)
					return arr
				}, [])
				const rects = await this.getRect(...selectors);
				this.tabList.forEach((tab) => {
					const [r1, r2] = rects.splice(0, isSpy ? 2 : 1)
					tab.translateX = r1 ? r1.left + r1.width / 2 - parentLeft : 0 //标签线条偏移量
					tab.scrollLeft = tab.translateX - halfWrapWidth //标签相对于屏幕左侧的距离值
					if (isSpy) tab.paneTop = r2 ? r2.top : 0; //标签内容相对于屏幕顶部的距离值
				})
				this.setCurrentIndex(this[valueField]) //设置当前下标
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
				const currTab = this.tabList[newIdx] //当前tab
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
			// 滚动到顶
			scrollToTop() {
				//标签点击时页面回滚顶部
				if (!this.scrollspy && this.tabClickScrollTop) {
					setTimeout(function() {
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 0
						});
					}, this.duration * 1000);
				}
			},
			// 滚动到当前标签内容
			scrollToCurrContent(immediate = false) {
				if (this.scrollspy) {
					const duration = immediate ? 0 : this.duration * 1000
					this.lockedScrollspy = true
					uni.pageScrollTo({
						scrollTop: this.tabList[this.currentIndex].paneTop,
						duration,
					});
					setTimeout(() => {
						this.lockedScrollspy = false
					}, duration * 2)
				}
			},
			// 标签切换
			tabChange(newIdx, oldIdx) {
				const oldTab = this.tabList[oldIdx] || {} //上一个tab
				const currTab = this.tabList[newIdx] || {} //当前tab
				// 设置选中态
				oldTab.active = false
				currTab.active = true

				//非滚动导航模式下
				if (!this.scrollspy) {
					currTab.rendered = true //标记当前tab的内容渲染过
					oldTab.show = false //隐藏旧tab的内容
					currTab.show = true //显示当前tab的内容
				}
			},
			// 样式切换
			changeStyle() {
				this.scrollIntoView() //将活动的tab滚动到视图中
				this.setLine() //改变标签栏底部线条位置
				// 标签内容滑动非swiper实现及非滚动导航模式时
				if (!this.swiper && !this.scrollspy) {
					this.changeTrackStyle(false, this.duration) //改变标签内容滑动轨道样式
					this.changePaneStyle() //改变标签内容样式
				}
			},
			// 将活动的tab滚动到视图中
			scrollIntoView() {
				// 标签栏允许滚动:设置横向滚动条位置，scrollToCenter为true，当前标签则滚动至中心位置
				if (this.scrollX) {
					if (this.scrollToCenter) this.scrollLeft = this.tabList[this.currentIndex].scrollLeft
					else this.scrollId = `tab_${this.currentIndex-1}`;
				}
			},
			// 设置标签栏底部线条位置
			setLine() {
				if (this.isLine) { // 仅在 type="line" 时有效
					console.log("currentIndex:", this.currentIndex);
					const val = this.tabList[this.currentIndex].translateX
					const transform = `translateX(${isDef(val) ? val + "px" : '-100%'}) translateX(-50%)`
					const duration = `${this.lineAnimated?this.duration:'0'}s`
					this.$set(this.lineAnimatedStyle, 'transform', transform)
					this.$set(this.lineAnimatedStyle, 'transitionDuration', duration)
					this.lineAnimated = true //是否开启标签栏动画
				}
			},
			// 改变标签内容滑动轨道样式
			changeTrackStyle(isSlide = false, duration = 0, offsetWidth = 0) {
				if (this.animated) {
					// isSlide为true，表示左右滑动；false表示点击标签的转场动画
					this.trackStyle = {
						'transform': isSlide ? `translate3d(${offsetWidth}px,0,0)` : `translateX(${-100 * this.currentIndex}%)`,
						'transition': `transform ${duration}s ease-in-out`
					}
				}
			},
			// 改变标签内容样式
			changePaneStyle() {
				this.getRect('.yui-tab__pane' + this.currentIndex).then(rect => {
					// 有拖动动画时，隐藏的标签内容高度取显示的标签内容高度
					const height = rect && this.swipeAnimated ? rect.height : 0
					this.tabList.forEach(tab => {
						const paneStyle = this.animated ? {
							// 有拖动动画时或指定标签内容显示时，为visible
							visibility: this.swipeAnimated || tab.show ? 'visible' : 'hidden',
							height: tab.show ? 'auto' : height + 'px'
						} : {
							display: tab.show ? 'block' : 'none'
						};
						this.$set(tab, "paneStyle", paneStyle)
					})
				})
			},
			// 禁止swiper组件手动滑动
			stopTouchMove(event) {
				if (!this.swipeable) event.stopPropagation()
			},
			// swiper组件的current改变时会触发 change 事件
			onSwiperChange(e) {
				this.setCurrentIndex(e.target.current || e.detail.current) //设置当前下标
			},
		}
	}
</script>

<style lang="less" scoped>
	@import url("css/index.less");
</style>
