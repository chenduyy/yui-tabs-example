## 关于标签页组件
 
`yui-tabs` 标签支持以下属性：

| 名称      | 类型		| 描述										|
| ---------	| -------	| ---------------------------------------	|
| v-model   | string | 绑定当前选中标签的标识符 | 0
| visible   | boolean | 标签栏可见性，结合fixed使用，用于模拟滚动吸顶 | true
| color | string | 标签主题色 | #0022AB
| background    | string | 标签栏背景色  | #fff
| duration    | number | string | 动画时间，单位秒  | 0.3
| line-width    | number/ string | 底部条宽度，默认单位 px  | 20px
| line-height    |number/ string | 底部条高度，默认单位 px  | 3px
| animated    | boolean | 是否开启切换标签内容时的转场动画  | false
| ellipsis    | boolean | 是否省略过长的标题文字,标签数量未超过导航标签滚动阈值时才生效  | true
| swipeable    | boolean | 是否开启手势滑动切换 |  false
| is-lazy-render    | boolean | 是否开启延迟渲染（首次切换到标签时才触发内容渲染）  | true
| swipeThreshold    | number/ string | 导航标签滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动  | 5
| scrollThreshold    | number/ string | 滚动阈值，手指滑动页面触发切换的阈值,单位为px，表示横向滑动整个可视区域的多少px时才切换标签内容  | 20
| fixed    | boolean | 标签页是否滚动吸顶  | false
| title-active-color    | string | 标题选中态颜色  | -
| title-inactive-color    | string | 标题默认态颜色  | -
 