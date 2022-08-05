<template>
	<view class="page-container">
		<view class="depend-wrapper">
			<p>1、如果使用滑动切换且开启了拖动动画，最好给包裹标签内容的容器设一个min-height（每一个内容容器高度不一致时,拖动出来的内容容器会沿用当前显示的容器高度）</p>
			<p>2、如果标签内容内嵌了轮播组件，可考虑给轮播组件的父容器添加事件@touchstart.stop="touchStart"，禁止事件冒泡，touchStart(e){e.stopPropagation()}
			</p>
		</view>
		<!-- 用于滚动吸顶的标签页 -->
		<yui-tabs :visible="isFixed" :tabs="tabs" v-model="activeIndex" animated fixed :offsetTop="offsetTop"
			:wrapStyle="wrapStyle">
			<template #extra>
				<view class="extra-wrapper">
					<text>更多</text>
					<uni-icons type="right" :color="'#5e6d82'" size="14" />
				</view>
			</template>
		</yui-tabs>
		<!-- 用于默认显示的标签页 -->
		<yui-tabs :visible="!isFixed" :tabs="tabs" v-model="activeIndex" animated background="#f5f5f5" swipeable
			swipeAnimated :isLazyRender="false">
			<!-- 标签栏右侧额外内容 -->
			<template #extra>
				<view class="extra-wrapper">
					<text>更多</text>
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
				//tabs:['618返场', '颜值水杯', '家居日用', '冲调零食', '生鲜水果', '鞋子服饰', '钻石珠宝', '生活用品'],
				activeIndex: 0, // 标签页当前选择项的下标
				// 标签页滚动吸顶相关
				offsetTop: 0, //滚动吸顶下与顶部的最小距离
				navHeight: 0, //顶部导航高度
				isFixed: false, //用于标记标签页是否滚动到顶固定
				time: 0, //时间戳的值，用于控制滚动触发事件中的逻辑不频繁执行
			}
		},
		computed: {
			// 固定的标签页的标签栏样式
			wrapStyle() {
				return {
					paddingTop: 0
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
					this.isFixed = rect.bottom <= 0
				}).exec()
			}
		},
		methods: {
			// 滚动吸顶初始化操作
			scrollToTopInit() {
				// 获取滚动吸顶依赖哪个元素进行显示隐藏操作
				let dependNode
				// #ifdef MP-ALIPAY
				dependNode = uni.createSelectorQuery()
				// #endif
				// #ifndef MP-ALIPAY
				dependNode = uni.createSelectorQuery().in(this)
				// #endif
				dependEl = dependNode.select('.depend-wrapper')


				uni.getSystemInfo({
					success: (e) => {
						console.log(e);
						let offsetTop = 0
						// #ifdef H5
						offsetTop = 43
						// #endif

						this.offsetTop = offsetTop; //this.navHeight
					}
				})

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
	}
</style>
