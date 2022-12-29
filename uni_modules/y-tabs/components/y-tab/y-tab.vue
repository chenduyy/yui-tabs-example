<template>
	<view class="yui-tab__pane" :class="[paneClass()]" :style="[paneStyle]" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		<view class="yui-tab__pane--wrap" v-if="rendered ? true : active"><slot></slot></view>
	</view>
</template>

<script>
import { isNull } from '../js/uitls';
import { touchMixin } from '../js/touchMixin';
export default {
	name: 'yTab',
	mixins: [touchMixin],
	options: {
		// 微信小程序中 options 选项
		multipleSlots: true, //  在组件定义时的选项中启动多slot支持，默认启用
		styleIsolation: 'shared', //  启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
		addGlobalClass: true, //  表示页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面。这个选项等价于设置 styleIsolation: apply-shared
		virtualHost: true //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
	},
	props: {
		title: String, // 标题
		disabled: Boolean, // 是否禁用标签
		dot: Boolean, // 是否在标题右上角显示小红点
		badge: {
			type: [Number, String],
			default: ''
		}, // 图标右上角徽标的内容
		name: String, // 标签名称，作为匹配的标识符
		titleStyle: Object, //	自定义标题样式
		titleClass: String, //	自定义标题类名
		iconType: String, //图标图案，为uniapp扩展组件（uni-ui）下的uni-icons的type值，customPrefix用法等同
		iconSize: {
			type: Number,
			default: 16
		}, //图标大小
		customPrefix: String, //自定义图标
		imageSrc: String, //图片路径
		imageMode: {
			type: String,
			default: 'scaleToFill',
			validator(value) {
				return [
					'scaleToFill',
					'aspectFit',
					'aspectFill',
					'widthFix',
					'heightFix',
					'top',
					'bottom',
					'center',
					'left',
					'right',
					'top left',
					'top right',
					'bottom left',
					'bottom right'
				].includes(value);
			}
		}, //图片裁剪、缩放的模式，为uniapp内置组件->媒体组件—>image下的mode值
		position: {
			type: String,
			default: 'right',
			validator(value) {
				return ['top', 'bottom', 'left', 'right'].includes(value);
			}
		} //如果存在图片或图标，标题围绕它们的位置
	},
	data() {
		return {
			index: -1, //内容卡片对应的下标
			parent: null, //父元素实例
			active: false, //是否为激活状态
			rendered: false, //是否渲染过
			swipeable: false, //是否开启手势滑动切换
			paneStyle: null, //内容样式
			scrollspy: false //是否为滚动导航模式
		};
	},
	computed: {
		computedName() {
			return !isNull(this.name) ? this.name : this.index;
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
					});
				}
			}
		}
	},
	created() {
		this.parent = this.getParent();
		if (this.parent) {
			this.parent.children.push(this);
			this.parent.putTab({ newValue: { ...this.$props } });
		}
	},
	// #ifndef VUE3
	destroyed() {
		if (this.__isUnmounted) return;
		this.unInit();
	},
	// #endif
	// #ifdef VUE3
	unmounted() {
		this.__isUnmounted = true;
		this.unInit();
	},
	// #endif
	methods: {
		toJSON() {},
		// 获取查询节点信息的对象
		getSelectorQuery() {
			let query = null;
			// #ifdef MP-ALIPAY
			query = uni.createSelectorQuery();
			// #endif
			// #ifndef MP-ALIPAY
			query = uni.createSelectorQuery().in(this);
			// #endif
			return query;
		},
		// 获取元素位置信息
		getRect() {
			return new Promise((resolve, reject) => {
				this.getSelectorQuery()
					.select('.yui-tab__pane')
					.boundingClientRect()
					.exec(rect => {
						resolve(rect[0] || {});
					});
			});
		},
		// 卸载组件的处理
		unInit() {
			if (this.parent) {
				const index = this.parent.children.findIndex(item => item === this);
				this.parent.children.splice(index, 1);
				this.parent.tabs.splice(index, 1);
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
			return `yui-tab__pane${this.index} ${this.active ? 'yui-tab__pane--active' : ''} ${this.scrollspy ? 'yui-tabs__pane--scrollspy' : ''}`;
		}
	}
};
</script>

<style lang="less" scoped>
@import url('../css/index.less');
</style>
