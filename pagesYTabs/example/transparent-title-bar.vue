<template>
	<view class="container">
		<view class="banner-wrap"><banner /></view>
		<y-tabs v-model="activeIndex" background="rgba(255,255,255,0)" animated sticky :offsetTop="offsetTop" scrollspy pageScroll transparent>
			<y-tab v-for="(title, index) in tabs" :title="title" :key="index">
				<view class="info-wrap" v-for="idx in 30" :key="idx">{{ title }}</view>
			</y-tab>
		</y-tabs>
		<!-- <view class="placeholder-block2"></view> -->
	</view>
</template>

<script>
import banner from '@/pages/home/banner';
import cardList from '@/pagesYTabs/parts/card-list.vue';
export default {
	components: {
		banner,
		cardList
	},
	data() {
		return {
			tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食'],
			activeIndex: 0, // 标签页当前选择项的下标
			offsetTop: 0 //粘性定位布局下与顶部的最小距离
		};
	},
	mounted() {
		uni.getSystemInfo({
			success: e => {
				let offsetTop = 0;
				// #ifdef H5
				offsetTop = 43;
				// #endif

				this.offsetTop = offsetTop;
			}
		});
	},
	// 页面滚动触发事件
	onPageScroll(e) {
		//页面滚动事件
		uni.$emit('onPageScroll', e);
	}
};
</script>

<style lang="less" scoped>
.container {
	// background-color: #fff;

	::v-deep .banner-wrap {
		padding: 10px 12px;

		.banner-wrapper {
			background-color: transparent;
			box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
		}

		.banner-wrapper,
		.swiper-item,
		.swpier-item-wrap,
		.swpier-item-img {
			border-radius: 6px;
		}
	}

	.info-wrap {
		font-size: 12px;
		line-height: 24px;
		padding-left: 16px;
	}

	::v-deep .yui-tabs {
		.yui-tabs__nav {
			font-size: 20rpx;

			.yui-tab--active {
				font-size: 32rpx;
			}
		}

		.yui-tabs__line {
			background-color: transparent;
			background-image: linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0.2));
		}
	}
}
</style>
