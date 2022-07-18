<template>
	<view class="container" :style="{paddingTop: navHeight+'px'}">
		<view class="title-wrap">
			基础用法
		</view>
		<yui-tabs :tabs="tabs1" v-model="activeIndex1" :isLazyRender="false" animated>
			<!-- <view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs1" :key="index">
				<view v-for="(item,sIndex) in 5*(index+1)" :key="sIndex">内容{{(index+1)+'--'+sIndex}}</view>
			</view> -->
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


		<view class="title-wrap">
			设置标签栏相关颜色及线条
			<view class="title-wrap__desc">
				自定义标签主题色(color)、标题文字默认/选中颜色(titleInactiveColor/titleActiveColor)、标签栏背景色(background)、底部线条宽度(lineWidth)、
			</view>
		</view>
		<view style="padding: 20px;position: relative;overflow-x: hidden;">
		<yui-tabs :tabs="tabs1" v-model="activeIndex1" lineWidth="20" color="#ee0a24" background="#fff"
			titleActiveColor="#ee0a24" titleInactiveColor="#333" >
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs1" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>
		</view>

		<view class="title-wrap">
			标签标题文字超出省略
			<view class="title-wrap__desc">
				通过ellipsis开启是否省略过长的标题文字（注意：标签数量未超过导航标签滚动阈值swipeThreshold时才生效）
			</view>
		</view>
		<yui-tabs :tabs="tabs4" v-model="activeIndex7">
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs4" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			点击、标签切换事件
		</view>
		<yui-tabs :tabs="tabs1" v-model="activeIndex1" @click="tabClick" @change="tabChange">
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs1" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			标签栏滚动
			<view class="title-wrap__desc">标签数量（swipeThreshold）超过 5 个时，标签栏可以在水平方向上滚动</view>
		</view>
		<yui-tabs :tabs="tabs2" v-model="activeIndex2">
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs2" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			切换动画
			<view class="title-wrap__desc">通过animated开启切换标签内容时的转场动画</view>
		</view>
		<yui-tabs :tabs="tabs1" v-model="activeIndex3" animated>
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs1" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>
		<view class="title-wrap">
			滑动切换
			<view class="title-wrap__desc">通过swipeable开启手势滑动切换</view>
		</view>
		<yui-tabs :tabs="tabs1" v-model="activeIndex4" animated swipeable>
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs1" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			自定义标签栏右侧额外内容
			<view class="title-wrap__desc">通过插槽extra自定义内容</view>
		</view>
		<yui-tabs :tabs="tabs1" v-model="activeIndex5" animated>
			<!-- 标签栏右侧额外内容 -->
			<template #extra>
				<view class="extra-wrapper">
					<text>更多</text>
					<uni-icons type="right" :color="'#5e6d82'" size="14" />
				</view>
			</template>
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs1" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			自定义标签内容插槽名称
			<view class="title-wrap__desc">指定的tabs必须符合{label:'标签1',slot:'slotName'}这样的格式，否则插槽名称默认为"pane"+标签下标的命名</view>
		</view>
		<!-- 自定义标签栏右侧额外内容 -->
		<yui-tabs class="yui-tabs" :tabs="tabs3" v-model="activeIndex6" animated>
			<template #slot1>
				<view class="content-wrap">内容111</view>
			</template>
			<template #slot2>
				<view class="content-wrap">内容222</view>
			</template>
			<template #slot3>
				<view class="content-wrap">内容333</view>
			</template>
			<template #slot4>
				<view class="content-wrap">内容444</view>
			</template>
			<template #slot5>
				<view class="content-wrap">内容555</view>
			</template>
		</yui-tabs>

		<view class="title-wrap">
			滚动吸顶
			<view class="title-wrap__desc">
				在自定义导航栏的情况下，采用了两个标签页的场景模拟该效果
				让具备fixed属性的标签页通过visible隐藏，显示不固定的标签页，通过监听页面滚动事件，计算一个边界值，处理两个标签页的显隐
			</view>
		</view>

		<image class="img-wrap depend-wrapper" mode="scaleToFill" :src="imgUrl" />
		<!-- 用于滚动吸顶的标签页 -->
		<yui-tabs :visible="isFixed" :tabs="scrollTabs" v-model="activeIndex8" animated fixed :wrapStyle="wrapStyle">
		</yui-tabs>
		<!-- 用于默认显示的标签页 -->
		<yui-tabs :visible="!isFixed" :tabs="scrollTabs" v-model="activeIndex8" animated background="#f5f5f5" swipeable>
			<view class="content-wrap" :slot="`pane${index}`" v-for="(tab,index) in scrollTabs" :key="index">
				<view v-for="(item,sIndex) in 40" :key="sIndex">内容{{index+1}}</view>
			</view>
		</yui-tabs>
	</view>
</template>

<script>
	let dependEl = null //依赖元素(请不要将该变量放在data中)
	export default {
		data() {
			return {
				tabs1: Array.from({
					length: 5
				}, (o, i) => `标签${i+1}`),
				activeIndex1: 0,

				tabs2: Array.from({
					length: 10
				}, (o, i) => `标签${i+1}`),
				activeIndex2: 0,
				activeIndex3: 0,
				activeIndex4: 0,
				activeIndex5: 0,
				activeIndex6: 0,
				tabs3: [{
						label: '618返场',
						slot: 'slot1', //插槽名称
					},
					{
						label: '颜值水杯',
						slot: 'slot2', //插槽名称
					},
					{
						label: '家居日用',
						slot: 'slot3', //插槽名称
					},
					{
						label: '冲调零食',
						slot: 'slot4', //插槽名称
					},
					{
						label: '生鲜水果',
						slot: 'slot5', //插槽名称
					}
				],
				tabs4: Array.from({
					length: 5
				}, (o, i) => `过长的标签${i+1}`),
				activeIndex7: 0,
				imgUrl: require('@/static/image/goods1.png'),
				// 滚动吸顶相关
				navHeight: 0, //状态栏的高度+导航栏的高度
				isFixed: false, //用于标记标签页是否滚动到顶固定
				time: 0, //时间戳的值，用于控制滚动触发事件中的逻辑不频繁执行
				scrollTabs: ['618返场', '颜值水杯', '家居日用', '冲调零食', '生鲜水果', '鞋子服饰', '钻石珠宝', '生活用品'],
				activeIndex8: 0,
			}
		},
		computed: {
			// 固定的标签页的标签栏样式
			wrapStyle() {
				return {
					paddingTop: this.isFixed ? this.navHeight + 'px' : 0
				}
			}
		},
		mounted() {
			this.scrollToTopInit() // 滚动吸顶初始化操作
		},
		// 页面滚动触发事件
		onPageScroll(e) {
			if (!dependEl) return
			const time = Date.now()
			if (time - this.time > 10) {
				this.time = time
				// 获取依赖元素的bottom值，判断是否该元素是否完全消失在可见区域中
				// 用于控制用户滚动到顶显示的标签页的显隐
				dependEl.boundingClientRect(rect => {
					if (rect) this.isFixed = rect.bottom - this.navHeight <= 0
				}).exec()
			}
		},
		methods: {
			// 滚动吸顶初始化操作
			scrollToTopInit() {
				// 获取滚动吸顶依赖哪个元素进行显示隐藏操作
				dependEl = uni.createSelectorQuery().in(this).select('.depend-wrapper')
				let statusBarH = 0,
					navBarH = 0
				// 获取状态栏的高度+导航栏的高度

				// #ifdef MP-WEIXIN || APP-PLUS
				// 微信小程序、APP获取状态栏高度 
				statusBarH = uni.getSystemInfoSync().statusBarHeight
				// #endif

				// #ifdef MP-WEIXIN
				// 微信小程序获取胶囊位置信息
				const menuBtnInfo = uni.getMenuButtonBoundingClientRect()
				//navHeight的值为状态栏的高度+导航栏的高度
				if (menuBtnInfo) {
					//导航栏的高度 = (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度)
					navBarH = (menuBtnInfo.bottom - statusBarH) +
						(menuBtnInfo.top - statusBarH)
				}
				// #endif

				//状态栏的高度+导航栏的高度
				this.navHeight = navBarH + statusBarH
			},
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

<style lang="less" scoped>
	.extra-wrapper {
		padding: 0 12rpx;
		font-size: 22rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
	}

	.container {
		.title-wrap {
			margin: 0;
			padding: 64rpx 32rpx 32rpx;
			color: rgba(69, 90, 100, 0.6);
			font-weight: normal;
			font-size: 28rpx;
			line-height: 32rpx;

			&:nth-child(1) {
				padding-top: 16px;
			}

			&__desc {
				font-size: 22rpx;
				line-height: 32rpx;
			}
		}

		.content-wrap {
			padding: 48rpx 40rpx;
			font-size: 28rpx;
			background-color: #fff;
		}

		.img-wrap {
			width: 100vw;
		}
	}
</style>
