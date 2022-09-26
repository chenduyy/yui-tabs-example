<template>
	<view class="page-container">
		<y-tabs v-model="activeIndex" :background="'#fff'" animated swipeable swipeAnimated :isLazyRender="false"
			:offsetTop="offsetTop">
			<y-tab v-for="(title, index) in tabs" :title="title" :key="index">
				<scroll-view class="scroll-wrap">
					<goods-list :activeIndex="index" />
				</scroll-view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import goodsList from '@/pages/home/goods-list'
	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			goodsList
		},
		data() {
			return {
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食'],
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
		methods: {}
	}
</script>
<style lang="less" scoped>
	.page-container {
		.info-wrap {
			padding: 24rpx;
			font-size: 26rpx;

		}

		.extra-wrapper {
			padding: 0 12rpx;
			font-size: 24rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
		}

		::v-deep.fab-circle-icon {
			transform: rotate(135deg);
		}

		.collapse-content {
			padding-left: 10rpx;
		}
	}

	.scroll-wrap {
		/* #ifndef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 88px);
		/* #endif */
	}
</style>
