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
		
			侧边栏导航：标签栏与内容区域都是使用的scroll-view实现的局部滚动：
				1.内容区域的高度等于标签栏的高度navHeight
				2.如果未设置navHeight，组件内容会自动处理，但是在H5端，由于有顶部导航栏的存在，计算会有误，因此需要手动设置一下navHeight
		 
		 -->
		<y-tabs ref="yTabs" v-model="activeIndex" background="#f7f7f7" color="#0050c8" line-height="54px" animated scrollspy direction="vertical" :navHeight="navHeight">
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
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
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
			this.getRect(".info-panel").then(res => {
				this.infoHeight = res?.height || 0
			})
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
	.flex-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
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
				height: 54px;
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

</style>
