<template>
	<view class="container">
		<!-- <view class="placeholder-block">滚动导航</view> -->
		<!-- <yui-tabs :tabs="tabs" v-model="activeIndex2" animated sticky duration="0.2" :offsetTop="offsetTop" scrollspy>
			<template #pane0>
				<view class="content-wrap bg-red"></view>
			</template>
			<template #pane1>
				<view class="content-wrap bg-orange"></view>
			</template>
			<template #pane2>
				<view class="content-wrap bg-blue"></view>
			</template>
			<template #pane3>
				<view class="content-wrap bg-green"></view>
			</template>
			<template #pane4>
				<view class="content-wrap bg-grey"></view>
			</template>
		</yui-tabs> -->
		<!-- <y-tabs v-model="activeIndex" :isLazyRender="false" animated swipeable swipeAnimated sticky :offsetTop="44">
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index" :name="'tab'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs> -->

		<!-- <button @click="handleScrollTo">scrollTo</button> -->
		<y-tabs ref="tabs" v-model="activeIndex" :ellipsis="false" :scrollThreshold="4"   animated swipeable swipeAnimated :isLazyRender="false" sticky duration="0.2" :offsetTop="offsetTop" >
			<y-tab title="标签标签11111111" name="tab1">
				<view class="content-wrap bg-red">标签1</view>
			</y-tab>
			<y-tab title="标签标签222222222" name="tab2">
				<view class="content-wrap bg-orange">标签2</view>
			</y-tab>
			<y-tab title="标签标签33333333" name="tab3">
				<view class="content-wrap bg-blue">标签3</view>
			</y-tab>
			<y-tab title="标签标签标签4" name="tab4">
				<view class="content-wrap bg-green">标签4</view>
			</y-tab>
			<y-tab title="标签标签标签5" name="tab5">
				<view class="content-wrap bg-grey">标签5</view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食', '美味小吃'],
				activeIndex2: 0,
				activeIndex: "tab1", // 标签页当前选择项的下标
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
		methods: {
			onChange(name, title) {
				console.log(name, title);
			},
			handleScrollTo() {
				this.$refs.tabs.scrollTo('tab3')
			}
		}
	}
</script>

<style lang="less" scoped>
	.placeholder-block {
		height: 10vh;
		padding: 20rpx;
		color: #FF9900;
	}

	.content-wrap {
		padding: 20px;
		height: 200vh;
		border:1px solid #ff9900;
	}

	.bg-red {
		background-color: #F56C6C;
	}


	.bg-orange {
		background-color: #FF9900;
	}

	.bg-blue {
		background-color: #409EFF;
	}

	.bg-green {
		background-color: #67C23A;
	}

	.bg-grey {
		background-color: #EBEEF5;
	}

	
	
	
	.nav-right-wrap {
		padding: 0 12rpx;
		font-size: 22rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
	
		.text {
			display: inline-block;
			white-space: nowrap;
		}
	}
	
	.container ::v-deep.yui-tab--active{
		font-size: 22px !important;
	}
</style>
