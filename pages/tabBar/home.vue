<template>
	<view class="page-container">
		<banner />
		<yui-tabs :tabs="tabs" v-model="activeIndex" animated :background="background" swipeable swipeAnimated
			:isLazyRender="false" sticky :wrapStyle="wrapStyle" :offsetTop="offsetTop" :stickyThreshold="navHeight"
			@scroll="handleScroll">
			<!-- 标签栏右侧额外内容 -->
			<template #extra>
				<view class="extra-wrapper">
					<text>更多</text>
					<uni-icons type="right" :color="'#5e6d82'" size="14" />
				</view>
			</template>
		</yui-tabs>
		<goods-list :activeIndex="activeIndex" />
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
				//tabs:['618返场', '颜值水杯', '家居日用', '冲调零食', '生鲜水果', '鞋子服饰', '钻石珠宝', '生活用品'],
				activeIndex: 0, // 标签页当前选择项的下标
				// 标签页滚动吸顶相关
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
				navHeight: 0, //顶部导航高度
				isFixed: false, //标签栏是否滚动吸顶
			}
		},
		computed: {
			// 固定的标签页的标签栏样式
			wrapStyle() {
				return {
					// 吸顶时给定一个等于导航高度的paddingTop值，用于遮住透明的导航+状态栏区域
					paddingTop: this.isFixed ? this.navHeight + 'px' : 0
				}
			},
			// 标签栏背景色
			background() {
				// 吸顶时标签栏背景色为白色，否则为灰色
				return this.isFixed ? "#FFF" : "#F5F5F5"
			}
		},
		mounted() {
			this.getNavHeight() // 获取导航高度
		},
		// 页面滚动触发事件
		onPageScroll(e) {
			//页面滚动事件
			uni.$emit('onPageScroll', e)
		},
		methods: {
			// 获取导航高度
			getNavHeight() {
				let statusBarH = 0,
					navBarH = 0
				// 获取状态栏的高度+导航栏的高度
		
				// #ifdef MP-WEIXIN || APP-PLUS
				// 微信小程序、APP获取状态栏高度 
				statusBarH = uni.getSystemInfoSync().statusBarHeight
				// #endif
		
				// #ifdef MP-WEIXIN
				// 微信小程序获取胶囊位置信息
				const menuBtnInfo = uni.getMenuButtonBoundingClientRect()
				//navHeight的值为状态栏的高度+导航栏的高度
				if (menuBtnInfo) {
					//导航栏的高度 = (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度)
					navBarH = (menuBtnInfo.bottom - statusBarH) +
						(menuBtnInfo.top - statusBarH)
				}
				// #endif
		
				//状态栏的高度+导航栏的高度
				this.navHeight = navBarH + statusBarH
			},
			// 滚动时触发，仅在 sticky 模式下生效
			handleScroll({
				isFixed
			}) {
				this.isFixed = isFixed
			},
			touchStart(e) {
				e.stopPropagation()
			},
			fabClick() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>
<style lang="less" scoped>
	.extra-wrapper {
		padding: 0 12rpx;
		font-size: 24rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
	}
</style>
