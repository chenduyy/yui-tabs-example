<template>
	<view class="container">
		<!-- 信息区域 -->
		<view class="info-panel">
			<view class="info-panel__postion flex-row">
				<view class="postion flex-row"><text>茶百道长沙潇湘奥园店</text>
					<uni-icons type="right" size="10" color="#7e7e7e" />
				</view>
				<selectSwitch :switchList="['自提','外送']" bj_color="#f8f8f8" checked_bj_color='#0050c8' />
			</view>
			<view class="distance">距离您0.86km</view>
			<view class="address">湖南省长沙市岳麓区潇湘奥林匹克花园13栋-15栋一层120号</view>
		</view>
		<!-- 
		
			侧边栏导航（页面级滚动）：
				1.标签栏使用的scroll-view实现的局部滚动：
				2.内容区域垂直铺开展示，跟随页面滚动;
				3.在这种模式下，可以给定一个sticky，在内容区域滚动时使侧边导航进行吸顶，开启了sticky属性需要发射出uni.$emit('onPageScroll', e)，否则无法监听滚动事件进行吸顶
				4.在H5端，由于有顶部导航栏的存在，需要设置一下offsetTop,让吸顶的导航栏减去这部分高度
				5.如果手动设置了navHeight，会导致导航高度一直是这个值不变，那么就需要监听@scroll事件去根据是否吸顶计算具体的导航高度
		 
		 -->
		<!--  :navHeight="navHeight" -->
		<y-tabs ref="yTabs" v-model="activeIndex" background="#f7f7f7" color="#0050c8" line-height="108rpx" animated scrollspy direction="vertical" sticky pageScroll :offsetTop="offsetTop">
			<y-tab v-for="(tab, index) in tabs" :title="tab.title" :key="index" :position="tab.position || 'right'" :imageSrc="tab.imageSrc || ''" :titleStyle="{fontSize:'24rpx'}"
				:titleClass="tab.titleClass || ''">
				<div class="content-wrap">
					<banner v-if="index===0" />
					<view class="title-wrap">{{ tab.title }}</view>
					<tea-list :activeIndex="index" />
				</div>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	import selectSwitch from "@/pagesYTabs/xuan-switch/xuan-switch.vue";
	import banner from '@/pagesYTabs/parts/banner';
	import teaList from '@/pagesYTabs/parts/tea-list';
	export default {
		components: {
			selectSwitch,
			banner,
			teaList
		},
		data() {
			return {
				tabs: [
					{ title: '新品推荐', imageSrc: `${this.$imgUrl}tea/hot2.png`, titleClass: "first-tab", position: "left" },
					{ title: '双喜葡萄', imageSrc: "" },
					{ title: '特选红树莓', imageSrc: "" },
					{ title: '现蒸芋头', imageSrc: "" },
					{ title: '超人气奶茶', imageSrc: `${this.$imgUrl}tea/hot.png` },
					{ title: '时令水果茶', imageSrc: '' },
					{ title: '暴打柠檬茶', imageSrc: '' },
					{ title: '冷萃茶', imageSrc: '' },
					{ title: '限定回顾', imageSrc: '' },
					{ title: '加料', imageSrc: '' },
					{ title: '保温袋', imageSrc: '' },
				],
				activeIndex: 0, // 标签页当前选择项的下标
				infoHeight: 96, //信息区域高度
				offsetTop: 0, //粘性布局下导航栏与顶部的最小距离
			};
		},
		computed: {
			// 标签栏导航区域高度
			navHeight() {
				// 减去顶部导航栏高度以及信息区域高度
				let topNavHeight = 0
				// #ifdef H5
				topNavHeight = 44
				// #endif
				return `calc(100vh - ${topNavHeight}px - ${this.infoHeight}px)`
			}
		},
		mounted() {
			// H5端导航栏高度为44px，吸顶时需要减去该高度
			// #ifdef H5
			this.offsetTop = 44
			// #endif

			// 获取信息区域高度
			this.getRect(".info-panel").then(res => {
				this.infoHeight = res?.height || 0
			})
		},
		// 页面滚动触发事件
		onPageScroll(e) {
			//页面滚动事件
			uni.$emit('onPageScroll', e)
		},
		methods: {
			getSelectorQuery() {
				let query = null;
				// #ifdef MP-ALIPAY
				query = uni.createSelectorQuery();
				// #endif
				// #ifndef MP-ALIPAY
				query = uni.createSelectorQuery().in(this);
				// #endif
				return query;
			},
			// 获取元素位置信息
			getRect(...selectors) {
				return new Promise((resolve, reject) => {
					if (!selectors) reject('Parameter is empty');
					const query = this.getSelectorQuery();
					selectors.forEach(seletor => {
						query.select(seletor).boundingClientRect();
					});
					query.exec(data => {
						data = data || [];
						resolve(data.length === 1 ? data[0] : data);
					});
				});
			},
		}
	};
</script>

<style lang="less" scoped>
	::v-deep.container {
		background-color: #fff;

		.info-panel {
			padding: 20rpx;

			.info-panel__postion {
				justify-content: space-between;
			}

			.postion {
				font-size: 36rpx;
				font-weight: 600;
				color: #333;
				flex-shrink: 0;
				width: 70%;
			}

			.uni-icons {
				margin-left: 20rpx;
			}

			.switch-container {
				width: 176rpx;
				height: 50rpx;
				border-radius: 50rpx;
				border: none;
			}

			.distance,
			.address {
				font-size: 22rpx;
				color: #aeaeae;
				flex-shrink: 0;
				width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding: 8rpx 0;
			}
		}

		.content-wrap {
			padding-left: 24rpx;

			.title-wrap {
				font-size: 24rpx;
				font-weight: 520;
				color: #333;
				padding: 20rpx 0;
			}
		}


		.yui-tabs {

			.yui-tabs__line--vertical {
				left: 0px;
				border-radius: 0 !important;
			}

			.yui-tab {
				height: 108rpx;
				background-color: #f7f7f7;

				&.first-tab {
					.yui-tab__image {
						position: absolute;
						top: 14px;
						right: 10px;
					}
				}

				&--active {
					background-color: #fff;
				}

				&__prev {
					border-bottom-right-radius: 6px;
				}

				&__next {
					border-top-right-radius: 6px;
				}

				// 图片
				&__image {
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					margin-right: 4rpx;
				}
			}
		}

	}

	.flex-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
</style>
