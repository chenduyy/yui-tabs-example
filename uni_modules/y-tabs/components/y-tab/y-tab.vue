<template>
	<view class="yui-tab__pane" :class="[paneClass()]" :style="[paneStyle]" @touchstart="touchStart"
		@touchmove="touchMove" @touchend="touchEnd">
		<view class="yui-tab__pane--wrap" v-if="rendered ? true : active">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import { isNull, getDirection } from "../js/uitls"
	export default {
		name: "yTab",
		options: {
			// 微信小程序中 options 选项
			multipleSlots: true, //  在组件定义时的选项中启动多slot支持，默认启用
			styleIsolation: "shared", //  启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
			addGlobalClass: true, //  表示页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面。这个选项等价于设置 styleIsolation: apply-shared
			virtualHost: true, //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
		},
		props: {
			title: String, // 标题
			disabled: Boolean, // 是否禁用标签
			dot: Boolean, // 是否在标题右上角显示小红点
			badge: [Number, String], // 图标右上角徽标的内容
			name: String, // 标签名称，作为匹配的标识符
			titleStyle: String, //	自定义标题样式
			titleClass: String, //	自定义标题类名
		},
		data() {
			return {
				index: -1, //内容卡片对应的下标
				parent: null, //父元素实例
				active: false, //是否为激活状态
				rendered: false, //是否渲染过
				swipeable: false, //是否开启手势滑动切换
				swipeAnimated: false, //是否开启手势滑动的拖动动画
				paneStyle: null, //内容样式
				touchInfo: {
					inited: false, //标记左右滑动时的初始化状态
					startX: null, //记录touch位置的横坐标
					startY: null, //记录touch位置的纵坐标
					moved: false, //用来判断是否是一次移动
					deltaX: 0, //记录拖动的横坐标距离
					isLeftSide: false, //标记是否为左滑
				},
			}
		},
		watch: {
			$props: {
				deep: true,
				// immediate: true,
				handler(newValue, oldValue) {
					// 触发导航变化事件
					if (this.parent) {
						this.parent.updateTab({
							newValue: { ...newValue },
							oldValue: oldValue && { ...oldValue },
							index: this.index
						})
					}
				},
			},
		},
		created() {
			this.parent = this.getParent()
		},
		mounted() {
			if (this.parent) {
				this.parent.childrens.push(this);
				this.parent.putTab({ newValue: { ...this.$props } })
			}
		},
		// #ifndef VUE3
		destroyed() {
			if (this.__isUnmounted) return
			this.unInit()
		},
		// #endif
		// #ifdef VUE3
		unmounted() {
			this.__isUnmounted = true
			this.unInit()
		},
		// #endif
		methods: {
			toJSON() {

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
			getRect() {
				return new Promise((resolve, reject) => {
					this.getSelectorQuery().select(".yui-tab__pane").boundingClientRect().exec(rect => {
						resolve(rect[0] || {})
					});
				})
			},
			// 卸载组件的处理
			unInit() {
				if (this.parent) {
					const index = this.parent.childrens.findIndex(item => item === this)
					this.parent.childrens.splice(index, 1)
					this.parent.tabs.splice(index, 1)
				}
			},
			//获取父元素实例
			getParent(name = 'yTabs') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false;
					parentName = parent.$options.name;
				}
				return parent;
			},
			// 内容class
			paneClass() {
				return `yui-tab__pane${this.index} ${this.active?'yui-tab__pane--active':''}`
			},
			touchStart(e) {
				if (this.swipeable) { // 允许滑动
					this.touchInfo.inited = true //touch开始时,将touchInfo对象设置为已初始化状态
					const touch = e.touches[0];
					// 记录touch位置的横坐标与纵坐标
					this.touchInfo.startX = touch.pageX
					this.touchInfo.startY = touch.pageY
					this.touchInfo.moved = false //用来判断是否是一次移动
				}
			},
			touchMove(e) {
				if (!this.touchInfo.inited) {
					return
				}
				const { pageX, pageY } = e.changedTouches[0]
				const { startX, startY } = this.touchInfo || {}
				// 滑动方向不为左右时阻止
				const direction = getDirection(startX, startY, pageX, pageY)
				if (direction !== 3 && direction !== 4) {
					e.stopPropagation()
					return
				}

				// 横坐标偏移量
				const deltaX = pageX - startX
				// 标记是左滑还是右滑
				const isLeftSide = deltaX >= 0
				const { dataLen, contentWidth, currentIndex } = this.parent
				// 如果当前为第一页内容，则不允许左滑；最后一页内容，则不允许右滑
				if ((isLeftSide && this.index === 0) || (!isLeftSide && this.index === dataLen - 1)) {
					return
				}
				this.touchInfo.isLeftSide = isLeftSide
				this.touchInfo.moved = true
				this.touchInfo.deltaX = Math.abs(deltaX)
				// 改变标签内容的样式，模拟拖动动画效果
				if (this.swipeAnimated) {
					const offsetWidth = contentWidth * currentIndex * -1 + deltaX
					this.parent.changeTrackStyle(true, 0, offsetWidth)
				}
			},
			touchEnd(e) {
				if (!this.touchInfo.moved) {
					return
				}
				const { isLeftSide, deltaX } = this.touchInfo || {}
				const { dataLen, swipeThreshold } = this.parent
				// 移动的横坐标偏移量大于指定的滚动阈值时,则切换显示状态,否则还原
				if (Math.abs(deltaX) > Number(swipeThreshold)) {
					// 根据是否为左滑查找需要滑动到的标签内容页下标，切换标签内容
					const index = this.index + (isLeftSide ? -1 : 1)
					if (index > -1 && index < dataLen) {
						this.parent.setCurrentIndex(index)
					}
				} else {
					this.parent.changeTrackStyle(false)
				}
				// 一次touch完成后,重置touchInfo对象尚未初始化状态
				this.touchInfo.inited = false
			},
		},
	}
</script>

<style lang="less" scoped>
	@import url("../css/index.less");

	/deep/ .yui-tab__pane {
		flex-shrink: 0;
		box-sizing: border-box;
		width: 100%;
	}
</style>
