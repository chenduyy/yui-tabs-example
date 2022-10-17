# y-tabs 标签页组件

+ [Tips](#tips)
+ [支持的平台](#supportPlatform)
+ [使用示例](#useExamples)
+ [滚动吸顶示例](#scrollExamples)
+ [Tabs Props](#tabsProps)
+ [Tab Props](#tabProps)
+ [Tabs Events](#tabsEvents)
+ [Tabs 方法](#tabsMethod)
+ [Tabs Slots](#tabsSlots)
+ [Tab Slots](#tabSlots)
+ [注意事项及常见问题](#beCareful)


<div id="tips" style="color:#4fc08d;">Tips</div>

+ 代码更新于2022/10/16 17:11，若有问题，请下载最新代码
+ 请保证HBuilderX正式版为 v3.4.18、Alpha版为 v3.5.2。
+ 该插件使用的预编译，需要自行安装less插件。
+ 如果发现组件有bug或者不完善可以留言交流。
+ 扫描右侧图片中的微信小程序码可打开示例项目，查看具体的效果。
+ 示例项目中内置不少案例，若有其他场景的实现，可在评论中留言。

<div id="supportPlatform" style="color:#4fc08d;">支持的平台：</div>

+ H5、app-vue、微信、支付宝、钉钉、百度、字节、QQ小程序可用，其他的小程序平台可自行测试。
+ 暂不支持nvue。
+ 该组件主要是用于对yui-tabs的补充，在vue3下支持了小程序端。



<div id="useExamples" style="color:#4fc08d;">使用示例：</div>


```
<template>
 <view>
	 <y-tabs v-model="activeIndex" @click="tabClick"  @change="tabChange">
	 	<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
	 		<view class="content-wrap"> 内容{{index}} </view>
	 	</y-tab>
	 </y-tabs>
 </view>
</template>
<script>
	export default {
		data() {
			return {
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

+ 标签栏吸顶
+ 直接开启sticky属性，并结合页面生命周期onPageScroll，调用uni.$emit('onPageScroll', e)，否则无法吸顶
```
<template>
 <view>
	 <yui-tabs v-model="activeIndex" sticky :offsetTop="offsetTop">
		<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
			<view class="content-wrap"> 内容{{index}} </view>
		</y-tab>
	 </yui-tabs>
 </view>
</template>
<script>
	export default {
		data() {
			return {
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
	<tr><td> v-model   </td><td>  number / string </td><td> 绑定当前选中标签的标识符（即tab选中项的下标） </td><td> 0 </td></tr>
	<tr><td> type   </td><td> string </td><td> 样式风格类型，可选值为 text、card、button、line-button </td><td> line</td></tr>
	<tr><td> color </td><td> string </td><td> 标签主题色 </td><td> #0022AB </td></tr>
	<tr><td> background    </td><td> string </td><td> 标签栏背景色  </td><td> #fff </td></tr>
	<tr><td> title-active-color    </td><td> string </td><td> 标题选中态颜色  </td><td> - </td></tr>
	<tr><td> title-inactive-color    </td><td> string </td><td> 标题默认态颜色  </td><td> - </td></tr>
	<tr><td> wrapStyle    </td><td> object </td><td> 标签栏样式  </td><td> - </td></tr>
	<tr><td> duration    </td><td> number、string </td><td> 动画时间，单位秒(用于标签栏底部线条切换及标签内容转场动画时长)  </td><td> 0.2 </td></tr>
	<tr><td> line-width    </td><td> number、string </td><td> 底部条宽度，默认单位 px，仅在 type="line" 时有效  </td><td> 20px </td></tr>
	<tr><td> line-height    </td><td>number、string </td><td> 底部条高度，默认单位 px，仅在 type="line" 时有效  </td><td> 3px </td></tr>
	<tr><td> ellipsis    </td><td> boolean </td><td> 是否省略过长的标题文字  </td><td> true </td></tr>
	<tr><td> scroll-to-center    </td><td> boolean </td><td> 标签栏滚动时当前标签居中（侧边栏导航无效）  </td><td> true</td></tr>
	<tr><td> scroll-threshold    </td><td> number、string </td><td> 标签栏的滚动阈值(仅在ellipsis="false"且type不为"card"下时有效)，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动(切换时会自动将当前标签居中)  </td><td> 5 </td></tr>
	<tr><td> is-lazy-render    </td><td> boolean </td><td> 是否开启延迟渲染（首次切换到标签时才触发内容渲染）  </td><td> true </td></tr>
	<tr><td> animated    </td><td> boolean </td><td> 是否开启切换标签内容时的转场动画  </td><td> false </td></tr>
	<tr><td> tab-click-scroll-top    </td><td> boolean </td><td> 在点击标签标题时，页面是否会滚动回到顶部 </td><td>  false </td></tr>
	<tr><td> before-change    </td><td> (index) => boolean | Promise </td><td> 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise</td><td> - </td></tr>
	<tr><td> transparent    </td><td> boolean </td><td> 标题栏背景色是否透明渐变 ;如果开启该属性，那么background属性值必须为rgba格式  </td><td> false </td></tr>
	<tr><td> transparentOffset    </td><td> number </td><td> 标题栏背景色透明的滚动距离  </td><td> 150 </td></tr>
	<tr><td colspan="4"> ------------ 手势滑动切换相关属性 ------------ </td></tr>
	<tr><td> swipeable    </td><td> boolean </td><td> 是否开启手势滑动切换 </td><td>  false </td></tr>
	<tr><td> swipe-threshold    </td><td> number、string </td><td> 滑动切换的滑动距离阈值，手指滑动页面触发切换的阈值,单位为px；表示开启手势滑动时，横向滑动整个可视区域的多少px时才切换标签内容  </td><td> 50 </td></tr>
	<tr><td> swipe-animated </td><td> boolean </td><td> 是否开启标签内容滑动时的拖动动画（该属性依赖于animated、swipeable、is-lazy-render的开启;该属性开启时考虑给包裹内容的容器增加一个min-height，因为开启该属性后，其他未显示出来的标签内容会沿用当前显示的高度，拖动切换后由于高度不一致会有回弹）</td><td> 0</td></tr>
	<tr><td colspan="4"> ------------ 滚动吸顶相关属性：结合页面生命周期onPageScroll实现 ------------ </td></tr>
	<tr><td> sticky	</td><td> boolean	</td><td> 是否使用粘性定位布局开启滚动吸顶(请查看示例项目中的具体用法；yTabs -> 滚动吸顶	</td><td> false</td></tr>
	<tr><td> sticky-threshold </td><td> number </td><td> 粘性定位布局的判断阈值（可以理解在滚动过程中，） </td><td> 0</td></tr>
	<tr><td> offset-top    </td><td> number </td><td> 粘性定位布局下标签栏与顶部的最小距离，默认 px </td><td> 0 </td></tr>
	<tr><td> z-index    </td><td> number </td><td> 粘性定位布局下，标签栏的z-index值  </td><td> 99 </td></tr>
	<tr><td> scrollspy    </td><td> boolean </td><td> 是否开启滚动导航；该模式下，内容将会平铺展示  </td><td> false </td></tr>
	<tr><td> direction    </td><td> string </td><td> 滚动导航模式下标签栏的展示方位,可选值：vertical(若scrollspy为true，direction为vertical，则标签栏与内容均垂直滚动，即为侧边栏导航)  </td><td> horizontal </td></tr>
	<tr><td> navHeight    </td><td> number/string </td><td> 标签栏高度，单位默认为px(支持数字、rpx、vh、vw等单位及calc() 函数)  </td><td> 在direction="horizontal"下，即为标签栏水平展示时，默认为40px； 在侧边栏导航下，默认该值为侧边栏在屏幕可见区域的高度（如果自行设置该值的话，在H5端则需减去顶部导航栏高度） </td></tr>
	<tr><td> navWidth    </td><td> number/string </td><td> 标签栏宽度，单位默认为px(支持数字、rpx、vh、vw等单位及calc() 函数)  </td><td> 在direction="horizontal"下，即为标签栏水平展示时，跟随父容器的宽度； 在direction="vertical"下，即为侧边栏导航下，默认为100px； </td></tr>
	<tr><td> pageScroll    </td><td> boolean </td><td>  内容区域是否为页面级滚动：为true时，整体区域跟随页面而滚动，为false时，内容区域是放在scroll-view中实现的局部滚动 </td><td> false </td></tr>
	<tr><td> contentHeight    </td><td> number/string </td><td> 滚动导航模式（局部滚动）下的内容高度(该属性仅在scrollspy为true、且pageScroll为false下生效，用于设置内容滚动为局部滚动时所需要的高度)  </td><td> 默认为内容区域在屏幕视口中的可见高度 </td></tr>
	</table>

<div id="tabProps" style="color:#4fc08d;">Tab Props</div>

| 参数      | 类型		| 描述										| 默认值										
| ---------	| -------	| ---------------------------------------	| ---------------------------------------	
| title | string | 标题 | -
| disabled | boolean | 是否禁用标签 | false
| dot | boolean | 是否在标题右上角显示小红点（优先级高于badge） | false
| badge | number / string | 图标右上角徽标的内容 | -
| name | number / string | 标签名称，作为匹配的标识符 | 标签的索引值
| title-style | object | 自定义标题样式 | -
| title-class | string | 自定义标题类名 | -
| icon-type | string | 图标图案，为uniapp扩展组件（uni-ui）下的uni-icons的type值，customPrefix用法等同 | -
| icon-size | number | 图标大小 | 16
| custom-prefix | string | 自定义图标 | -
| image-src | string | 图片路径 | -
| image-mode | string | 图片裁剪、缩放的模式，为uniapp内置组件->媒体组件—>image下的mode属性的可选值 | -
| position | string | 在存在图片或图标的情况下，标题围绕它们所在的位置，可选值：left、top、bottom | right

<div id="tabsEvents" style="color:#4fc08d;">Tabs Events</div>

| 事件名    | 说明		| 回调参数																	
| -------- | -------	| ---------------------------------------------------------------------
| click    | 点击标签时触发 | name：标识符，title：标题
| change   | 当前激活的标签改变时触发 | name：标识符，title：标题
| disabled   | 点击被禁用的标签时触发 | name：标识符，title：标题
| rendered | 标签内容首次渲染时触发（仅在开启延迟渲染后触发） | name：标识符，title：标题
| scroll   | 滚动时触发，仅在 sticky 模式下生效 | { scrollTop: 距离顶部位置, isFixed: 是否吸顶 }


<div id="tabsSlots" style="color:#4fc08d;">Tabs Slots</div>
 
 | 名称      | 说明
 | --------- | ---------------------------------------------------------------------------------
 | nav-left	    | 标题左侧内容	|
 | nav-right	| 标题右侧内容	|
 | title+下标   | 标签标题插槽，插槽名默认为"title"+tab下标（注意：vue3中仅H5、app-vue有效，小程序端无效）
 
 <div id="tabSlots" style="color:#4fc08d;"> Tab Slots</div>
  
  | 名称      | 说明
  | --------- | ---------------------------------------------------------------------------------
  | default  | 标签页内容
 
 <div id="tabsMethod" style="color:#4fc08d;">Tabs 方法</div>
 通过 ref 可以获取到 Tabs 实例并调用实例方法.
 
 | 方法名      | 说明		| 参数		| 返回值													
 | ---------	| -------	| --------	| --------------------------------------------------------
 | resize   | 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘 | - | -
 | reset   | 重置组件的一些状态，主要是用于标题栏改变（个数或者标题文字）时调用，为了使resize方法能够正确的计算内部的一些数据（具体在组合导航中使用到） | callback: 回调函数 | -
 | scrollTo  | 滚动到指定的标签页，在滚动导航模式下可用 | name: 标识符 | -
 
  <div id="beCareful" style="color:#4fc08d;">注意事项及常见问题</div>
  1. 如何解决上下滑动与左右滑动相冲突？
  
  * 直接给标签内容具体的高度，使用scroll-view实现局部滚动
  * 但是这种方式会无法触发页面级的上拉加载与下拉刷新事件，因此需要去插件市场找类似的插件
 
 
 2.如果为侧边栏导航，需要对当前标签附近的两个标签项定义样式，直接可使用"yui-tab__prev"与"yui-tab__next" 类
 
 3.侧边栏导航、滚动导航：
 
 * 两者内容区域的滚动方式通过pageScroll属性控制
 * 为false时，则表示内容区域是放在scroll-view中实现的局部滚动
 * 为true时，则表示内容区域是屏幕在页面上的，跟随页面滚动而滚动(页面级滚动)
 * 如何取舍两者之间的使用，具体就要看使用场景了，比如你的标签页上方有banner图，你需要在滚动过程中让标题栏浮动时，则需要页面级滚动,或者需要触发原生的上拉加载、下拉刷新事件也用该方式；
 * 如果你想两种模式在一定高度内滚动，那么就使用默认的局部滚动实现方式。