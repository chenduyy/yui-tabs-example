<template>
	<view class="page-container">
		<yui-tabs :tabs="tabs" v-model="activeIndex" animated background="#fff" swipeable swipeAnimated
			:isLazyRender="false">
			<template #pane0>
				<scroll-view scroll-y="true" class="content-wrap">
					<view class="tips">
						<p>1、本案例为滑动切换标签内容。</p>
						<p>2、在滑动的效果下，使每个标签内容的高度一致，这样拖动内容区域时的呈现效果会更好。</p>
						<p>3、本案例中使用scroll-view，将需要的内容放在该组件中，并且固定高度纵向滚动，不因内容所撑开的高度而互相影响。</p>
						<p>4、但是这样的布局，就无法使用页面的下拉刷新、上拉加载等事件，可去插件市场下载相应的插件实现这些效果。</p>
					</view>
					<goods-list :activeIndex="0" />
				</scroll-view>
			</template>
			<template #pane1>
				<view class="content-wrap">
					<scroll-view scroll-y="true" class="content-wrap">
						<goods-list :activeIndex="1" />
					</scroll-view>
				</view>
			</template>
			<template #pane2>
				<view class="content-wrap">
					<scroll-view scroll-y="true" class="content-wrap">
						<goods-list :activeIndex="2" />
					</scroll-view>
				</view>
			</template>
		</yui-tabs>
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
				tabs: ['618返场', '颜值水杯', '家居日用'],
				activeIndex: 0, // 标签页当前选择项的下标
			}
		},
	}
</script>
<style lang="less" scoped>
	.tips {
		font-size: 24rpx;
		padding: 6rpx 18rpx;
	}

	.content-wrap {
		height: calc(100vh - 168rpx);
	}
</style>
