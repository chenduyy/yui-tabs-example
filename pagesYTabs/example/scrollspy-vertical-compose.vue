<template>
	<view class="container">
		<!-- 左侧导航区域：使用侧边栏导航+固定定位固定在左侧 -->
		<view class="left-nav">
			<y-tabs ref="yTabs" v-model="activeIndex" type="text" color="#333" background="#fff" animated scrollspy direction="vertical" nav-width="120px" :nav-height="navHeight" @change="handleChange">
				<y-tab v-for="(tab, index) in tabs" :title="tab.title" :key="index" :imageSrc="index===activeIndex?arcImageSrc:''">
				</y-tab>
			</y-tabs>
		</view>
		<!-- 右侧内容区域：使用页面级滚动的滚动导航-->
		<view class="right-content">
			<banner-jd />
			<y-tabs ref="rightYTabs" v-model="childIndex" animated type="line-button" color="#F56C6C" :ellipsis="false" sticky scrollspy :scrollThreshold="3" pageScroll :offsetTop="offsetTop">
				<y-tab v-for="(title, index) in childTabs" :title="title" :key="index">
					<view class="content-wrap">
						<view class="title-wrap" :id="`title${index}`">{{title}}</view>
						<category-list :activeIndex="index" />
					</view>
				</y-tab>
			</y-tabs>
		</view>
	</view>
</template>

<script>
	import bannerJd from '@/pagesYTabs/parts/banner-jd';
	import categoryList from '@/pagesYTabs/parts/category-list';
	export default {
		components: {
			bannerJd,
			categoryList
		},
		data() {
			return {
				topNavHeight: 0, //顶部导航栏高度
				// 左侧导航相关
				arcImageSrc: `${this.$imgUrl}tea/arc.png`,
				tabs: [
					{ title: '京东超市', imageSrc: '' },
					{ title: '男装', imageSrc: '' },
					{ title: '奢侈品', imageSrc: '' },
					{ title: '女装', imageSrc: '' },
					{ title: '鞋靴', imageSrc: '' },
					{ title: '内衣饰品', imageSrc: '' },
					{ title: '箱包', imageSrc: '' },
					{ title: '美妆护肤', imageSrc: '' },
					{ title: '个护清洁', imageSrc: '' },
					{ title: '钟表珠宝', imageSrc: '' },
					{ title: '手机', imageSrc: '' },
					{ title: '数码', imageSrc: '' },
					{ title: '电脑办公', imageSrc: '' },
					{ title: '家电', imageSrc: '' },
					{ title: '生鲜', imageSrc: '' },
					{ title: '食品酒饮', imageSrc: '' },
					{ title: '母婴童装', imageSrc: '' },
					{ title: '玩具乐器', imageSrc: '' },
					{ title: '医疗保健', imageSrc: '' },
					{ title: '计生情趣', imageSrc: '' },
					{ title: '运动户外', imageSrc: '' },
					{ title: '汽摩生活', imageSrc: '' },
					{ title: '医药', imageSrc: '' },
					{ title: '家居厨具', imageSrc: '' },
				],
				activeIndex: 0, // 标签页当前选择项的下标
				// 右侧内容相关
				childIndex: 0,
				childTabs: ['休闲零食', '中外名酒', '京东生鲜', '粮油调味', '水饮茗茶', '进口食品', '营养保健', '母婴玩具', '家居用品', '个护清洁'],
				scrollId: '',
			};
		},
		computed: {
			// 标签栏导航区域高度
			navHeight() {
				return `calc(100vh - ${this.topNavHeight}px - 6px)`
			},
			// 粘性布局下标签栏与屏幕顶部的最小距离
			offsetTop() {
				return this.topNavHeight
			},
		},
		mounted() {
			// H5端导航栏高度
			// #ifdef H5
			this.topNavHeight = 44;
			// #endif
		},
		// 页面滚动触发事件
		onPageScroll(e) {
			//页面滚动事件
			uni.$emit('onPageScroll', e)
		},
		methods: {
			// 左侧导航点击事件
			handleChange(index, title) {
				if (index === 0) {
					this.childTabs = this.$options.data().childTabs
				} else {
					this.childTabs = Array.from({ length: Math.floor(Math.random() * 10) + 4 }, (_, i) => title + `${i+1}`)
				}
				this.childIndex = 0
				uni.pageScrollTo({ scrollTop: 0, duration: 0 }); //页面回滚至顶部
				const rightYTabs = this.$refs.rightYTabs
				if (rightYTabs) {
					rightYTabs.reset(() => {
						rightYTabs.resize() //手动resize组件一次，使内部一些变量进行初始化
					}) //重置组件状态
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	.container {
		background-color: #f1f1f1;
		box-sizing: border-box;
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		justify-content: flex-end;
		overflow: hidden;
		padding-top: 6px;

		// 左侧导航区域
		.left-nav {
			box-sizing: border-box;
			flex-shrink: 0;
			width: 120px;
			position: fixed;
			left: 0;
		}

		// 右侧滚动内容区域
		.right-content {
			box-sizing: border-box;
			flex-shrink: 0;
			width: calc(100vw - 120px);
			background-color: #fff;
		}
	}

	.flex-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.content-wrap {
		margin: 0 10px;

		.title-wrap {
			font-size: 28rpx;
			font-weight: 640;
			color: #333;
			padding: 20rpx 0 16rpx 20rpx;
		}
	}



	// 左侧导航栏区域
	::v-deep.left-nav .yui-tabs {

		.yui-tab {
			background-color: #f1f1f1;
			height: 92rpx;

			&--active {
				font-size: 32rpx !important;
				font-weight: 640;

				&::before {
					content: " ";
					position: absolute;
					background-color: #fff;
					width: 100%;
					height: 100%;
					border-top-left-radius: 20rpx;
					border-bottom-left-radius: 20rpx;
				}
			}

			&__prev {
				border-bottom-right-radius: 6px;
			}

			&__next {
				border-top-right-radius: 6px;
			}

			// 图片
			&__image {
				width: 8px;
				height: 20px;
			}
		}

	}

	// 右侧滚动内容区域
	::v-deep.right-content .yui-tabs {

		// 不让滚动导航的标签栏占满屏幕高度
		.yui-tabs__wrap--fixed {
			width: calc(100vw - 120px);
			right: 0;
			left: unset;
			padding: 0 !important;
			border-top: 6px solid #f1f1f1; //粘性布局时给定6px的上边框，用于遮挡底部滚动的内容区域
		}

		.yui-tab {
			background: #f6f6f6;
			margin-right: 16rpx;

			&--active {
				background: rgba(245, 108, 108, 0.1);
			}
		}
	}
</style>
