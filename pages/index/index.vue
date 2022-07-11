<template>
	<view class="container">
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in news" :key="index"
				@tap="handleDetails(item)">
				<view class="uni-media-list">
					<image class="uni-media-list-logo" :src="item.author_avatar"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{item.title}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{item.created_at}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: []
			}
		},
		onLoad: function() {
			this.loadData()

			uni.$on('update', function(data) {
				console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
			})
		},
		onUnload() {
			uni.$off('update')
		},
		onPullDownRefresh() {
			this.loadData()

		},
		methods: {
			// 加载数据
			loadData() {
				uni.request({
					url: 'https://unidemo.dcloud.net.cn/api/news',
					method: 'GET',
					data: {},
					success: ({
						data,
						statusCode: code
					}) => {
						if (code == 200) {
							this.news = data
						}
					},
					fail: () => {
						console.error("fail");
					},
					complete: () => {
						uni.stopPullDownRefresh();
					}
				});
			},
			// 跳转详情页
			handleDetails({
				id
			}) {
				uni.navigateTo({
					url: `../details/details?id=${id}`,
				});
			}
		}
	}
</script>

<style scoped>
	/* .container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	} */
	.uni-media-list-body {
		height: auto;
	}

	.uni-media-list-text-top {
		line-height: 1.6em;
	}
</style>
