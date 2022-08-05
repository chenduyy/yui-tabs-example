<template>
	<view class="container">
		<view class="title-wrap">
			基础用法
		</view>
		<yui-tabs :tabs="tabs" v-model="activeIndex1" :isLazyRender="false" animated>
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
		<view style="padding: 20px;">
			<yui-tabs :tabs="tabs" v-model="activeIndex2" lineWidth="20" color="#ee0a24" background="#fff"
				titleActiveColor="#ee0a24" titleInactiveColor="#333">
				<!-- 标签内容 -->
				<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs" :key="index">
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
		<yui-tabs :tabs="longTabs" v-model="activeIndex3">
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in longTabs" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			点击、标签切换事件
		</view>
		<yui-tabs :tabs="tabs" v-model="activeIndex4" @click="tabClick" @change="tabChange">
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			标签栏滚动
			<view class="title-wrap__desc">标签数量（swipeThreshold）超过 5 个时，标签栏可以在水平方向上滚动</view>
		</view>
		<yui-tabs :tabs="scrollTabs" v-model="activeIndex5">
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in scrollTabs" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			切换动画
			<view class="title-wrap__desc">通过animated开启切换标签内容时的转场动画</view>
		</view>
		<yui-tabs :tabs="tabs" v-model="activeIndex6" animated>
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			滑动切换
			<view class="title-wrap__desc">通过swipeable开启手势滑动切换</view>
		</view>
		<yui-tabs :tabs="tabs" v-model="activeIndex7" animated swipeable :isLazyRender="false">
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs" :key="index">
				<view v-for="(item,subIndex) in (index+1)*5" :key="subIndex">内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			自定义标签栏右侧额外内容
			<view class="title-wrap__desc">通过插槽extra自定义内容</view>
		</view>
		<yui-tabs :tabs="tabs" v-model="activeIndex8" animated>
			<!-- 标签栏右侧额外内容 -->
			<template #extra>
				<view class="extra-wrapper">
					<text>更多</text>
					<uni-icons type="right" :color="'#5e6d82'" size="14" />
				</view>
			</template>
			<!-- 标签内容 -->
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			标题右上角显示小红点（dot）、徽标（badge）
			<view class="title-wrap__desc">1、tabs需符合{label:'标题',dot:true,badge:'10'}这样的格式
			</view>
			<view class="title-wrap__desc">2、dot的优先级高于badge</view>
		</view>
		<button size="mini" type="primary" style="margin: 0 0 10rpx 30rpx;" @click="updateBadge">更新徽标</button>
		<yui-tabs :tabs="customTabs" v-model="activeIndex9" animated>
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in customTabs" :key="index">
				<view>内容{{index+1}}</view>
			</view>
		</yui-tabs>

		<view class="title-wrap">
			自定义标签内容、标题插槽名，以及标题内容
			<view class="title-wrap__desc">1、指定的tabs必须符合{label:'标题',slot:'slotName',titleSlot:'titleSlotName'}这样的格式
			</view>
			<view class="title-wrap__desc">2、slot:标签内容插槽名默认为"pane"+标签下标</view>
			<view class="title-wrap__desc">3、 titleSlot:标题插槽名默认为"title"+标签下标</view>
		</view>
		<yui-tabs class="yui-tabs" :tabs="customTabs2" v-model="activeIndex10" animated>
			<template #customTitle>
				<view class="custom-title">
					<view>标签</view>
					<view class="my-tag">9</view>
				</view>
			</template>
			<template #title1>
				<view class="custom-title">
					<text class="iconfont icon-tianjia"></text>
					<view>标签</view>
				</view>
			</template>
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

		<view class="title-wrap" style="padding-bottom: 10rpx;">
			滚动吸顶
			<view class="title-wrap__desc">提供了两种方式(可在示例中查看):</view>
		</view>
		<ul>
			<li>fixed模式,采用了两个标签页的场景模拟该效果</li>
			<li>sticky模式(推荐)</li>
		</ul>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex1: 0,
				activeIndex2: 0,
				activeIndex3: 0,
				activeIndex4: 0,
				activeIndex5: 0,
				activeIndex6: 0,
				activeIndex7: 0,
				activeIndex8: 0,
				activeIndex9: 0,
				activeIndex10: 0,
				activeIndex11: 0,
				activeIndex12: 0,
				tabs: Array.from({
					length: 5
				}, (o, i) => `标签${i+1}`),
				longTabs: Array.from({
					length: 5
				}, (o, i) => `过长的标签${i+1}`),
				scrollTabs: Array.from({
					length: 8
				}, (o, i) => `标签名称${i+1}`),
				customTabs: [{
						label: '标签1',
					},
					{
						label: '标签2',
						badge: '11', // 右上角徽标的内容
					},
					{
						label: '标签3',
						badge: '11',
					},
					{
						label: '标签4',
						dot: true // 是否在标题右上角显示小红点
					},
				],
				customTabs2: [{
						label: '618返场',
						slot: 'slot1', //标签内容插槽名
						titleSlot: 'customTitle', //标题插槽名
					},
					{
						label: '颜值水杯',
						slot: 'slot2',
					},
					{
						label: '家居日用',
						slot: 'slot3',
					},
					{
						label: '冲调零食',
						slot: 'slot4',
					},
					{
						label: '生鲜水果',
						slot: 'slot5',
					}
				],
				imgUrl: require('@/static/image/goods1.png'),
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
			},
			// 更新徽标
			updateBadge() {
				this.customTabs.forEach((tab, i) => {
					if (tab.badge) this.$set(tab, 'badge', (Math.random() * 10 + 5).toFixed(0))
				})
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
		
		ul{
			font-size: 28rpx;
			line-height: 40rpx;
			color: rgba(69, 90, 100, 0.6);
			margin-bottom: 20rpx;
		}

		.content-wrap {
			padding: 48rpx 40rpx;
			font-size: 28rpx;
			background-color: #fff;
		}

		.img-wrap {
			width: 100vw;
		}

		p {
			line-height: 40rpx;
			color: #555;
		}

		.custom-title {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;

			.iconfont {
				font-size: 28rpx;
			}

			.my-tag {
				display: inline-block;
				height: 20rpx;
				min-width: 20rpx;
				padding: 4rpx 4rpx;
				line-height: 20rpx;
				font-size: 18rpx;
				background: red;
				color: #ffffff;
				border-radius: 8rpx;
				margin-left: 4rpx;
			}
		}

	}
</style>
