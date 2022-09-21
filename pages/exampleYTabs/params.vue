<template>
	<view class="container">
		<view class="title-wrap">
			<p>如果在小程序中，部分案例的标签栏底部线条位置错误，可能是由于这个页面的标签页组件太多导致的，请单独复制某个案例进行测试。</p>
		</view>

		<view class="title-wrap">
			基础用法
		</view>
		<y-tabs v-model="activeIndex1" :isLazyRender="false" animated>
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>


		<view class="title-wrap">
			样式风格
			<view class="title-wrap__desc">
				默认为line，可选：text、card、button、line-button
			</view>
		</view>
		<y-tabs ref="styleTabs" :ellipsis="false" :background="styleType==='button'?'#f5f5f5':''" :type="styleType"
			v-model="activeIndex13" lineWidth="20" color="#ee0a24">
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>
		<radio-group class="uni-list" @change="styleChange">
			<view v-for="(item, index) in styles" :key="index" class="uni-list-item">
				<view class="uni-list-item__container">
					<view class="uni-list-item__content">
						<text class="uni-list-item__content-title">{{ item.text }}</text>
					</view>
					<view class="uni-list-item__extra">
						<radio :value="item.value" :checked="item.checked" />
					</view>
				</view>
			</view>
		</radio-group>

		<view class="title-wrap">
			设置标签栏相关颜色及线条
			<view class="title-wrap__desc">1、自定义标签主题色(color)</view>
			<view class="title-wrap__desc">2、标题文字默认/选中颜色(titleInactiveColor/titleActiveColor)</view>
			<view class="title-wrap__desc">3、标签栏背景色(background)</view>
			<view class="title-wrap__desc">4、底部线条宽度/高度(lineWidth/lineHeight)</view>
		</view>
		<view style="padding: 20px;">
			<y-tabs v-model="activeIndex2" lineWidth="20" lineHeight="3" color="#ee0a24" background="#fff"
				titleActiveColor="#ee0a24" titleInactiveColor="#333">
				<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
					<view class="content-wrap"> 内容{{index}} </view>
				</y-tab>
			</y-tabs>
		</view>

		<view class="title-wrap">
			标签标题文字超出省略
			<view class="title-wrap__desc">
				通过ellipsis开启是否省略过长的标题文字
			</view>
		</view>
		<y-tabs v-model="activeIndex3" ellipsis>
			<y-tab v-for="index in 5" :key="index" :title="'超长的文本标签'+index">
				<view class="content-wrap"> {{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			点击、标签切换事件
		</view>
		<y-tabs v-model="activeIndex4" @click="tabClick" @change="tabChange">
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			标签栏滚动
			<view class="title-wrap__desc">标签数量（swipeThreshold）超过 5
				个且总宽度超过标签栏宽度时，标签栏可以在水平方向上滚动，切换时会自动将当前标签居中(scrollToCenter="false"可取消)</view>
			<view class="title-wrap__desc font-danger">注意：仅在ellipsis="false"且type不为"card"下时有效</view>
		</view>
		<y-tabs v-model="activeIndex5" scroll-to-center :ellipsis="false">
			<y-tab v-for="index in 15" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			切换动画
			<view class="title-wrap__desc">通过animated开启切换标签内容时的转场动画</view>
		</view>
		<y-tabs v-model="activeIndex6" animated>
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			滑动切换
			<view class="title-wrap__desc">1.通过swipeable开启手势滑动切换</view>
			<view class="title-wrap__desc">2.可通过swipeAnimated开启标签内容的拖动动画，拖动动画开启后需将isLazyRender设为false</view>
			<view class="title-wrap__desc">3.该方式会和上下滑动有部分冲突，可将swipe-threshold设大一点</view>
			<view class="title-wrap__desc">
				4.如果无法接收与上下滑动有部分冲突，可将标签内容(.y-tabs__pane)的高度设为固定高度，在每个标签内容页中使用scroll-view实现局部滚动，目前示例中的新闻列表就是采用此方式</view>
		</view>
		<y-tabs v-model="activeIndex7" animated swipeable swipeAnimated :isLazyRender="false">
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap">
					<view v-for="(idx) in (index+1)*3" :key="idx">内容{{index}}</view>
				</view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			自定义标签栏右侧额外内容
			<view class="title-wrap__desc">通过插槽extra自定义内容</view>
		</view>
		<y-tabs v-model="activeIndex8" animated>
			<!-- 标签栏右侧额外内容 -->
			<template #extra>
				<view class="extra-wrapper">
					<text class="text">更多</text>
					<uni-icons type="right" :color="'#5e6d82'" size="14" />
				</view>
			</template>
			<!-- 标签内容 -->
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			标题右上角显示小红点（dot）、徽标（badge）
		</view>
		<button size="mini" type="primary" style="margin: 0 0 10rpx 30rpx;" @click="updateBadge">更新徽标</button>
		<y-tabs v-model="activeIndex9" animated ref="badgeTabs">
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index" :dot="index===2"
				:badge="index===3?badgeValue:''">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			自定义标题
			<view class="title-wrap__desc">1、标题插槽名默认为"title"+下标</view>
			<view class="title-wrap__desc">2、仅支持vue2，vue3暂不支持v-for生成动态具名插槽</view>
		</view>
		<y-tabs class="y-tabs" v-model="activeIndex10" animated scrollThreshold="4">
			<template #title0>
				我是自定义标题
			</template>
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap" style="padding-bottom: 10rpx;">
			异步切换
			<view class="title-wrap__desc">1.通过 before-change 属性可以在切换标签前执行特定的逻辑。</view>
			<view class="title-wrap__desc">2.返回 false 可阻止切换，支持返回 Promise。</view>
		</view>
		<y-tabs v-model="activeIndex15" animated :before-change="beforeChange">
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>
		
		<view class="title-wrap" style="padding-bottom: 10rpx;">
			滚动导航
			<view class="title-wrap__desc">1.通过 scrollspy 属性可以开启滚动导航模式，该模式下，内容将会平铺展示</view>
			<view class="title-wrap__desc">2.滚动导航的开启依赖于sticky，需要设置uni.$emit('onPageScroll', e)</view>
			<view class="title-wrap__desc">3.本示例由于组件过多，可能导致内部计算有误，具体请查看示例中的滚动导航</view>
		</view>
		<y-tabs v-model="activeIndex16" animated sticky duration="0.2" :offsetTop="offsetTop" scrollspy>
			<y-tab title="标签1">
				<view class="scrollspy-content-wrap bg-red">标签1</view>
			</y-tab>
			<y-tab title="标签2">
				<view class="scrollspy-content-wrap bg-orange">标签2</view>
			</y-tab>
			<y-tab title="标签3">
				<view class="scrollspy-content-wrap bg-blue">标签3</view>
			</y-tab>
			<y-tab title="标签4">
				<view class="scrollspy-content-wrap bg-green">标签4</view>
			</y-tab>
			<y-tab title="标签5">
				<view class="scrollspy-content-wrap bg-grey">标签5</view>
			</y-tab>
		</y-tabs>


		<view class="title-wrap" style="padding-bottom: 10rpx;">
			滚动吸顶
			<view class="title-wrap__desc">1.使用sticky属性开启</view>
			<view class="title-wrap__desc">2.示例中模拟了透明或者非透明导航栏下的滚动吸顶</view>
		</view>
		<y-tabs v-model="activeIndex14" animated sticky :offsetTop="stickyOffsetTop">
			<y-tab v-for="index in 5" :key="index" :title="'标题名'+index">
				<view class="content-wrap">
					<view v-for="(idx) in 20" :key="idx">内容{{index}}</view>
				</view>
			</y-tab>
		</y-tabs>


		<view class="title-wrap" style="padding-bottom: 10rpx;">
			组件相关事件
			<view class="title-wrap__desc">1、click：点击标签时触发(请查看控制台打印)</view>
			<view class="title-wrap__desc">2、change：当前激活的标签改变时触发</view>
			<view class="title-wrap__desc">3、rendered：标签内容首次渲染时触发（仅在开启延迟渲染后触发）</view>
		</view>
		<y-tabs v-model="activeIndex11" animated @click="handleClick" @change="handleChange" @rendered="handleRendered">
			<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>


		<view class="title-wrap">
			组件实例方法resize
			<view class="title-wrap__desc">外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘
			</view>
		</view>
		<button size="mini" type="primary" style="margin: 0 0 10rpx 30rpx;" @click="handleResize">调用resize</button>
		<view :style="{paddingLeft:paddingLeft+'px'}">
			<y-tabs ref="tabs" v-model="activeIndex12" animated>
				<y-tab v-for="index in 5" :key="index" :title="'标签'+index">
					<view class="content-wrap"> 内容{{index}} </view>
				</y-tab>
			</y-tabs>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex1: 0,
				activeIndex2: 0,
				activeIndex3: 0,
				activeIndex4: 0,
				activeIndex5: 10,
				activeIndex6: 0,
				activeIndex7: 0,
				activeIndex8: 0,
				activeIndex9: 0,
				activeIndex10: 0,
				activeIndex11: 0,
				activeIndex12: 0,
				activeIndex13: 0,
				activeIndex14: 0,
				activeIndex15: 0,
				activeIndex16: 0,
				paddingLeft: 0,
				styleType: 'line',
				badgeValue: 7,
				styles: [{
						value: 'line',
						text: '线条',
						checked: true
					},
					{
						value: 'text',
						text: '文字'
					},
					{
						value: 'card',
						text: '卡片'
					},
					{
						value: 'button',
						text: '面性按钮'
					},
					{
						value: 'line-button',
						text: '线性按钮'
					}
				],
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
				stickyOffsetTop: 44,
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: (e) => {
					let offsetTop = 0
					// #ifdef H5
					offsetTop = 43
					this.stickyOffsetTop = this.stickyOffsetTop + offsetTop
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
			// 标签点击事件
			tabClick(index, item) {
				console.log("tabClick", index, item);
			},
			// 标签切换事件
			tabChange(index, item) {
				console.log("tabChange", index, item);
			},
			// 更新徽标
			updateBadge() {
				this.badgeValue = Math.floor(Math.random() * 10) + 5;
			},
			// 调用组件实例方法
			handleResize() {
				this.paddingLeft = this.paddingLeft === 20 ? 0 : 20
				this.$refs.tabs.resize()
			},
			handleClick(index) {
				console.log("click：", index);
			},
			handleChange(index) {
				console.log("change：", index);
			},
			handleRendered(index) {
				console.log("rendered：", index);
			},
			styleChange(e) {
				if (this.styleType !== e.detail.value) {
					this.styleType = e.detail.value
					this.activeIndex13 = 0
					this.$nextTick(() => {
						this.$refs.styleTabs.resize()
					})
				}
			},
			beforeChange(index) {
				console.log("beforeChange：", index);
				// 返回 false 表示阻止此次切换
				if (index === 1) {
					uni.showToast({
						title: "已阻止",
						duration: 1000
					})
					return false;
				}

				// 返回 Promise 来执行异步逻辑
				return new Promise((resolve) => {
					// 在 resolve 函数中返回 true 或 false
					if (index === 3) {
						uni.showToast({
							title: "已阻止",
							duration: 1000
						})
					}
					resolve(index !== 3);
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.extra-wrapper {
		padding: 0 12rpx;
		font-size: 22rpx;
		height: 80rpx;
		display: flex;
		align-items: center;

		.text {
			display: inline-block;
			white-space: nowrap;
		}
	}

	.container {
		.title-wrap {
			margin: 0;
			padding: 64rpx 32rpx 32rpx;
			color: rgba(69, 90, 100, 0.6);
			font-weight: normal;
			font-size: 28rpx;
			line-height: 32rpx;

			&:nth-child(1) {
				padding-top: 16rpx;
			}

			&__desc {
				font-size: 24rpx;
				line-height: 32rpx;
			}
		}

		ul {
			font-size: 28rpx;
			line-height: 40rpx;
			color: rgba(69, 90, 100, 0.6);
			margin-bottom: 20rpx;
		}

		.content-wrap {
			width: 100%;
			padding: 48rpx 40rpx;
			font-size: 28rpx;
			background-color: #fff;
		}

		.img-wrap {
			width: 100vw;
		}

		p {
			line-height: 40rpx;
			color: #555;
		}

		.custom-title {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;

			.iconfont {
				font-size: 28rpx;
			}

			.my-tag {
				display: inline-block;
				height: 20rpx;
				min-width: 20rpx;
				padding: 4rpx 4rpx;
				line-height: 20rpx;
				font-size: 18rpx;
				background: red;
				color: #ffffff;
				border-radius: 8rpx;
				margin-left: 4rpx;
			}
		}

		.uni-list {
			flex: 1;
			margin-top: 15px;
		}

		.uni-list-item {
			display: flex;
			flex: 1;
			flex-direction: row;
			background-color: #FFFFFF;
		}


		.uni-list-item__container {
			padding: 12px 15px;
			width: 100%;
			flex: 1;
			position: relative;
			display: flex;
			box-sizing: border-box;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: #eee;
		}

		.uni-list-item__content-title {
			font-size: 14px;
		}

		.font-danger {
			color: orangered;
		}

		::v-deep .yui-tabs.yui-tabs--swiper {
			height: 40vh; //需要撑开标签页组件高度

			.content-wrap {
				flex: 1; //使标签内容占满剩余区域
			}

		}

	}

	.scrollspy-content-wrap {
		height: 33vh;
		color: #fff;
		padding: 20px;
	}

	.bg-red {
		background-color: #F56C6C;
	}


	.bg-orange {
		background-color: #FF9900;
	}

	.bg-blue {
		background-color: #409EFF;
	}

	.bg-green {
		background-color: #67C23A;
	}

	.bg-grey {
		background-color: #c0c0c0;
	}
</style>
