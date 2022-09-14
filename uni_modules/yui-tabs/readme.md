# yui-tabs 关于标签页组件

+ [Tips](#tips)
+ [支持的平台](#supportPlatform)
+ [使用示例](#useExamples)
+ [滚动吸顶示例](#scrollExamples)
+ [tabs数组参数](#tabsAttr)
+ [Tabs Props](#tabsProps)
+ [Tabs Events](#tabsEvents)
+ [Tabs Slots](#tabsSlots)


<div id="tips" style="color:#4fc08d;">Tips</div>

+ 组件于2022.08.15 14:50有改动，若有bug，请更新最新代码尝试是否修复。
+ 请保证HBuilderX正式版为 v3.4.18、Alpha版为 v3.5.1，否则用于渲染tab内容的动态插槽无效。
+ 该插件使用的预编译，需要自行安装less插件。
+ 如果发现组件有bug或者不完善可以留言交流。
+ 如需查看效果，请下载示例项目ZIP运行(标签页组件在uni_modules/yui-tabs下)。
+ 旧版本放在uni_modules/yui-tabs/version中。
+ 关于标签栏滚动吸顶提供了两种实现方式,具体可查看示例项目中的演示。



<div id="supportPlatform" style="color:#4fc08d;">支持的平台：</div>

+ H5、app-vue、微信、支付宝、钉钉、百度、字节、QQ小程序可用，其他的小程序平台可自行测试。
+ 暂不支持nvue。



<div id="useExamples" style="color:#4fc08d;">使用示例：</div>


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


<div id="scrollExamples" style="color:#4fc08d;">滚动吸顶示例：</div>

+ 本示例只展示使用sticky方式实现的标签栏吸顶
+ 直接开启sticky属性，并结合页面生命周期onPageScroll，调用uni.$emit('onPageScroll', e)，否则无法吸顶
```
<template>
 <view>
	 <yui-tabs :tabs="tabs" v-model="activeIndex" sticky :offsetTop="offsetTop">
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
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: (e) => {
					let offsetTop = 0
					// #ifdef H5
					offsetTop = 43
					// #endif
		
					this.offsetTop = offsetTop;
				}
			})
		},
		// 页面滚动触发事件
		onPageScroll(e) {
			//页面滚动事件
			uni.$emit('onPageScroll', e)
		},
	}
</script>
<style>
.content-wrap{
	height:200vh;
}
</style>
```

<div id="tabsProps" style="color:#4fc08d;">Tabs Props</div>
 
<table>
	<tr><th>参数</th><th>类型</th><th>描述</th><th>默认值</th></tr>
	<tr><td> v-model   </td><td> string </td><td> 绑定当前选中标签的标识符（即tabs中选中项的下标） </td><td> 0 </td></tr>
	<tr><td> type（v1.0.6）   </td><td> string </td><td> 样式风格类型，可选值为 text、card、button、line-button </td><td> line</td></tr>
	<tr><td> tabs   </td><td> [stirng,object] </td><td> 标签页数据，支持字符串类型与对象类型的数组结构(对象类型需符合{label:'标签1',slot:'slotName'}这样的格式，slot为自定义的标签内容插槽名，否则插槽名默认为"pane"+tab下标的命名),见下文"tabs数组参数" </td><td> - </td></tr>
	<tr><td> color </td><td> string </td><td> 标签主题色 </td><td> #0022AB </td></tr>
	<tr><td> background    </td><td> string </td><td> 标签栏背景色  </td><td> #fff </td></tr>
	<tr><td> title-active-color    </td><td> string </td><td> 标题选中态颜色  </td><td> - </td></tr>
	<tr><td> title-inactive-color    </td><td> string </td><td> 标题默认态颜色  </td><td> - </td></tr>
	<tr><td> wrapStyle    </td><td> object </td><td> 标签栏样式  </td><td> - </td></tr>
	<tr><td> duration    </td><td> number、string </td><td> 动画时间，单位秒(用于标签栏底部线条切换及标签内容转场动画时长)  </td><td> 0.3 </td></tr>
	<tr><td> line-width    </td><td> number、string </td><td> 底部条宽度，默认单位 px，仅在 type="line" 时有效  </td><td> 20px </td></tr>
	<tr><td> line-height    </td><td>number、string </td><td> 底部条高度，默认单位 px，仅在 type="line" 时有效  </td><td> 3px </td></tr>
	<tr><td> ellipsis    </td><td> boolean </td><td> 是否省略过长的标题文字  </td><td> true </td></tr>
	<tr><td> scroll-to-center    </td><td> boolean </td><td> 标签栏滚动时当前标签居中  </td><td> true</td></tr>
	<tr><td> scroll-threshold    </td><td> number、string </td><td> 标签栏的滚动阈值(仅在ellipsis="false"且type不为"card"下时有效)，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动(切换时会自动将当前标签居中)  </td><td> 5 </td></tr>
	<tr><td> is-lazy-render    </td><td> boolean </td><td> 是否开启延迟渲染（首次切换到标签时才触发内容渲染）  </td><td> true </td></tr>
	<tr><td> animated    </td><td> boolean </td><td> 是否开启切换标签内容时的转场动画  </td><td> false </td></tr>
	<tr><td> swipeable    </td><td> boolean </td><td> 是否开启手势滑动切换 </td><td>  false </td></tr>
	<tr><td> tab-click-scroll-top    </td><td> boolean </td><td> 在点击标签标题时，页面是否会滚动回到顶部 </td><td>  false </td></tr>
	<tr><td> swiper（v1.0.7） </td><td> boolean </td><td> 标签内容的滑动切换是否使用swiper组件实现(为false时是默认实现,swiper以下的所有prop都属于默认实现)；注意：该方式是为了解决默认的左右滑动切换不友好的情况，因此无法兼容uni自身的上拉加载与下拉刷新事件，请到插件市场寻找类似的组件  </td><td> false </td></tr>
	<tr><td colspan="4"> -- </td></tr>
	<tr><td colspan="4"> 以下prop,仅在swiper="false"时有效</td></tr>
	<tr><td> swipe-threshold    </td><td> number、string </td><td> 滑动切换的滑动距离阈值，手指滑动页面触发切换的阈值,单位为px；表示开启手势滑动时，横向滑动整个可视区域的多少px时才切换标签内容  </td><td> 50 </td></tr>
	<tr><td> swipe-animated（v1.0.6） </td><td> boolean </td><td> 是否开启标签内容滑动时的拖动动画（该属性依赖于animated、swipeable、is-lazy-render的开启;该属性开启时考虑给包裹内容的容器增加一个min-height，因为开启该属性后，其他未显示出来的标签内容会沿用当前显示的高度，拖动切换后由于高度不一致会有回弹）</td><td> 0</td></tr>
	<tr><td colspan="4"> -- </td></tr>
	<tr><td colspan="4"> 以下prop,是用于实现滚动吸顶提供的属性，分为fixed与sticky方式，这两种方式都是在特定的场景下实现，请查看示例项目，里面有具体的说明</td></tr>
	<tr><td colspan="4"> ---- fixed方式：使用两个标签页组件模拟滚动吸顶 ---- </td></tr>
	<tr><td> fixed    </td><td> boolean </td><td> 标签页是否滚动吸顶(请查看示例项目中的具体用法；示例->滚动吸顶(fixed方式)；与sticky的效果相同,但是不推荐使用)  </td><td> false </td></tr>
	<tr><td> visible   </td><td> boolean </td><td> 标签栏可见性，结合fixed使用，用于模拟滚动吸顶 </td><td> true </td></tr>
	<tr><td colspan="4"> ---- sticky方式：结合页面生命周期onPageScroll实现 ---- </td></tr>
	<tr><td> sticky（v1.0.6）	</td><td> boolean	</td><td> 是否使用粘性定位布局(请查看示例项目中的具体用法；示例->滚动吸顶(sticky方式))	</td><td> false</td></tr>
	<tr><td> sticky-threshold（v1.0.6） </td><td> number </td><td> 粘性定位布局的判断阈值 </td><td> 0</td></tr>
	<tr><td colspan="4">------  （fixed与sticky方式共有）   -----</td></tr>
	<tr><td> offset-top    </td><td> number </td><td> 滚动吸顶(粘性定位布局)下与顶部的最小距离，默认 px </td><td> 0 </td></tr>
	<tr><td> z-index    </td><td> number </td><td> 滚动吸顶(粘性定位布局)下，标签栏的z-index值  </td><td> 99 </td></tr>
	</table>

<div id="tabsAttr" style="color:#4fc08d;">tabs数组参数</div>
注意:

+ 请勿在组件初始化之后删除或添加tabs数组，否则会导致组件内部重新初始化一遍
+ 在组件初始化之后，仅支持更改label,badge,dot的值

| 参数      | 类型		| 描述										| 默认值										
| ---------	| -------	| ---------------------------------------	| ---------------------------------------	
| label | string | 标题 | -
| slot | string | 标签内容插槽名 | 'pane'+下标
| titleSlot | number/string | 标题插槽名 | 'title'+下标
| dot | boolean | 是否在标题右上角显示小红点（优先级高于badge） | false
| badge | number/string | 图标右上角徽标的内容 | -


<div id="tabsEvents" style="color:#4fc08d;">Tabs Events</div>

| 事件名    | 说明		| 回调参数																	
| -------- | -------	| ---------------------------------------
| click    | 点击标签时触发 | index:下标；item：当前点击的tab项；isTabClick：是否为标签标题点击时触发的该事件
| change   | 当前激活的标签改变时触发 | index:下标；item：当前改变的tab项；isTabClick：是否为标签标题点击时触发的该事件
| rendered | 标签内容首次渲染时触发（仅在开启延迟渲染后触发） | index:下标；item：当前改变的tab项
| scroll   | 滚动时触发，仅在 sticky 模式下生效 | { scrollTop: 距离顶部位置, isFixed: 是否吸顶 }


<div id="tabsSlots" style="color:#4fc08d;">Tabs Slots</div>
 
 | 名称      | 说明
 | --------- | -------
 | extra  | 标签栏右侧额外内容
 | pane+下标  | 标签内容插槽，插槽名默认为"pane"+tab下标，如果tabs中通过slot设置了插槽名，则使用slot的值
 | title+下标  | 标签标题插槽，插槽名默认为"title"+tab下标，如果tabs中通过titleSlot设置了插槽名，则使用titleSlot的值
 
 <div id="tabsMethod" style="color:#4fc08d;">Tabs 方法</div>
 通过 ref 可以获取到 Tabs 实例并调用实例方法.
 
 | 方法名      | 说明		| 参数		| 返回值													
 | ---------	| -------	| --------	| --------
 | resize   | 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘 | - | -