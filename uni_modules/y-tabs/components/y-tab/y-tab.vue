<template>
	<view class="yui-tab__pane" :class="[paneClass()]" :style="[paneStyle]">
		<view v-if="rendered ? true : active">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import { getUid, isNull } from "../js/uitls"
	export default {
		name: "y-tab",
		options: {
			// 微信小程序中 options 选项
			multipleSlots: true, //  在组件定义时的选项中启动多slot支持，默认启用
			styleIsolation: "shared", //  启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
			addGlobalClass: true, //  表示页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面。这个选项等价于设置 styleIsolation: apply-shared
			virtualHost: true, //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
		},
		inject: ["getPKey", "getIndex"],
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
				uid: getUid(),
				watchTabKey: `watchTab_${this.getPKey}`, //监听导航变化事件
				putChangeKey: `putChange_${this.getPKey}`, //推动导航变化事件
				active: false, //是否为激活状态
				rendered: false, //是否渲染过
				color: "", //主题色
				titleActiveColor: "", // 标题选中态颜色
				titleInactiveColor: "", // 标题默认态颜色
				paneStyle: null,
			}
		},
		computed: {
			// //在标签数组中的下标
			index() {
				return this.getIndex(this.uid)
			}
			// // 是否为激活状态
			// active() {
			// 	return this.getParent().currentIndex === this.index
			// },
			// // 标签内容class类
			// paneClass() {
			// 	return `yui-tab_pane${this.index} ${this.active?'yui-pane--active':''}`
			// },
			// //当前内容页是否显示( 滚动导航模式下显示; 非滚动导航模式下激活状态下显示;)
			// isShow() {
			// 	const { scrollspy } = this.parent || {}
			// 	return scrollspy || (!scrollspy && this.active)
			// },
			// // 标签内容样式
			// paneStyle() {
			// 	const show = this.isShow
			// 	const { animated, swipeAnimated, paneHeight } = this.parent
			// 	return animated ? {
			// 		/// 有拖动动画或内容页为激活状态时，为visible
			// 		visibility: swipeAnimated || show ? 'visible' : 'hidden',
			// 		height: show ? 'auto' : paneHeight + 'px'
			// 	} : {
			// 		display: show ? 'block' : 'none'
			// 	}
			// },
		},
		watch: {
			$props: {
				deep: true,
				immediate: true,
				handler(newValue, oldValue) {
					// 触发导航变化事件
					uni.$emit(this.watchTabKey, {
						newValue: { ...newValue, uid: this.uid, },
						oldValue: oldValue && { ...oldValue },
					});
				},
			},
		},
		created() {
			uni.$on(this.putChangeKey, ({ currentIndex, parent }) => {
				this.active = this.index === currentIndex
				const tab = (parent.tabs[this.index] || {})
				this.rendered = tab.rendered
				this.paneStyle = (parent.tabs[this.index] || {}).paneStyle
				// if (this.active) console.log(this.title + " active", this.paneStyle);
			})
		},
		mounted() {
			// console.log(this.parent());
		},
		methods: {
			paneClass() {
				return `yui-tab_pane${this.index} ${this.active?'yui-pane--active':''}`
			},
			onClick() {
				this.$emit("click", this.uid)
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
