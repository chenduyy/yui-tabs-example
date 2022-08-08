<template>
	<view class="page-container">
		<view class="info-wrap">
			<uni-collapse>
				<uni-collapse-item title="吸顶实现原理">
					<view class="content">
						<ul>
							<li>非自定义导航栏的场景下标签栏吸顶。</li>
							<li>通过fixed属性开启吸顶，采用了两个标签页的场景模拟该效果</li>
							<li>让具备fixed属性的标签页通过visible隐藏，显示不固定的标签页，通过监听页面滚动事件，计算一个边界值，处理两个标签页的显隐</li>
						</ul>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>

		<view class="depend-wrapper">
			<banner />
		</view>
		<!-- 用于滚动吸顶的标签页 -->
		<yui-tabs :visible="isFixed" :tabs="tabs" v-model="activeIndex" animated fixed :offsetTop="offsetTop" />
		<!-- 用于默认显示的标签页 -->
		<yui-tabs :visible="!isFixed" :tabs="tabs" v-model="activeIndex" animated background="#f5f5f5" />
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
				//tabs:['618返场', '颜值水杯', '家居日用', '冲调零食', '生鲜水果', '鞋子服饰', '钻石珠宝', '生活用品'],
				activeIndex: 0, // 标签页当前选择项的下标
				// 标签页滚动吸顶相关
				isFixed: false, //用于标记标签页是否滚动到顶固定
				time: 0, //时间戳的值，用于控制滚动触发事件中的逻辑不频繁执行
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
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
						let offsetTop = 0
						// #ifdef H5
						offsetTop = 43
						// #endif

						this.offsetTop = offsetTop;
					}
				})
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

	.info-wrap {
		padding: 12px;
		font-size: 26rpx;
	}

	.collapse-content {
		padding-left: 10rpx;
	}
</style>
