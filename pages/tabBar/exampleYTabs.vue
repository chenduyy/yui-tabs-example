<template>
	<view class="page-container">
		<uni-list>
			<uni-list-item title="基础用法" showArrow clickable @click="onClick('params')" />
			<uni-list-item title="新闻列表" showArrow clickable @click="onClick('news/index')" />
			<uni-list-item title="滚动导航" showArrow clickable @click="onClick('scrollspy')" />
			<uni-list-item title="侧边栏导航" showArrow clickable @click="onClick('scrollspy-vertical')" />
			<uni-list-item title="滑动切换" showArrow clickable @click="onClick('slide_switch')" />
			<uni-list-item title="滚动吸顶" showArrow clickable @click="onClick('sticky')" />
			<uni-list-item title="透明渐变标题栏" showArrow clickable @click="onClick('transparent-title-bar')" />
			<uni-list-item title="透明导航栏下的滚动吸顶" showArrow clickable @click="onClick('transparent_sticky')" />
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
				const url = `/pagesYTabs/example/${name}`
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
