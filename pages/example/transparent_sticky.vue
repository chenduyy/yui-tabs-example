<template>
	<view class="page-container" :style="{paddingTop:navHeight+'px'}">
		<uni-fab ref="fab" :pattern="pattern" horizontal="right" :popMenu="false" @fabClick="fabClick" />
		<view class="info-wrap">
			<h3>透明导航栏下的滚动吸顶</h3>
			<view>在导航栏+状态栏透明的场景下的标签栏吸顶。</view>
			<view>本案例在微信小程序中，未吸顶时，标签栏背景色为灰色，且没有paddingTop值;吸顶时，标签栏背景色为白色，有paddingTop值，paddingTop撑开了透明的状态栏+导航栏区域</view>
			<view>采用了sticky属性开启吸顶，并在页面生命周期onPageScroll中调用uni.$emit('onPageScroll', e)</view>
			<uni-collapse>
				<uni-collapse-item title="吸顶实现原理">
					<view class="collapse-content">
						<view>原理：结合页面生命周期onPageScroll监听页面滚动，并在滚动时获取依赖元素的bottom值，该依赖元素的作用是判断标签栏何时需要吸顶。</view>
						<view>何时吸顶? </view>
						<view>
							吸顶与依赖元素的rect.bottom值息息相关；该元素放在标签页组件顶部，跟随页面滚动时，bottom值会变化，当bottom值小于等于0时，就说明不在视口可见区域，那么此时标签栏就可以吸顶了。
						</view>
						<view>
							而本案例中，为了不使透明区域出现其他内容，则给标签栏增加了一个paddingTop用于遮盖透明区域；那么这个依赖元素的bottom值就不能在小于等于0时吸顶，而需要在依赖元素全部进入透明区域的最下方时吸顶；
						</view>
						<view>
							因此，组件提供了一个stickyThreshold的属性用于处理这种场景；stickyThreshold值等于透明区域高度，就意味着bottom值小于等于stickyThreshold时，标签栏吸顶，paddingTop撑开的区域正好遮盖住透明区域
						</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>


		<yui-tabs :tabs="tabs" v-model="activeIndex" animated :background="background" swipeable swipeAnimated
			:isLazyRender="false" sticky :wrapStyle="wrapStyle" :offsetTop="offsetTop" :stickyThreshold="navHeight"
			@scroll="handleScroll">
			<view class="content-wrap" :slot="'pane'+index" v-for="(tab,index) in tabs" :key="index">
				<goods-list :activeIndex="index" />
			</view>
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
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食'],
				activeIndex: 0, // 标签页当前选择项的下标
				// 标签页滚动吸顶相关
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
				navHeight: 0, //顶部导航高度
				isFixed: false, //标签栏是否滚动吸顶
				// fab按钮相关
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
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
	.page-container {

		.extra-wrapper {
			padding: 0 12rpx;
			font-size: 24rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
		}
		
		
		.info-wrap {
			padding: 24rpx;
			font-size: 24rpx;
			line-height: 40rpx;
			
			.collapse-content {
				padding-left: 20rpx;
				font-size: 24rpx;
			}
		}

		::v-deep.fab-circle-icon {
			transform: rotate(135deg);
		}
	}
</style>
