<template>
	<view class="yui-tabs" :class="[tabsClass]">
		<!-- 依赖元素，用于处理滚动吸顶所需 -->
		<view class="depend-wrap"></view>
		<!-- 标签区域 -->
		<view class="yui-tabs__wrap" :style="[innerWrapStyle,wrapStyle]">
			<!-- scrollX为true，表示允许横向滚动 -->
			<scroll-view class="yui-tabs__scroll" :class="[scrollX?'enable-sroll':'']" :scroll-x="scrollX"
				:scroll-anchoring="true" enable-flex :scroll-left="scrollLeft"
				:scroll-into-view="!scrollToCenter?scrollId:''" scroll-with-animation :style="[scrollStyle]">
				<view class="yui-tabs__nav" :class="[navClass]" :style=[navStyle]>
					<view class="yui-tab" v-for="(tab,index) in tabList" :key="index" @tap.stop="handleClick(index)"
						:id="`tab_${index}`" :class="[tabClass(index, tab)]" :style="[tabStyle(tab)]">
						<view class="yui-tab__text">
							<slot :name="tab.titleSlot">{{tab.label}}</slot>
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
		<!-- 标签内容 -->
		<view class="yui-tabs__content" :class="{'yui-tabs__content--animated':animated}">
			<view class="yui-tabs__track" :style="[trackStyle]">
				<view class="yui-tab__pane" :class="[paneClass(index,tab)]" v-for="(tab,index) in tabList" :key="index"
					:style="[tab.paneStyle]" @touchstart="touchStart" @touchmove="touchMove($event,index)"
					@touchend="touchEnd($event,index)">
					<view v-if="tab.rendered ? true :value == index">
						<slot :name="tab.slot"></slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 1.优化滑动切换与上下滚动互相影响的bug。
	// 2.考虑是否增加滚动导航
	import {
		isNull,
		addUnit,
		isDef,
		isObject,
		getDirection
	} from "../yui-tabs/utils/uitls.js"
	export default {
		name: "yui-tabs",
		emits: ['input', 'change', 'click', 'rendered', 'scroll'],
		// uni-app自定义v-model需要按照如下的规范，直接用value和input，否则在微信小程序上会失效
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			color: String, //标签主题色, 默认值为"#0022AB"
			background: String, //标签栏背景色,默认值为"#fff"
			lineWidth: [Number, String], //底部条宽度，默认单位为px, 默认值为20px
			lineHeight: [Number, String], //底部条高度，默认单位为px,默认值为3px
			titleActiveColor: String, //标题选中态颜色
			titleInactiveColor: String, //标题默认态颜色
			// 标签栏样式
			wrapStyle: {
				type: [Object, null],
				default: () => {}
			},
			// 动画时间，单位秒
			duration: {
				type: [Number, String],
				default: 0.3,
			},
			// 样式风格类型，可选值为 card
			type: {
				type: String,
				default: "line"
			},
			// v-model绑定属性，绑定当前选中标签的标识符（标签的下标）
			value: {
				type: Number,
				default: -1
			},
			// 标签页数据，支持字符串类型与对象类型的数组结构
			// 对象类型需符合{label:'标签1',slot:'slotName'}这样的格式，slot为自定义的标签内容插槽名，否则插槽名默认为"pane"+tab下标的命名
			tabs: {
				type: Array,
				default: () => []
			},
			// 是否开启延迟渲染（首次切换到标签时才触发内容渲染）
			isLazyRender: {
				type: Boolean,
				default: true,
			},
			// 是否开启切换标签内容时的转场动画
			animated: {
				type: Boolean,
				default: false
			},
			// 保证组件的可见性，主要用于处理选中标签的底部线条位置
			visible: {
				type: Boolean,
				default: true
			},
			// 标签页是否滚动吸顶
			fixed: Boolean,
			// 滚动吸顶下与顶部的最小距离，默认 px
			offsetTop: {
				type: Number,
				default: 0
			},
			// 滚动吸顶/粘性布局下，标签栏的z-index值
			zIndex: {
				type: Number,
				default: 99
			},
			// 是否使用粘性定位布局
			sticky: Boolean,
			// 粘性布局的判断阈值
			stickyThreshold: {
				type: Number,
				default: 0
			},
			// 标签栏滚动时当前标签居中
			scrollToCenter: {
				type: Boolean,
				default: true,
			},
			//  标签栏的滚动阈值(仅在ellipsis="false"且type不为"card"下时有效)，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动(切换时会自动将当前标签居中)
			scrollThreshold: {
				type: [Number, String],
				default: 5
			},
			// 是否省略过长的标题文字
			ellipsis: {
				type: Boolean,
				default: true,
			},
			// 是否开启手势滑动切换
			swipeable: {
				type: Boolean,
				default: false,
			},
			// 是否开启标签内容的拖动动画（该属性依赖于swipeable、is-lazy-render的开启;该属性开启时考虑给包裹内容的容器增加一个min-height，因为开启该属性后，其他未显示出来的标签内容会沿用当前显示的高度，拖动切换后由于高度不一致会有回弹）
			swipeAnimated: {
				type: Boolean,
				default: false,
			},
			// 滑动切换的滑动距离阈值，手指滑动页面触发切换的阈值,单位为px，表示横向滑动整个可视区域的多少px时才切换标签内容
			swipeThreshold: {
				type: [Number, String],
				default: 50,
			},
		},
		data() {
			return {
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
			}
		},
		computed: {
			// 样式风格是否为line
			isLine() {
				return this.type === "line"
			},
			// 标签页容器class
			tabsClass() {
				return `yui-tabs--${this.type} ${this.visible?'yui-tabs--visible':''} ${this.fixed || this.isFixed?'yui-tabs--fixed':''} `
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
			dataLen() {
				return this.tabList.length
			}
		},
		watch: {
			// 监听选中标识符变化
			value: {
				handler(val, oldVal) {
					this.tabChange(val, oldVal) //标签切换
					this.changeStyle() // 样式切换
				}
			},
			// 监听tabs变化，重新初始化tabList
			tabs: {
				handler(val) {
					this.updateTabList(); //更新tabList
				},
				deep: true
			},
		},
		created() {
			this.initTabList() // 初始化tabList
		},
		mounted() {
			this.init() //初始化操作
			this.listenEvent(); //监听事件
		},
		methods: {
			// 获取元素位置信息
			getRect(select) {
				return new Promise((res, rej) => {
					if (!select) rej('Parameter is empty');
					let query
					// #ifdef MP-ALIPAY
					query = uni.createSelectorQuery()
					// #endif
					// #ifndef MP-ALIPAY
					query = uni.createSelectorQuery().in(this)
					// #endif
					query.select(select).boundingClientRect(rect => res(rect)).exec();
				})
			},
			// 标签项class
			tabClass(index, tab) {
				return `yui-tab_${index} ${tab.active?'yui-tab--active':''} ${this.ellipsis && !this.scrollX?'yui-tab__ellipsis':''}`
			},
			// 标签内容class
			paneClass(index, tab) {
				return `yui-tab_pane${index} ${tab.active?'yui-pane--active':''}`
			},
			// 标签项style
			tabStyle(tab) {
				let activeColor = this.titleActiveColor
				let inactiveColor = this.titleInactiveColor
				let background = ""
				// type="text" 时，选中时使用主题色
				if (this.type === "text" && isNull(activeColor)) {
					activeColor = this.color
				}

				// type="card" 时，未选中则使用主题色
				if (this.type === "card") {
					background = this.color
					if (isNull(inactiveColor)) inactiveColor = this.color
				}

				// type="button" 时
				if (this.type === "button") {
					background = this.color
				}
				return {
					color: tab.active ? activeColor : inactiveColor,
					background: tab.active ? background : "",
				}
			},
			// 标题右上角信息class
			infoClass(tab) {
				return ` yui-tab__info ${tab.dot?'yui-tab__info--dot':''}`
			},
			// 监听事件
			listenEvent() {
				const that = this
				// 粘性定位布局下的吸顶处理
				if (this.sticky) {
					uni.$on('onPageScroll', function(e) {
						that.getRect('.depend-wrap').then(rect => {
							that.isFixed = rect.bottom - that.stickyThreshold <= that.offsetTop
							// 	滚动时触发，仅在 sticky 模式下生效,{ scrollTop: 距离顶部位置, isFixed: 是否吸顶 }
							that.$emit("scroll", {
								scrollTop: e.scrollTop,
								isFixed: that.isFixed
							})
						})
					})
				}
			},
			// 初始化操作 
			async init() {
				//获取额外区域的宽度
				let rect = await this.getRect('.yui-tabs__extra')
				this.extraWidth = rect ? rect.width : 0

				//获取标签内容区域的宽度
				rect = await this.getRect('.yui-tabs__content')
				this.contentWidth = rect ? rect.width : 0

				//获取标签容器距离视口左侧的left值
				rect = await this.getRect('.yui-tabs')
				const parentLeft = rect ? rect.left : 0
				// 保存每个tab的translateX
				this.tabList.forEach(async (tab, index) => {
					const rect = await this.getRect('.yui-tab_' + index);
					tab.translateX = rect ? rect.left + rect.width / 2 - parentLeft : 0
					tab.scrollLeft = tab.translateX - this.contentWidth / 2
					if (tab.scrollLeft < 0) tab.scrollLeft = 0
					if (index === this.value) {
						this.tabChange(this.value, -1) //标签切换
						this.changeStyle(); //样式切换
					}
				})
			},
			// 初始化tabList
			initTabList() {
				const tabs = this.tabs.filter(o => !isNull(o))
				this.tabList = tabs.map((item, index) => {
					const isCurr = this.value == index
					const tab = {
						label: '', //标签名称
						slot: 'pane' + index, //标签内容的插槽名称，默认以"pane"+标签下标命名
						titleSlot: 'title' + index, //标签标题的插槽名称，默认以"title"+标签下标命名
						disabled: false, //是否禁用标签
						active: false, //是否选中
						rendered: !this.isLazyRender, //标记是否渲染过
						show: false, // 是否显示内容
						dot: false, //是否在标题右上角显示小红点
						translateX: 0, //底部线条translateX值，
						scrollLeft: 0, //当前标签对应的横向滚动条位置
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
			// 标签点击事件
			handleClick(index) {
				// if (this.tabList[index].disabled) return //禁用时不允许切换
				this.$emit('click', index, this.tabs[index]) // 标签点击事件
				if (this.value == index) return //不允许重复切换同一标签
				const oldValue = this.value //获取旧的index
				//更新v-model绑定的值
				this.$emit('input', index) //更新v-model绑定的值
			},
			// 标签切换
			tabChange(value, oldValue) {
				const oldTab = this.tabList[oldValue] || {} //上一个tab
				const currTab = this.tabList[value] //当前tab
				// 设置选中态
				oldTab.active = false
				currTab.active = true

				// 触发rendered事件
				if (this.isLazyRender && !currTab.rendered) {
					this.$emit('rendered', value, this.tabs[value])
				}
				currTab.rendered = true //标记渲染过

				oldTab.show = false //隐藏旧内容区域
				currTab.show = true //显示当前tab对应的内容区域
				// 触发change事件
				if (oldValue !== -1) this.$emit('change', value, this.tabs[value])
			},
			// 样式切换
			changeStyle() {
				// 标签栏允许滚动
				if (this.scrollX) {
					if (this.scrollToCenter) {
						// 设置横向滚动条位置，当前标签滚动到中心位置
						this.scrollLeft = this.tabList[this.value].scrollLeft
						console.log(this.scrollLeft);
					} else {
						//设置scroll-into-view
						this.scrollId = `tab_${this.value-1}`;
					}
				}
				this.changeLineStyle() //改变标签栏底部线条位置
				this.changeTrackStyle(false, this.duration) //改变标签内容滑动轨道样式
				this.changePaneStyle() //改变标签内容样式
			},
			// 改变标签栏底部线条位置
			changeLineStyle() {
				// 仅在 type="line" 时有效
				if (!this.isLine) return
				const val = this.tabList[this.value].translateX
				const transform = `translateX(${isDef(val) ? val + "px" : '-100%'}) translateX(-50%)`
				const duration = `${this.lineAnimated?this.duration:'0'}s`
				this.$set(this.lineAnimatedStyle, 'transform', transform)
				this.$set(this.lineAnimatedStyle, 'transitionDuration', duration)

				this.$nextTick(() => {
					this.lineAnimated = true //是否开启标签栏动画
				})
			},
			// 改变标签内容滑动轨道样式
			changeTrackStyle(isSlide = false, duration = 0, offsetWidth = 0) {
				if (!this.animated) return
				// isSlide为true，表示左右滑动；false表示点击标签的转场动画
				this.trackStyle = {
					'transform': isSlide ? `translate3d(${offsetWidth}px,0,0)` : `translateX(${-100 * this.value}%)`,
					'transition': `transform ${duration}s ease-in-out`
				}
			},
			// 改变标签内容样式
			changePaneStyle() {
				this.getRect('.yui-tab__pane' + this.value).then(rect => {
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
			touchStart(e) {
				// 禁止滑动
				if (!this.swipeable) return
				this.touchInfo.inited = true //touch开始时,将touchInfo对象设置为已初始化状态
				const touch = e.touches[0];
				// 记录touch位置的横坐标与纵坐标
				this.touchInfo.startX = touch.pageX
				this.touchInfo.startY = touch.pageY

				this.touchInfo.moved = false //用来判断是否是一次移动
			},
			touchMove(e, index) {
				if (!this.touchInfo.inited) return
				const {
					pageX,
					pageY
				} = e.changedTouches[0];
				const {
					startX,
					startY
				} = this.touchInfo || {}

				// 滑动方向不为左右时阻止
				const direction = getDirection(startX, startY, pageX, pageY)
				if (direction != 3 && direction != 4) return
				e.stopPropagation()

				// 横坐标偏移量
				const deltaX = pageX - startX

				// 标记是左滑还是右滑
				const isLeftSide = deltaX >= 0
				// 如果当前为第一页内容，则不允许左滑；最后一页内容，则不允许右滑
				if ((isLeftSide && index == 0) || (!isLeftSide && index == this.dataLen - 1)) {
					return
				}
				this.touchInfo.isLeftSide = isLeftSide
				this.touchInfo.moved = true
				this.touchInfo.deltaX = Math.abs(deltaX)
				// 改变标签内容的样式，模拟拖动动画效果
				if (this.swipeAnimated) {
					const offsetWidth = this.contentWidth * this.value * -1 + deltaX
					this.changeTrackStyle(true, 0, offsetWidth)
				}
			},
			touchEnd(e, index) {
				if (!this.touchInfo.moved) return
				const {
					isLeftSide,
					deltaX
				} = this.touchInfo || {}
				// 移动的横坐标偏移量大于指定的滚动阈值时,则切换显示状态,否则还原
				if (Math.abs(deltaX) > Number(this.swipeThreshold)) {
					// 根据是否为左滑查找需要滑动到的标签内容页下标，切换标签内容
					index = index + (isLeftSide ? -1 : 1)
					if (index > -1 && index < this.dataLen) this.handleClick(index)
				} else {
					this.changeTrackStyle(false, this.duration)
				}
				// 一次touch完成后,重置touchInfo对象尚未初始化状态
				this.touchInfo.inited = false
			},
			// 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘
			resize() {
				this.init()
			},
		}
	}
</script>

<style lang="less" scoped>
	@bgColor: #fff; //背景色
	@themeColor: #0022AB; //主题色
	@inactiveColor: #646566; //标题未选中颜色
	@activeColor: #323233; //标题选中颜色
	@cardActiveColor: #fff; //type=="card"下的标题选中颜色
	@disabledColor: #c8c9cc; //禁用颜色
	@dotColor: #e53935; //小红点、徽标背景色
	@badgeColor: #fff; //徽标内容颜色

	.yui-tabs {
		position: relative;
		width: 100%;

		.depend-wrap {
			position: absolute;
			top: 0;
		}


		// 开启粘性定位布局
		&--fixed {

			// 导航区域包裹层
			.yui-tabs__wrap {
				position: fixed;
				top: 0;
				right: 0;
				left: 0;
				z-index: 99;
			}
		}

		// 不显示滚动条
		::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
			-webkit-appearance: none;
			background: transparent;
			color: transparent;
		}

		// 导航区域包裹层
		&__wrap {
			position: relative;
			display: flex;
			align-items: center;
			overflow: hidden;
			visibility: hidden;
			height: 0;
			background: @bgColor;
		}

		// 标签页可见
		&--visible {

			// 导航区域包裹层
			.yui-tabs__wrap {
				visibility: visible;
				height: auto;
			}
		}

		// 卡片风格
		&--card {

			// 导航区域包裹层
			.yui-tabs__wrap {
				margin: 0 32rpx;
				border-radius: 8rpx;
			}
		}

		// 按钮风格
		&--button {

			// 导航区域包裹层
			.yui-tabs__wrap {
				margin: 0 32rpx;
			}
		}


		// scroll-view组件样式
		&__scroll {
			position: relative;
			width: 100%;
			height: 80rpx;

			// 允许滚动
			&.enable-sroll {
				white-space: nowrap; // 使用横向滚动时，需要给<scroll-view>添加white-space: nowrap;样式
			}
		}


		// 导航区域
		&__nav {
			position: relative;
			box-sizing: content-box;
			user-select: none;
			height: 80rpx;
			flex: 1;
			display: flex;


			// 导航标签
			.yui-tab {
				position: relative;
				display: inline-block;
				line-height: 80rpx;
				font-size: 28rpx;
				color: @inactiveColor;
				text-align: center;
				padding: 0 8rpx;
				flex: 1;
				cursor: pointer;
				-webkit-tap-highlight-color: transparent;
				transition-property: color background-color;
				transition-duration: 0.1s;

				// 选中状态
				&--active {
					color: @activeColor;
					font-weight: 500;
				}

				// 禁用状态
				&--disabled {
					color: @disabledColor;
					cursor: not-allowed;
				}


				// 标题文字
				&__text {
					position: relative;
					display: inline;
				}


				// 文字省略
				&__ellipsis {
					display: -webkit-box; //定义为盒子显示
					overflow: hidden;
					text-overflow: ellipsis; //文本溢出隐藏为省略号
					-webkit-line-clamp: 1; // 限制一个块元素显示的文本行数
					-webkit-box-orient: vertical; //盒模型子元素排列： vertical（竖排）orhorizontal（横排）
				}

				// 标签文字右上角徽标的内容
				&__info {
					display: inline-block;
					position: absolute;
					top: 0;
					right: 0;
					box-sizing: border-box;
					min-width: 36rpx;
					padding: 0 4rpx;
					color: @badgeColor;
					font-weight: 500;
					font-size: 18rpx;
					line-height: 26rpx;
					text-align: center;
					background-color: @dotColor;
					border-radius: 36rpx;
					transform: translate(50%, -50%);
					transform-origin: 100%;
					text-align: center;
				}

				&__info--dot {
					line-height: unset;
					padding: 0;
					width: 12rpx;
					min-width: 0;
					height: 12rpx;
					background-color: @dotColor;
					border-radius: 100%;
				}
			}

			// 文本风格
			&--text {

				.yui-tab {
					&--active {
						color: @themeColor;
					}
				}
			}

			// 卡片风格
			&--card {
				box-sizing: border-box;
				border: 2rpx solid @themeColor;
				border-radius: 8rpx;

				.yui-tab {
					color: @themeColor;

					&--active {
						background-color: @themeColor;
						color: @cardActiveColor;
					}
				}
			}

			// 按钮风格
			&--button {
				.yui-tab {
					height: 40rpx;
					line-height: 40rpx;
					margin-top: 20rpx;
					border-radius: 4rpx;
					flex: unset;

					&--active {
						background-color: @themeColor;
						color: @cardActiveColor;
					}
				}
			}

		}


		// 标签右侧的补充区域
		&__extra {
			position: relative;
			display: inline-flex;
			white-space: nowrap;
		}

		// 底部线条
		&__line {
			position: absolute;
			bottom: 6rpx;
			left: 0;
			width: 40rpx;
			height: 6rpx;
			background-color: @themeColor;
			border-radius: 6rpx;
			transform: translateX(-100%) translateX(-50%);
			// transition-duration: 0.3s;
		}


		// 标签内容的滑动轨道容器
		&__track {
			position: relative;
			display: flex;
			width: 100%;
			height: unset;
			will-change: left;
			background-color: @bgColor;
		}

		// 标签内容
		&__content {
			background-color: @bgColor;
			overflow: hidden;

			.yui-tab__pane {
				flex-shrink: 0;
				box-sizing: border-box;
				width: 100%;
			}
		}

		// 标签内容转场动画样式
		&__content--animated {
			overflow: hidden;

			.yui-tab__pane {
				transition-duration: 0.3s;
			}
		}
	}
</style>
