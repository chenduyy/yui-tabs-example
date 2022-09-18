const emits = ['update:active', 'change', 'click', 'rendered', 'scroll']
// let valueField = "active" // v-model绑定属性名
// // #ifdef VUE3
// emits.splice(0, 1, 'update:active')
// valueField = "modelValue"
// // #endif


const props = {
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
	// 主键,必填,用于区分不同的标签页
	pKey: {
		type: [Number, String],
		required: true,
	},
	active: {
		type: [Number, String],
		default: 0,
	},
	// 样式风格类型，可选值为 text、card、button、line-button
	type: {
		type: String,
		default: "line"
	},
	// 是否省略过长的标题文字
	ellipsis: {
		type: Boolean,
		default: false,
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
	// 在点击标签标题时，页面是否会滚动回到顶部
	tabClickScrollTop: {
		type: Boolean,
		default: false
	},
	// 对于只想使用标题栏功能而不关注标签内容，可使用该属性关闭标签内容的渲染
	noRenderConent: Boolean,
	// 滚动导航: 通过 scrollspy 属性可以开启滚动导航模式，该模式下，内容将会平铺展示。
	scrollspy: Boolean,
	// 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise
	beforeChange: Function,
	// 滑动切换是否使用swiper组件实现
	swiper: {
		type: Boolean,
		default: false,
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
	// 是否使用粘性定位布局
	sticky: Boolean,
	// 粘性布局的判断阈值
	stickyThreshold: {
		type: Number,
		default: 0
	},
	// 粘性布局下与顶部的最小距离，默认 px
	offsetTop: {
		type: Number,
		default: 0
	},
	// 粘性布局下标签栏的z-index值
	zIndex: {
		type: Number,
		default: 99
	},
}
//  v-model绑定属性，绑定当前选中标签的标识符（标签的下标）
// props[valueField] = {
// 	type: Number,
// 	default: -1
// }

export {
	emits,
	props,
	// valueField
}
