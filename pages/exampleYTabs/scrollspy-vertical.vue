<template>
	<view class="container">
		<view class="placeholder-block"></view>
		<y-tabs v-model="activeIndex" animated sticky duration="0.2" :offsetTop="offsetTop" scrollspy
			 direction="vertical" @click="handleClick">
			<y-tab title="618返场">
				<view class="content-wrap bg-red"></view>
			</y-tab>
			<y-tab title="颜值水杯">
				<view class="content-wrap bg-orange"></view>
			</y-tab>
			<y-tab title="家居日用">
				<view class="content-wrap bg-blue"></view>
			</y-tab>
			<y-tab title="冲调零食">
				<view class="content-wrap bg-green"></view>
			</y-tab>
			<y-tab title="美味小吃">
				<view class="content-wrap bg-grey"></view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				console.log("index:", index);
			},
		}
	}
</script>

<style lang="less" scoped>
	.container{
		background-color: #fff;
	}
	.placeholder-block {
		height: 30vh;
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
