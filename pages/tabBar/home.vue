<template>
	<view class="page-container">
		<banner class="depend-wrapper" />
		<!-- 用于滚动吸顶的标签页 -->
		<yui-tabs :visible="isFixed" :tabs="tabs" v-model="activeIndex" animated fixed :wrapStyle="wrapStyle">
			<template #extra>
				<view class="extra-wrapper">
					<text>更多</text>
					<uni-icons type="right" :color="'#5e6d82'" size="14" />
				</view>
			</template>
		</yui-tabs>
		<!-- 用于默认显示的标签页 -->
		<yui-tabs :visible="!isFixed" :tabs="tabs" v-model="activeIndex" animated background="#f5f5f5">
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

	let dependEl = null //依赖元素(请不要将该变量放在data中)
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
				navHeight: 0, //顶部导航高度
				isFixed: false, //用于标记标签页是否滚动到顶固定
				time: 0, //时间戳的值，用于控制滚动触发事件中的逻辑不频繁执行
			}
		},
		computed: {
			// 固定的标签页的标签栏样式
			wrapStyle() {
				return {
					paddingTop: this.isFixed ? this.navHeight + 'px' : 0
				}
			}
		},
		mounted() {
			this.scrollToTopInit() // 滚动吸顶初始化操作
		},
		// 页面滚动触发事件
		onPageScroll(e) {
			if (!dependEl) return
			const time = Date.now()
			if (time - this.time > 10) {
				this.time = time
				// 获取依赖元素的bottom值，判断是否该元素是否完全消失在可见区域中
				// 用于控制用户滚动到顶显示的标签页的显隐
				dependEl.boundingClientRect(rect => {
					this.isFixed = rect.bottom - this.navHeight <= 0
				}).exec()
			}
		},
		methods: {
			// 滚动吸顶初始化操作
			scrollToTopInit() {
				// 获取滚动吸顶依赖哪个元素进行显示隐藏操作
				dependEl = uni.createSelectorQuery().in(this).select('.depend-wrapper')
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
