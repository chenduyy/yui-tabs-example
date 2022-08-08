<template>
	<view class="page-container">
		<uni-list>
			<uni-list-item title="标签内容滑动+轮播图" showArrow clickable @click="onClick('swipe_swiper')" />
			<uni-list-item title="滚动吸顶(sticky方式)" showArrow clickable @click="onClick('sticky')" />
			<uni-list-item title="透明导航栏下的滚动吸顶(sticky方式)" showArrow clickable @click="onClick('transparent_sticky')" />
			<uni-list-item title="滚动吸顶(fixed方式)" showArrow clickable @click="onClick('fixed')" />
			<uni-list-item title="透明导航栏下的滚动吸顶(fixed方式)" showArrow clickable @click="onClick('transparent_fixed')" />
			<uni-list-item title="滑动切换" showArrow clickable @click="onClick('slide_switch')" />
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			onClick(name) {
				const url = `/pages/example/${name}`
				console.log("页面路径：", url);
				uni.navigateTo({
					url,
				});
			}
		}
	}
</script>
<style lang="less" scoped>

</style>
