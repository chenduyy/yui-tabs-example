<template>
	<view class="goods-list-container">
		<no-data v-if="isEmpty" description="抱歉,没有您想要的商品~~" padding="100rpx 0"></no-data>
		<uni-grid v-show="!isEmpty" :column="1" :showBorder="false">
			<uni-grid-item v-for="(item,index) in dataList" :key="index" class="uni-grid-item-wrap">
				<image class="image-wrap" mode="scaleToFill" :src="item.img" />
				<view class="content-wrap">
					<view class="title">{{item.title}}</view>
					<view class="price-wrapper">
						<view class="read-price">￥{{item.price}}</view>
						<view class="organ-price" v-if="!isNull(item.organPrice)">￥{{item.organPrice}}</view>
					</view>
					<view class="tag-wrapper">
						<view class="tag" v-if="item.isFullMinus">
							<view class="tag-text">满减</view>
						</view>
						<view class="tag" v-if="item.isGift">
							<view class="tag-text">赠品</view>
						</view>
						<view class="tag" v-if="item.isRebate">
							<view class="tag-text">返券</view>
						</view>
						<view class="tag" v-if="item.isFullDiscount">
							<view class="tag-text">满折</view>
						</view>
					</view>
					<view class="salc-num-wrapper">
						已售卖{{item.saleNum+(item.saleNum>=100?'+':'')}}件
					</view>
					<text class="iconfont icon-tianjia"></text>
				</view>
				<!-- <view class="content-wrapper">
					<view class="title">{{item.title}}</view>
					<view class="price-wrapper">
						<view class="read-price">￥{{item.price}}</view>
						<view class="organ-price" v-if="!isNull(item.organPrice)">￥{{item.organPrice}}</view>
					</view>
					<view class="tag-wrapper">
						<view class="tag" v-if="item.isFullMinus">
							<view class="tag-text">满减</view>
						</view>
						<view class="tag" v-if="item.isGift">
							<view class="tag-text">赠品</view>
						</view>
						<view class="tag" v-if="item.isRebate">
							<view class="tag-text">返券</view>
						</view>
						<view class="tag" v-if="item.isFullDiscount">
							<view class="tag-text">满折</view>
						</view>
					</view>
					<view class="salc-num-wrapper">
						已售卖{{item.saleNum+(item.saleNum>=100?'+':'')}}件
					</view>
					<text class="iconfont icon-tianjia"></text>
				</view> -->
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	import {
		isNull
	} from "@/common/uitls.js"

	import noData from "@/components/no-data/index"
	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			noData
		},
		props: {
			// 当前选中内容区域的下标
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {}
		},
		computed: {
			dataList() {
				return this.dataSource[this.activeIndex]
			},
			isEmpty() {
				return !this.dataList || this.dataList.length == 0
			},
			dataSource() {
				const list1 = [{
						title: '瑞幸元气弹系列即溶咖啡【单盒装买2盒送生椰浆200g*3盒】',
						img: this.$imgUrl + `goods/goods11.png`,
						price: 89,
						organPrice: 129,
						saleNum: 78900,
						isGift: true, //赠品
						isRebate: true //返券
					}, {
						title: '吸猫系列2.0挂耳咖啡（10g*20袋/盒）',
						img: this.$imgUrl + `goods/goods12.png`,
						price: 79,
						organPrice: 99,
						saleNum: 3500,
						isGift: true, //赠品
						isRebate: true //返券
					}, {
						title: '共禾京品萝卜墩墩一人食600克',
						img: this.$imgUrl + `goods/goods1.png`,
						price: 69,
						organPrice: 86,
						saleNum: 1100,
						isFullMinus: true, //是否满减
						isGift: true, //赠品
						isRebate: true //返券
					},
					{
						title: '【49CHALI5件】蜜桃乌龙原叶水果茶',
						img: this.$imgUrl + `goods/goods2.png`,
						price: 98,
						saleNum: 6600,
						isGift: true, //赠品
						isRebate: true //返券
					},
				]
				const list2 = [{
					title: '一朵杜鹃花随行杯',
					img: this.$imgUrl + `goods/goods13.png`,
					price: 79,
					organPrice: 99,
					saleNum: 400,
					isGift: true, //赠品
				}, {
					title: 'lucky小炸弹吸管杯',
					img: this.$imgUrl + `goods/goods14.png`,
					price: 99,
					organPrice: 149,
					saleNum: 400,
					isGift: true, //赠品
				}, {
					title: '水母梦境双层杯——海洋季系列',
					img: this.$imgUrl + `goods/goods15.png`,
					price: 199,
					organPrice: 200,
					saleNum: 400,
					isGift: true, //赠品
				}, ]

				const list3 = [{
					title: 'TOMIC 文艺陶瓷涂层咖啡杯',
					img: this.$imgUrl + `goods/goods19.png`,
					price: 89,
					organPrice: 99,
					saleNum: 4500,
					isFullDiscount: true, //满折
				}, {
					title: 'TOMIC 敦煌联名双饮吸管杯450ml（赠背带)',
					img: this.$imgUrl + `goods/goods20.png`,
					price: 99,
					saleNum: 6700,
				}, {
					title: '开咯嘟嘟消毒刀架绿色',
					img: this.$imgUrl + `goods/goods21.png`,
					price: 149,
					saleNum: 56,
				}, {
					title: '橙舍 桠•衣帽架',
					img: this.$imgUrl + `goods/goods22.png`,
					price: 199,
					organPrice: 229,
					saleNum: 39,
				}, {
					title: '橙舍 云端移动边几 简约床头桌迷你茶几',
					img: this.$imgUrl + `goods/goods23.png`,
					price: 299,
					organPrice: 598,
					saleNum: 5,
				}, {
					title: '橙舍 沙发伴侣 简约多功能茶几桌',
					img: this.$imgUrl + `goods/goods24.png`,
					price: 299,
					organPrice: 598,
					saleNum: 52,
				}, ]

				const list4 = [{
					title: '瑞幸×阿华田 田蜜小确幸礼盒',
					img: this.$imgUrl + `goods/goods27.png`,
					price: 129,
					organPrice: 149,
					saleNum: 2,
				}, {
					title: '【买一送一顺丰直发】【雅觅】宫廷扁桃仁桃酥',
					img: this.$imgUrl + `goods/goods28.png`,
					price: 29.9,
					saleNum: 1700,
					isFullMinus: true
				}, {
					title: '【顺丰直发】【雅觅】雪花酥抹茶草莓芒果玫瑰火龙果多口味',
					img: this.$imgUrl + `goods/goods29.png`,
					price: 49.9,
					saleNum: 62,
					isFullMinus: true
				}, {
					title: '【顺丰直发】【雅觅】交响乳酪茉莉花饼',
					img: this.$imgUrl + `goods/goods30.png`,
					price: 39.9,
					saleNum: 80,
					isFullMinus: true
				}, {
					title: '【顺丰直发】【雅觅】南瓜能量小方',
					img: this.$imgUrl + `goods/goods31.png`,
					price: 33.9,
					saleNum: 83,
					isFullMinus: true
				}, ]
				return [
					list1, list2, list3, list4, list1, list2, list3
				]
			}
		},
		mounted() {},
		methods: {
			isNull,
		}
	}
</script>

<style lang="less" scoped>
	.goods-list-container {
		position: relative;
		display: block;
		background-color: #fff;

		::v-deep.uni-grid-item {
			height: auto !important;
			margin-bottom: 20px;
		}

		::v-deep.uni-grid-item__box {
			display: flex;
			position: relative;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: center;
			height: 100px;

			.image-wrap {
				width: 100px;
				height: 100px;
				will-change: transform;
				border-radius: 6px;
				flex-shrink: 0;
			}


			.content-wrap {
				flex: 1;
				box-sizing: border-box;
				padding-left: 10px;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100px;

				// 标题
				.title {
					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 24rpx;
				}

				// 价格
				.price-wrapper {
					text-align: center;
					display: flex;
					align-items: center;
					justify-content: flex-start;

					.read-price {
						color: #212121;
						font-size: 24rpx;
						font-weight: 640;
					}

					.organ-price {
						position: relative;
						display: inline-block;
						color: #8b8b8b;
						font-size: 20rpx;
						margin-left: 8rpx;

						&::before {
							content: '';
							position: absolute;
							height: 1rpx;
							width: 100%;
							background-color: #8b8b8b;
							bottom: 50%;
							left: 50%;
							transform: translate(-50%, 100%);
						}
					}
				}

				// 标签
				.tag-wrapper {
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.tag {
						position: relative;
						display: inline-block;
						border: none;
						color: #E76441;
						background-color: #FAEEEB;
						width: 50rpx;
						height: 24rpx;
						line-height: 24rpx;
						margin-right: 12rpx;
						border-radius: 4rpx;
						text-align: center;

						.tag-text {
							font-size: 18rpx;
						}
					}
				}

				// 销售数量
				.salc-num-wrapper {
					color: #888;
					font-size: 20rpx;
				}

				// 添加图标
				.iconfont {
					position: absolute;
					right: 24rpx;
					bottom: 20rpx;
					font-size: 22rpx;
					height: 36rpx;
					width: 36rpx;
					background-color: #343893;
					color: #fff;
					border-radius: 50%;
					line-height: 36rpx;
					text-align: center;
				}

			}
		}
	}
</style>
