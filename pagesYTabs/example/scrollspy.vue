<template>
	<view class="container">
		<view class="banner-wrap">
			<banner />
		</view>
		<!-- 开启pageScroll属性，即为页面级的滚动导航模式 -->
		<y-tabs v-model="activeIndex" :color="' '" line-height="5" nav-height="50" title-active-color="#333" title-inactive-color="#777" animated sticky :ellipsis="false" :offsetTop="offsetTop"
			scrollspy pageScroll>
			<y-tab v-for="(title, index) in tabs" :title="title" :key="index">
				<view class="title-wrap" v-if="index!==0">{{title}}</view>
				<card-list :activeIndex="index" />
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import banner from '@/pagesYTabs/parts/banner-zs'
	import cardList from '@/pagesYTabs/parts/card-list'
	export default {
		components: {
			banner,
			cardList
		},
		data() {
			return {
				tabs: ['最新上线', '任务中心', '新户专享礼', '月月有好礼', '推荐好友礼', '联名卡专区'],
				activeIndex: 0, // 标签页当前选择项的下标
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
			}
		},
		mounted() {
			// #ifdef H5
			this.offsetTop = 44
			// #endif
		},
		// 页面滚动触发事件
		onPageScroll(e) {
			//页面滚动事件
			uni.$emit('onPageScroll', e)
		},
	}
</script>

<style lang="less" scoped>
	.container {
		background-color: #fff;

		::v-deep .banner-wrap {
			padding: 10px 16px;

			.banner-wrapper {
				background-color: transparent;
				box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.04);
			}

			.banner-wrapper,
			.swiper-item,
			.swpier-item-wrap,
			.swpier-item-img {
				border-radius: 6px;
			}
		}

		.title-wrap {
			font-size: 32rpx;
			font-weight: 620;
			padding: 16px 16px 10px;
		}

		::v-deep .yui-tabs {
			.yui-tabs__wrap {
				border-bottom: 1px solid #eee;
			}

			.yui-tab {
				padding: 0 20px;
			}

			.yui-tab--active {
				font-size: 34rpx;
				font-weight: 620;
			}

			.yui-tabs__line {
				background-color: transparent;
				background-image: linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0.2));
			}
		}
	}
</style>
