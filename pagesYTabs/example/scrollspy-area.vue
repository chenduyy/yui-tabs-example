<template>
	<view class="container">
		<!-- 
			1.默认滚动导航的内容是使用scroll-view实现的区域滚动
			2.需要给滚动的内容区域一个高度值contentHeight，该属性仅在scrollspy属性开启下生效
		 
		 -->
		<y-tabs v-model="activeIndex" :color="' '" line-height="5" nav-height="50" title-active-color="#333" title-inactive-color="#777" animated  :ellipsis="false"  scrollspy :contentHeight="contentHeight">
			<y-tab v-for="(title, index) in tabs" :title="title" :key="index">
				<view class="title-wrap" v-if="index!==0">{{title}}</view>
				<card-list :activeIndex="index" />
			</y-tab>
		</y-tabs>
		<view class="placeholder-block2"></view>
	</view>
</template>

<script>
	import cardList from '@/pagesYTabs/parts/card-list.vue'
	export default {
		components: {
			cardList
		},
		data() {
			return {
				tabs: ['最新上线', '任务中心', '新户专享礼', '月月有好礼', '推荐好友礼', '联名卡专区'],
				activeIndex: 0, // 标签页当前选择项的下标
			}
		},
		computed: {
			// 局部滚动的滚动导航模式下的内容高度
			contentHeight() {
				// 减去顶部导航栏高度以及标题栏高度
				let topNavHeight = 0
				// #ifdef H5
				topNavHeight = 44
				// #endif
				return `calc(100vh - ${topNavHeight}px - 40px)`
			}
		},
		mounted() {},
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

