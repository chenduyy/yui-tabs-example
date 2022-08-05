# yui-tabs 关于标签页组件

+ [Tips](#tips)
+ [支持的平台](#supportPlatform)
+ [使用示例](#useExamples)
+ [tabs数组参数](#tabsAttr)
+ [Tabs Props](#tabsProps)
+ [Tabs Events](#tabsEvents)
+ [Tabs Slots](#tabsSlots)


<div id="tips">Tips</div>

+ 请保证HBuilderX正式版为 v3.4.18、Alpha版为 v3.5.1，否则用于渲染tab内容的动态插槽无效。
+ 该插件使用的预编译，需要自行安装less插件。
+ 如果发现组件有bug或者不完善可以留言交流。
+ 如需查看效果，请下载示例项目ZIP运行(标签页组件在uni_modules/yui-tabs下)。
+ 以往版本放在uni_modules/yui-tabs/version中。



<div id="supportPlatform">支持的平台：</div>

+ H5、app-vue、微信、支付宝、钉钉小程序可用，其他的小程序平台可自行测试。
+ 暂不支持nvue。



<div id="useExamples">使用示例：</div>

```
<template>
 <view>
	 <yui-tabs :tabs="tabs" v-model="activeIndex" @click="tabClick" @change="tabChange">
		<template #pane0>
			<view class="content-wrap">内容1</view>
		</template>
		<template #pane1>
			<view class="content-wrap">内容2</view>
		</template>
		<template #pane2>
			<view class="content-wrap">内容3</view>
		</template>
		<template #pane3>
			<view class="content-wrap">内容4</view>
		</template>
		<template #pane4>
			<view class="content-wrap">内容5</view>
		</template>
	 </yui-tabs>
 </view>
</template>
<script>
	export default {
		data() {
			return {
				tabs: Array.from({
					length: 5
				}, (o, i) => `标签${i+1}`),
				activeIndex: 0,
			}
		},
		methods: {
			// 标签点击事件
			tabClick(index, item) {
				console.log("tabClick", index, item);
			},
			// 标签切换事件
			tabChange(index, item) {
				console.log("tabChange", index, item);
			}
		}
	}
</script>

```

<div id="tabsProps">Tabs Props</div>



| 参数      | 类型		| 描述										| 默认值										
| ---------	| -------	| ---------------------------------------	| ---------------------------------------	
| v-model   | string | 绑定当前选中标签的标识符（即tabs中选中项的下标） | 0 
| tabs   | [stirng,object] | 标签页数据，支持字符串类型与对象类型的数组结构(对象类型需符合{label:'标签1',slot:'slotName'}这样的格式，slot为自定义的标签内容插槽名，否则插槽名默认为"pane"+tab下标的命名),见下文"tabs数组参数" | - 
| color | string | 标签主题色 | #0022AB 
| background    | string | 标签栏背景色  | #fff 
| title-active-color    | string | 标题选中态颜色  | - 
| title-inactive-color    | string | 标题默认态颜色  | - 
| duration    | number、string | 动画时间，单位秒  | 0.3 
| line-width    | number、string | 底部条宽度，默认单位 px  | 20px 
| line-height    |number、string | 底部条高度，默认单位 px  | 3px 
| animated    | boolean | 是否开启切换标签内容时的转场动画  | false 
| ellipsis    | boolean | 是否省略过长的标题文字,标签数量未超过导航标签滚动阈值时才生效  | true 
| swipeable    | boolean | 是否开启手势滑动切换 |  false 
| swipe-animated（v1.0.6） | boolean | 是否开启标签内容的拖动动画（该属性依赖于animated、swipeable、is-lazy-render的开启;该属性开启时考虑给包裹内容的容器增加一个min-height，因为开启该属性后，其他未显示出来的标签内容会沿用当前显示的高度，拖动切换后由于高度不一致会有回弹）
| is-lazy-render    | boolean | 是否开启延迟渲染（首次切换到标签时才触发内容渲染）  | true 
| swipeThreshold    | number、string | 导航标签滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动  | 5 
| scrollThreshold    | number、string | 滚动阈值，手指滑动页面触发切换的阈值,单位为px；表示开启手势滑动时，横向滑动整个可视区域的多少px时才切换标签内容  | 50 
| visible   | boolean | 标签栏可见性，结合fixed使用，用于模拟滚动吸顶 | true 
| fixed    | boolean | 标签页是否滚动吸顶  | false 
| offset-top    | number | 滚动吸顶下与顶部的最小距离，默认 px  | 0 
| z-index    | number | 滚动吸顶下，标签栏的z-index值  | 99 


<div id="tabsAttr">tabs数组参数</div>

| 参数      | 类型		| 描述										| 默认值										
| ---------	| -------	| ---------------------------------------	| ---------------------------------------	
| label | string | 标题 | -
| slot | string | 标签内容插槽名 | -
| titleSlot | number/string | 标题插槽名 | -
| dot | boolean | 是否在标题右上角显示小红点（优先级高于badge） | false
| badge | number/string | 图标右上角徽标的内容 | -

label:'标签1',slot:'slotName'

<div id="tabsEvents">Tabs Events</div>

| 事件名      | 说明		| 回调参数																	
| ---------	| -------	| ---------------------------------------
| click   | 点击标签时触发 | index:下标；item：当前点击的tab项
| change   | 当前激活的标签改变时触发 | index:下标；item：当前改变的tab项


<div id="tabsSlots">Tabs Slots</div>
 
 | 名称      | 说明
 | --------- | -------
 | extra  | 标签栏右侧额外内容
 | pane+下标  | 标签内容插槽，插槽名默认为"pane"+tab下标，如果tabs中通过slot设置了插槽名，则使用slot的值
 | title+下标  | 标签标题插槽，插槽名默认为"title"+tab下标，如果tabs中通过titleSlot设置了插槽名，则使用titleSlot的值