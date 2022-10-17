<template>
	<view class="goods-list-container">
		<no-data v-if="isEmpty" description="暂无相关活动~~" padding="100rpx 0"></no-data>
		<uni-grid v-show="!isEmpty" :column="1" :showBorder="false" class="uni-grid-wrap">
			<uni-grid-item v-for="(item,index) in dataList" :key="index">
				<view class="image-wrap">
					<image class="image-content" mode="scaleToFill" :src="item.img" />
				</view>
				<view class="content-wrap">
					<view class="title">{{item.title}}</view>
					<view class="desc">{{item.desc}}</view>
				</view>
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
				const res = [
					[{
							title: '10月15~17日，温暖家纺49元起',
							img: '5',
							desc: '每天10点抢福利，深秋睡暖觉',
						},{
							title: '玩航海学投资 瓜分40万份好礼',
							img: '6',
							desc: '抽至高188元现金红包',
						},{
							title: '高颜值信用卡榜单',
							img: '7',
							desc: '新户达标好礼多选',
						},{
							title: '升级金葵花卡有礼',
							img: '8',
							desc: '线上升级金葵花卡领猫爪灯',
						},{
							title: '贷款福利社',
							img: '9',
							desc: '宠粉大礼包，好礼抽不停',
						},{
							title: '赢188元红包',
							img: '1',
							desc: '金秋美食季',
						},
						{
							title: '轻松看账',
							img: '2',
							desc: '明白花钱，开启存钱第一步',
						},
						{
							title: '城市保藏 体验有礼',
							img: '3',
							desc: "专属定制 普惠全民",
						},
						{
							title: '关注好品赢礼包',
							img: '4',
							desc: '基金也能享稳又享赢',
						},
					],
					[
						{
							title: '送你一颗财富树',
							img: '10',
							desc: '提升资产配置，抽iPhone 13 Pro',
						},
						{
							title: '生活有招 缴费有礼',
							img: '11',
							desc: "抽88元缴费券",
						},
						{
							title: '大学生专享绑卡支付领好礼',
							img: '12',
							desc: '抽199元消费返现券',
						},
					],
					[
						{
							title: '招商银行App新户专享',
							img: '13',
							desc: '新人大礼包，马上领好礼',
						},
						{
							title: '智能手表、蓝牙耳机等好礼',
							img: '14',
							desc: "推荐亲友办信用卡达标立享",
						},
						{
							title: '3000份美食红包免费领',
							img: '15',
							desc: '饭票新户专享',
						},
					]
				]

				return res.map(list => {
					list.forEach(item => {
						item.img = `${this.$imgUrl}zs/${item.img}.png`
					})
					return list
				})
			},
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
		padding-top: 12rpx;

		::v-deep .uni-grid-wrap {
			width: 100vw;
		}

		::v-deep .uni-grid-item {
			margin: 0px 16px 20px;
			box-sizing: border-box;
			height: auto !important;
			box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.04);
			border-radius: 6px;
			width: calc(100vw - 24px) !important;

			.uni-grid-item__box {
				border: none;
			}
		}


		// 图片区域
		.image-wrap {
			display: block;
			height: 160rpx;

			.image-content {
				border-radius: 6px 6px 0 0;
				width: 100%;
				height: 160rpx;
				background-color: #fff;
			}
		}

		.content-wrap {
			padding: 12px 16px;

			.title {
				font-size: 30rpx;
				font-weight: 620;
			}

			.desc {
				padding-top: 6px;
				font-size: 24rpx;
				color: #777;
			}
		}
	}
</style>
