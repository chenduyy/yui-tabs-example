<template>
	<view class="page-container">
		<view class="depend-wrapper">
			<p>1、如果使用滑动切换且开启了拖动动画，最好给包裹标签内容的容器设一个min-height（每一个内容容器高度不一致时,拖动出来的内容容器会沿用当前显示的容器高度）</p>
			<p>2、如果标签内容内嵌了轮播组件，可考虑给轮播组件的父容器添加事件@touchstart.stop="touchStart"，禁止事件冒泡，touchStart(e){e.stopPropagation()}
			</p>
		</view>

		<yui-tabs :tabs="tabs" v-model="activeIndex" animated :background="background" swipeable swipeAnimated
			:isLazyRender="false" sticky :offsetTop="offsetTop" @scroll="handleScroll">
			<!-- 标签栏右侧额外内容 -->
			<template #extra>
				<view class="extra-wrapper">
					<text class="text">更多</text>
					<uni-icons type="right" :color="'#5e6d82'" size="14" />
				</view>
			</template>
			<template #pane0>
				<view class="content-wrap">
					<view style="margin: 12px;background-color: f5f5f5;" @touchstart.stop="touchStart">
						<banner />
					</view>
					<goods-list :activeIndex="0" />
				</view>
			</template>
			<template #pane1>
				<view class="content-wrap">
					<goods-list :activeIndex="1" />
				</view>
			</template>
			<template #pane2>
				<view class="content-wrap">
					<goods-list :activeIndex="2" />
				</view>
			</template>
			<template #pane3>
				<view class="content-wrap">
					<goods-list :activeIndex="3" />
				</view>
			</template>
		</yui-tabs>
	</view>
</template>

<script>
	import banner from '@/pages/home/banner'
	import goodsList from '@/pages/home/goods-list'

	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			banner,
			goodsList
		},
		data() {
			return {
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食'],
				activeIndex: 0, // 标签页当前选择项的下标
				// 标签页滚动吸顶相关
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
				isFixed: false, //是否吸顶
			}
		},
		computed: {
			// 标签栏背景色
			background() {
				// 吸顶时标签栏背景色为白色，否则为灰色
				return this.isFixed ? "#FFF" : "#F5F5F5"
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
			// 滚动时触发，仅在 sticky 模式下生效
			handleScroll({
				isFixed
			}) {
				this.isFixed = isFixed
			},
			
			touchStart(e) {
				e.stopPropagation()
			}
		}
	}
</script>
<style lang="less" scoped>
	.depend-wrapper {
		padding: 12px;
		font-size: 26rpx;
	}

	.extra-wrapper {
		padding: 0 12rpx;
		font-size: 24rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		
		.text {
			display: inline-block;
			white-space: nowrap;
		}
	}
</style>
