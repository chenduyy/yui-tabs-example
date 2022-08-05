<template>
	<view class="yui-tabs" :class="{'yui-tabs--visible':visible,'yui-tabs--fixed':fixed}">
		<!-- 标签区域 -->
		<view class="yui-tabs__wrap" :style="[wrapStyle,innerWrapStyle]">
			<!-- scrollX为true，表示允许横向滚动 -->
			<scroll-view v-if="scrollX" class="yui-tabs__scroll" :scroll-x="scrollX" :scroll-anchoring="true"
				enable-flex :scroll-into-view="scrollId" scroll-with-animation :style="[scrollStyle]">
				<view class="yui-tabs__nav">
					<view class="yui-tab" v-for="(tab,index) in tabList" :key="index" @click="handleClick(index)"
						:id="`tab_${index}`" :class="[tabClass(index, tab)]" :style="[tabStyle(tab)]">
						<view class="yui-tab__text" :class="{'yui-tab__text--ellipsis':ellipsis}">
							{{tab.label}}
						</view>
					</view>
					<view class="yui-tabs__line" :style="[lineStyle,lineAnimatedStyle]"></view>
				</view>
			</scroll-view>
			<view v-else class="yui-tabs__nav">
				<view class="yui-tab" v-for="(tab,index) in tabList" :key="index" @click="handleClick(index)"
					:id="`tab_${index}`" :class="[tabClass(index, tab)]" :style="[tabStyle(tab)]">
					<view class="yui-tab__text" :class="{'yui-tab__text--ellipsis':ellipsis}">
						{{tab.label}}
					</view>
				</view>
				<view class="yui-tabs__line" :style="[lineStyle,lineAnimatedStyle]"></view>
			</view>
			<view class="yui-tabs__extra">
				<slot name="extra"></slot>
			</view>
		</view>
		<!-- 标签内容 -->
		<view class="yui-tabs__content" :class="{'yui-tabs__content--animated':animated}">
			<view class="yui-tabs__track" :style="[trackStyle]">
				<view class="yui-tab__pane" v-for="(tab,index) in tabList" :key="index" :style="[paneStyle(tab)]"
					@touchstart="touchStart" @touchend="touchEnd($event,index)">
					<view v-if="tab.rendered ? true :value == index">
						<slot :name="tab.slot"></slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		isNull,
		addUnit,
		isDef,
		isObject,
		getDirection
	} from "@/common/uitls.js"
	export default {
		name: "yui-tabs",
		emits: ['input', 'change', 'click'],
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
			// v-model绑定属性，绑定当前选中标签的标识符（标签的下标）
			value: {
				type: Number,
				default: -1
			},
			// 标签页是否滚动吸顶
			fixed: Boolean,
			// 滚动吸顶下与顶部的最小距离，默认 px
			offsetTop: {
				type: Number,
				default: 0
			},
			// 滚动吸顶下，标签栏的z-index值
			zIndex: {
				type: Number,
				default: 99
			},
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
			// 导航标签滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动
			swipeThreshold: {
				type: [Number, String],
				default: 5
			},
			// 是否省略过长的标题文字（注意：标签数量未超过导航标签滚动阈值时才生效）
			ellipsis: {
				type: Boolean,
				default: true,
			},
			// 是否开启手势滑动切换
			swipeable: {
				type: Boolean,
				default: false,
			},
			// 滚动阈值，手指滑动页面触发切换的阈值,单位为px，表示横向滑动整个可视区域的多少px时才切换标签内容
			scrollThreshold: {
				type: [Number, String],
				default: 50,
			},
		},
		data() {
			return {
				tabList: [],
				scrollId: 'tab_0',
				extraWidth: 0, //标签栏右侧额外区域宽度
				trackStyle: null, //标签内容滑动轨道样式
				touchInfo: {
					inited: false, //标记左右滑动时的初始化状态
					startX: null, //记录touch位置的横坐标
					startY: null //记录touch位置的纵坐标
				},
				// 标签栏底部线条动画相关
				translateX: null,
				lineAnimated: false, //是否开启标签栏动画
				lineAnimatedStyle: {
					transform: `translateX(-100%) translateX(-50%)`,
					transitionDuration: `0s`
				}, //标签栏底部线条动画样式
			}
		},
		computed: {
			// 导航区域包裹层样式
			innerWrapStyle() {
				const style = {
					backgroundColor: this.background,
				}

				// 滚动吸顶下
				if (this.fixed) {
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
				return this.tabs.length > this.swipeThreshold
			},
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
					this.initTabList() //初始化tabList
					this.changeStyle() // 样式切换
				},
				deep: true
			},
			// 可见时也需要计算translateX
			visible: {
				handler() {
					this.lineAnimated = false //是否开启标签栏动画
					// this.init() //初始化操作
				}
			},
			// 监听translateX，设置标签栏底部线条动画
			translateX: {
				handler(val) {
					const transform = `translateX(${isDef(val) ? val + "px" : '-100%'}) translateX(-50%)`
					const duration = `${this.lineAnimated?this.duration:'0'}s`
					this.$set(this.lineAnimatedStyle, 'transform', transform)
					this.$set(this.lineAnimatedStyle, 'transitionDuration', duration)
				}
			},
		},
		created() {
			this.initTabList() // 初始化tabList
		},
		mounted() {
			this.init() //初始化操作
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
				return `yui-tab_${index} ${tab.active?'yui-tab--active':''} ${tab.disabled?'yui-tab--disabled':''}`
			},
			// 标签项style
			tabStyle(tab) {
				return {
					color: tab.active ? this.titleActiveColor : this.titleInactiveColor
				}
			},
			// 标签内容style
			paneStyle(tab) {
				if (this.animated) {
					return {
						visibility: tab.show ? 'visible' : 'hidden',
						height: tab.show ? 'auto' : '0px'
					}
				}
				return {
					display: tab.show ? 'block' : 'none'
				}
			},
			// 初始化操作 
			async init() {
				//获取额外区域的宽度
				let rect = await this.getRect('.yui-tabs__extra')
				this.extraWidth = rect ? rect.width : 0

				//获取标签容器距离视口左侧的left值
				rect = await this.getRect('.yui-tabs')
				const parentLeft = rect ? rect.left : 0
				// 保存每个tab的translateX
				this.tabList.forEach(async (tab, index) => {
					const rect = await this.getRect('.yui-tab_' + index);
					tab.translateX = rect.left + rect.width / 2 - parentLeft
					if (index === this.value) this.changeStyle() // 样式切换
				})
			},
			// 初始化tabList
			initTabList() {
				const tabs = this.tabs.filter(o => !isNull(o))
				this.tabList = tabs.map((item, index) => {
					const isCurr = this.value == index
					let obj = {
						label: '', //标签名称
						slot: 'pane' + index, //标签内容的插槽名称,默认以"pane"+标签下标命名
						disabled: false, //是否禁用标签
						active: isCurr, //是否选中
						rendered: isCurr || !this.isLazyRender, //标记是否渲染过
						show: isCurr // this.animated ? true : isCurr //是否显示内容(标签内容转场动画不使用v-show控制显隐,直接显示)
					}
					if (isObject(item)) {
						obj.label = item.label
						obj.slot = isNull(item.slot) ? obj.slot : item.slot
					} else {
						obj.label = item
					}
					return obj
				})
			},
			// 标签点击事件
			handleClick(index) {
				if (this.tabList[index].disabled) return //禁用时不允许切换
				this.$emit('click', index, this.tabs[index]) // 标签点击事件
				if (this.value == index) return //不允许重复切换同一标签
				const oldValue = this.value //获取旧的index
				//更新v-model绑定的值
				this.$emit('input', index) //更新v-model绑定的值
			},
			// 标签切换
			tabChange(value, oldValue) {
				const oldTab = this.tabList[oldValue] //上一个tab
				const currTab = this.tabList[value] //当前tab
				// 设置选中态
				oldTab.active = false
				currTab.active = true
				currTab.rendered = true //标记渲染过

				oldTab.show = false //隐藏旧内容区域
				currTab.show = true //隐藏当前tab对应的内容区域

				// 触发change事件
				this.$emit('change', value, this.tabs[value])
			},
			// 样式切换
			changeStyle() {
				this.scrollId = `tab_${this.value-1}`; //设置scroll-into-view
				this.setTranslateX() //设置translateX
				this.changeTrackStyle(false, this.duration) //改变标签内容滑动轨道样式
			},
			// 设置translateX，用于改变标签栏底部线条位置
			setTranslateX() {
				if (this.tabList[this.value].disabled) return
				this.translateX = this.tabList[this.value].translateX

				this.$nextTick(() => {
					this.lineAnimated = true //是否开启标签栏动画
				})
			},
			// 改变标签内容滑动轨道样式
			changeTrackStyle(isSlide = false, duration = 0, offsetWidth = 0) {
				if (!this.animated) return
				// isSlide标记是否为左右滑动时，否则为点击标签的动画转场
				this.trackStyle = {
					'transform': isSlide ? `translate3d(${offsetWidth}px,0,0)` : `translateX(${-100 * this.value}%)`,
					'transition': `transform ${duration}s ease-in-out`
				}
			},
			touchStart(e) {
				// 禁止滑动
				if (!this.swipeable) return
				this.touchInfo.inited = true //touch开始时,将touchInfo对象设置为已初始化状态
				const touch = e.touches[0];
				// 记录touch位置的横坐标与纵坐标
				this.touchInfo.startX = touch.pageX
				this.touchInfo.startY = touch.pageY
			},
			touchEnd(e, index) {
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

				// 横坐标偏移量
				const deltaX = pageX - startX

				// 标记是左滑还是右滑
				const isLeftSide = deltaX >= 0
				const len = this.tabList.length
				// 如果当前为第一页内容，则不允许左滑；最后一页内容，则不允许右滑
				if ((isLeftSide && index == 0) || (!isLeftSide && index == len - 1)) {
					return
				}

				// 移动的横坐标偏移量大于指定的滚动阈值时,则切换显示状态,否则还原
				if (Math.abs(deltaX) > Number(this.scrollThreshold)) {
					// 根据是否为左滑查找需要滑动到的标签内容页下标，切换标签内容
					index = index + (isLeftSide ? -1 : 1)
					if (index > -1 && index < len) this.handleClick(index)
				} else {
					this.changeTrackStyle(false, this.duration)
				}
				// 一次touch完成后,重置touchInfo对象尚未初始化状态
				this.touchInfo.inited = false
			},
		}
	}
</script>

<style lang="less" scoped>
	.yui-tabs {
		position: relative;
		width: 100%;


		// 开启粘性定位布局
		&--fixed {
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
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
			color: transparent;
		}

		// 导航区域包裹层
		&__wrap {
			position: relative;
			display: flex;
			background-color: #fff;
			align-items: center;
			overflow: hidden;
			visibility: hidden;
			height: 0;

		}

		// 导航区域可见
		&--visible .yui-tabs__wrap {
			visibility: visible;
			height: auto;
		}


		// scroll-view组件样式
		&__scroll {
			position: relative;
			white-space: nowrap; // 使用横向滚动时，需要给<scroll-view>添加white-space: nowrap;样式
			width: 100%;
			height: 80rpx;
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
				display: inline-block;
				line-height: 80rpx;
				font-size: 28rpx;
				color: #333;
				text-align: center;
				padding: 0 8rpx;
				flex: 1;
				cursor: pointer;
				-webkit-tap-highlight-color: transparent;

				&--active {
					color: #212121;
					font-weight: 500;
				}

				&--disabled {
					color: #c8c9cc;
					cursor: not-allowed;
				}


				// 标题文字
				&__text {

					// 省略过长的标题文字
					&--ellipsis {
						display: -webkit-box; //定义为盒子显示
						overflow: hidden;
						text-overflow: ellipsis; //文本溢出隐藏为省略号
						-webkit-line-clamp: 1; // 限制一个块元素显示的文本行数
						-webkit-box-orient: vertical; //盒模型子元素排列： vertical（竖排）orhorizontal（横排）
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
			bottom: 3px;
			left: 0;
			width: 20px;
			height: 3px;
			background-color: #0022AB;
			border-radius: 3px;
			transform: translateX(-100%) translateX(-50%);
			// transition-duration: 0.3s;
		}

		// 标签内容
		&__content {
			background-color: #fff;
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

		// 标签内容的滑动轨道容器
		&__track {
			position: relative;
			display: flex;
			width: 100%;
			height: 100%;
			will-change: left;
			background-color: #fff;
		}
	}
</style>
