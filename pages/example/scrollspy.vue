<template>
	<view class="container">
		<button @click="activeIndex=2">切换到第三个标签项</button>
		<view class="placeholder-block">滚动导航</view>
		<yui-tabs :tabs="tabs" v-model="activeIndex" animated sticky duration="0.2" :offsetTop="offsetTop" scrollspy
			@click="handleClick">
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
		</yui-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食', '美味小吃'],
				activeIndex: 0, // 标签页当前选择项的下标
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
			handleClick(index) {
				console.log("index:",index);
			},
		}
	}
</script>

<style lang="less" scoped>
	.placeholder-block {
		height: 110vh;
		padding: 20rpx;
		color: #FF9900;
	}

	.content-wrap {
		height: 50vh;
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
</style>
