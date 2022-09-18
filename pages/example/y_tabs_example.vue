<template>
	<view class="container">
		<view class="title-wrap">
			<p>如果在小程序中，部分案例的标签栏底部线条位置错误，可能是由于这个页面的标签页组件太多导致的，请单独复制某个案例进行测试。</p>
		</view>

		<view class="title-wrap">
			基础用法
		</view>
		<y-tabs pKey="1" :active="activeIndex1" :isLazyRender="false" animated>
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>


		<view class="title-wrap">
			样式风格
			<view class="title-wrap__desc">
				默认为line，可选：text、card、button、line-button
			</view>
		</view>
		<y-tabs pKey="2" ref="styleTabs" :ellipsis="false" :background="styleType==='button'?'#f5f5f5':''"
			:type="styleType" :active="activeIndex13" lineWidth="20" color="#ee0a24">
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>
		<radio-group class="uni-list" @change="styleChange">
			<view v-for="(item, index) in styles" :pKey="index" class="uni-list-item">
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
			<y-tabs pKey="3" :active="activeIndex2" lineWidth="20" lineHeight="3" color="#ee0a24" background="#fff"
				titleActiveColor="#ee0a24" titleInactiveColor="#333">
				<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
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
		<y-tabs pKey="4" :active="activeIndex3" ellipsis>
			<y-tab v-for="index in 5" :pKey="index" :title="'超长的文本标签'+index">
				<view class="content-wrap"> {{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			点击、标签切换事件
		</view>
		<y-tabs pKey="5" :active="activeIndex4" @click="tabClick" @change="tabChange">
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			标签栏滚动
			<view class="title-wrap__desc">标签数量（swipeThreshold）超过 5
				个且总宽度超过标签栏宽度时，标签栏可以在水平方向上滚动，切换时会自动将当前标签居中(scrollToCenter="false"可取消)</view>
			<view class="title-wrap__desc font-danger">注意：仅在ellipsis="false"且type不为"card"下时有效</view>
		</view>
		<y-tabs pKey="6" :active="activeIndex5" scroll-to-center :ellipsis="false">
			<y-tab v-for="index in 15" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			切换动画
			<view class="title-wrap__desc">通过animated开启切换标签内容时的转场动画</view>
		</view>
		<y-tabs pKey="7" :active="activeIndex6" animated>
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			滑动切换(普通实现)
			<view class="title-wrap__desc">通过swipeable开启手势滑动切换</view>
			<view class="title-wrap__desc font-danger">swiper="false"时即为普通实现</view>
		</view>
		<y-tabs pKey="8" :active="activeIndex7" swipeable animated swipeAnimated :isLazyRender="false">
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view v-for="(idx) in index*5" :pKey="idx">内容{{index}}</view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			滑动切换(swiper实现)
			<view class="title-wrap__desc">通过swipeable开启手势滑动切换</view>
			<view class="title-wrap__desc">通过设置swiper为true,开启swiper组件实现标签页内容左右滑动</view>
			<view class="title-wrap__desc">swiper为true时,需要设置标签页组件高度,同时标签内容需设置为flex:1后自动撑开剩余高度</view>
		</view>
		<y-tabs pKey="9" :active="activeIndex14" swipeable animated swiper :isLazyRender="false" style="height:30vh">
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			自定义标签栏右侧额外内容
			<view class="title-wrap__desc">通过插槽extra自定义内容</view>
		</view>
		<y-tabs pKey="10" :active="activeIndex8" animated>
			<!-- 标签栏右侧额外内容 -->
			<template #extra>
				<view class="extra-wrapper">
					<text class="text">更多</text>
					<!-- <uni-icons type="right" :color="'#5e6d82'" size="14" /> -->
				</view>
			</template>
			<!-- 标签内容 -->
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			标题右上角显示小红点（dot）、徽标（badge）
			<view class="title-wrap__desc">1、tabs需符合{label:'标题',dot:true,badge:'10'}这样的格式
			</view>
			<view class="title-wrap__desc font-danger">2、dot的优先级高于badge</view>
		</view>
		<button size="mini" type="primary" style="margin: 0 0 10rpx 30rpx;" @click="updateBadge">更新徽标</button>
		<y-tabs pKey="11" :active="activeIndex9" animated ref="badgeTabs">
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index" :dot="index===2" :badge="index===3?'10':''">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			自定义标签内容、标题插槽名，以及标题内容
			<view class="title-wrap__desc">1、指定的tabs必须符合{label:'标题',slot:'slotName',titleSlot:'titleSlotName'}这样的格式
			</view>
			<view class="title-wrap__desc">2、slot:标签内容插槽名默认为"pane"+标签下标</view>
			<view class="title-wrap__desc">3、 titleSlot:标题插槽名默认为"title"+标签下标</view>
		</view>
		<y-tabs pKey="12" class="y-tabs" :active="activeIndex10" animated>
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap" style="padding-bottom: 10rpx;">
			滚动导航
			<view class="title-wrap__desc">通过 scrollspy 属性可以开启滚动导航模式，该模式下，内容将会平铺展示。。</view>
			<view class="title-wrap__desc">滚动导航的开启依赖于sticky，需要设置uni.$emit('onPageScroll', e)。</view>
			<view class="title-wrap__desc">由于上面的标签页组件太多，导致内部计算有误，该演示不正确，请查看示例中的滚动导航</view>
		</view>
		<y-tabs pKey="13" :active="activeIndex16" animated sticky duration="0.2" :offsetTop="offsetTop" scrollspy>
			<y-tab title="'标签1">
				<view class="scrollspy-content-wrap bg-red">标签1</view>
			</y-tab>
			<y-tab title="'标签2">
				<view class="scrollspy-content-wrap bg-orange">标签2</view>
			</y-tab>
			<y-tab title="'标签3">
				<view class="scrollspy-content-wrap bg-blue">标签3</view>
			</y-tab>
			<y-tab title="'标签4">
				<view class="scrollspy-content-wrap bg-green">标签4</view>
			</y-tab>
			<y-tab title="'标签5">
				<view class="scrollspy-content-wrap bg-grey">标签5</view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap" style="padding-bottom: 10rpx;">
			异步切换
			<view class="title-wrap__desc">通过 before-change 属性可以在切换标签前执行特定的逻辑。</view>
			<view class="title-wrap__desc">返回 false 可阻止切换，支持返回 Promise。</view>
		</view>
		<y-tabs pKey="14" :active="activeIndex15" animated :before-change="beforeChange">
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
				<view class="content-wrap"> 内容{{index}} </view>
			</y-tab>
		</y-tabs>


		<view class="title-wrap" style="padding-bottom: 10rpx;">
			滚动吸顶
			<view class="title-wrap__desc">在特定的场景下实现，提供了两种方式，在示例项目中:</view>
			<view class="title-wrap__desc">1、fixed模式,采用了两个标签页的场景模拟该效果</view>
			<view class="title-wrap__desc">2、sticky模式(推荐)</view>
			<view class="title-wrap__desc">示例中模拟了透明或者非透明导航栏下的滚动吸顶</view>
			<view class="title-wrap__desc font-danger">如果swiper为true,则滚动吸顶无效</view>
		</view>


		<view class="title-wrap" style="padding-bottom: 10rpx;">
			组件相关事件
			<view class="title-wrap__desc">1、click：点击标签时触发(请查看控制台打印)</view>
			<view class="title-wrap__desc">2、change：当前激活的标签改变时触发</view>
			<view class="title-wrap__desc">3、rendered：标签内容首次渲染时触发（仅在开启延迟渲染后触发）</view>
		</view>
		<y-tabs pKey="15" :active="activeIndex11" animated @click="handleClick" @change="handleChange"
			@rendered="handleRendered">
			<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
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
			<y-tabs pKey="16" ref="tabs" :active="activeIndex12" animated>
				<y-tab v-for="index in 5" :pKey="index" :title="'标签'+index">
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
				this.customTabs.forEach((tab, i) => {
					if (tab.badge) this.$set(tab, 'badge', (Math.random() * 10 + 5).toFixed(0))
				})

				this.$nextTick(() => {
					this.$refs.badgeTabs.resize()
				})
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
