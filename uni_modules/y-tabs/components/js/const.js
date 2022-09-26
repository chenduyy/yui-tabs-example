const model = {
	// #ifndef VUE3
	prop: 'value',
	event: 'input'
	// #endif
	// #ifdef VUE3
	prop: 'modelValue',
	event: 'update:modelValue'
	// #endif
}

const emits = [
	// #ifndef VUE3
	"input",
	// #endif
	// #ifdef VUE3
	'update:modelValue',
	// #endif
	'change',
	'click',
	'rendered',
	'scroll'
]

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
	// v-model绑定属性，绑定当前选中标签的标识符（标签的下标）
	// #ifndef VUE3
	value: {
		type: [Number, String],
		default: 0,
	},
	// #endif
	// #ifdef VUE3
	modelValue: {
		type: [Number, String],
		default: 0,
	},
	// #endif
	// 样式风格类型，可选值为 text、card、button、line-button
	type: {
		type: String,
		default: "line"
	},
	// 是否省略过长的标题文字
	ellipsis: {
		type: Boolean,
		default: true,
	},
	// 标签栏滚动时当前标签居中
	scrollToCenter: {
		type: Boolean,
		default: true,
	},
	//  标签栏的滚动阈值(仅在ellipsis="false"且type不为"card"下时有效)，标签数量超过阈值时开始横向滚动(切换时会自动将当前标签居中)
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
	// 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise
	beforeChange: Function,
	// ---------------------------------- 用于内容区域左右滑动的配置 ----------------------------------------
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
	// ---------------------------------- 用于滚动吸顶的配置 ----------------------------------------
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
	// 滚动导航: 通过 scrollspy 属性可以开启滚动导航模式，该模式下，内容将会平铺展示。
	scrollspy: Boolean,
	// 滚动导航模式下标签栏的展示方位,可选值：vertical
	direction:{
		type: String,
		default: "horizontal"
	}
}
export {
	model,
	emits,
	props,
}
