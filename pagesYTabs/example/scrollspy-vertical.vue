<template>
	<view class="container">
		<banner />
		<y-tabs v-model="activeIndex" background="#fff" :ellipsis="false" animated sticky duration="0.2" :offsetTop="offsetTop" scrollspy
			direction="vertical" @click="handleClick">
			<y-tab v-for="(title, index) in tabs" :title="title" :key="index">
				<view class="title-wrap">{{title}}</view>
				<goods-list :activeIndex="index" />
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import banner from '@/pages/home/banner'
	import goodsList from '@/pagesYTabs/parts/goods-list'
	export default {
		components: {
			banner,
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
		methods: {
			handleClick(index) {
				console.log("index:", index);
			},
		}
	}
</script>

<style lang="less" scoped>
	.container {
		background-color: #fff;
	}

	.content-wrap {
		height: 50vh;
	}

	.title-wrap {
		font-size: 16px;
		font-weight: 520;
		padding: 12px 10px 6px;
	}
</style>
