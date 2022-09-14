<template>
	<view class="page-container">
		<yui-tabs :tabs="tabs" v-model="activeIndex" type="button"  swipeable swiper animated :ellipsis="false"  :isLazyRender="false"
			color="#f5f5f5" title-active-color="#212121" title-inactive-color="#777" background="#fff">
			<template #pane0>
				<scroll-view scroll-y="true" class="content-wrap">
					<view class="tips">
						<p>1、本案例是使用swiper组件实现的标签内容左右滑动切换的方式</p>
						<p>2、在swiper开启后,我们需要给定标签页组件一个高度,同时需要设置标签内容flex:1,这样标签内容就可以撑开标签页组件的剩余高度.</p>
						<p>3、本案例中使用了scroll-view做局部滚动,如需下拉刷新、上拉加载功能,可去插件市场找相应组件实现.</p>
					</view>
					<goods-list :activeIndex="0" />
				</scroll-view>
			</template>
			<template #pane1>
				<scroll-view scroll-y="true" class="content-wrap">
					<goods-list :activeIndex="1" />
				</scroll-view>
			</template>
			<template #pane2>
				<scroll-view scroll-y="true" class="content-wrap">
					<goods-list :activeIndex="2" />
				</scroll-view>
			</template>
			<template #pane3>
				<scroll-view scroll-y="true" class="content-wrap">
					<goods-list :activeIndex="3" />
				</scroll-view>
			</template>
			<template #pane4>
				<scroll-view scroll-y="true" class="content-wrap">
					<goods-list :activeIndex="4" />
				</scroll-view>
			</template>
			<template #pane5>
				<scroll-view scroll-y="true" class="content-wrap">
					<goods-list :activeIndex="5" />
				</scroll-view>
			</template>
			<template #pane6>
				<scroll-view scroll-y="true" class="content-wrap">
					<goods-list :activeIndex="6" />
				</scroll-view>
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
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食', '生鲜水果', '鞋子服饰', '钻石珠宝'],
				activeIndex: 0, // 标签页当前选择项的下标
			}
		},
		methods:{
		}
	}
</script>
<style lang="less" scoped>
	.page-container {
		::v-deep .yui-tabs.yui-tabs--swiper {
			height: 100vh; //需要撑开标签页组件高度

			.content-wrap {
				flex: 1; //使标签内容占满剩余区域
			}

			.yui-tab {
				background-color: #f9f9f9;

				&--active {
					font-weight: 540;
				}
			}

			.tips {
				font-size: 24rpx;
				padding: 6rpx 18rpx;
			}

		}
	}
</style>
