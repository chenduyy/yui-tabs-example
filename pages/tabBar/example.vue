<template>
	<view class="page-container">
		<uni-list>
			<uni-list-item title="标签滑动+轮播图" showArrow clickable @click="onClick('swipe_swiper')" />
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			onClick(name){
				console.log(name);
				uni.navigateTo({
					url: `/pages/example/${name}`,
				});
			}
		}
	}
</script>
<style lang="less" scoped>
	 
</style>
