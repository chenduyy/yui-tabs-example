<template>
	<!-- 顶部轮播区域 -->
	<view class="banner-wrapper">
		<!-- <view v-for="(item,index) in 3" :key="index">
			<slot :name="'title'+index" :content="{name:'标题'+index}">标题{{index}}</slot>
		</view> -->
		<uni-swiper-dot :info="swiperList" :current="current" field="content" mode="round" :dots-styles="dotsStyles">
			<swiper class="swiper-box" :autoplay="autoplay" :interval="interval" :duration="duration"
				@change="handleChange">
				<swiper-item v-for="(img ,index) in swiperList" :key="index" class="swpier-item-wrap">
					<view class="swiper-item">
						<image class="swpier-item-img" :src="img" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
	</view>
</template>

<script>
	export default {
		data() {
			return { // 顶部轮播区域相关
				swiperList: Array.from({
					length: 5
				}, (o, i) => `${this.$imgUrl}banner/banner${i+1}.png`),
				current: 0,
				autoplay: false,
				interval: 3000,
				duration: 500,
				dotsStyles: {
					width: 4,
					height: 4,
					bottom: 10,
					backgroundColor: '#C1C1C1',
					border: 'none',
					selectedBackgroundColor: '#fff',
					selectedBorder: 'none'
				},
			}
		},
		mounted() {},
		methods: {
			handleChange(e) {
				this.current = e.detail.current
			}
		}
	}
</script>

<style lang="less" scoped>
	// 顶部轮播banner区域
	.banner-wrapper {
		position: relative;

		// 轮播
		.swiper-box {
			height: 400rpx;

			.swpier-item-img {
				width: 100%;
				height: 600rpx;
			}
		}

		// 指示点样式
		::v-deep .uni-swiper__dots-box {
			.uni-swiper__dots-long {
				width: 34rpx !important;
			}

			.uni-swiper__dots-item {
				margin-left: 24rpx;

				&:nth-child(1) {
					margin-left: 0;
				}
			}
		}
	}
</style>
