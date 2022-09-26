<template>
	<view class="page-container">
		<yui-tabs :tabs="tabs" v-model="activeIndex" swipeable swiper animated :isLazyRender="false"
			color="#1989fa" title-active-color="#000" title-inactive-color="#555" background="#fff"
			@change="switchTab">
			<template v-for="(tab, index) in tabs" :slot="'pane'+index">
				<newsPage class="page-item" :nid="tab.newsid" :ref="'page' + index" />
			</template>
		</yui-tabs>
	</view>
</template>

<script>
	import newsPage from './news-page';
	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			newsPage
		},
		data() {
			return {
				tabs: [{
					label: '最新',
					newsid: 0
				}, {
					label: '大公司',
					newsid: 23
				}, {
					label: '内容',
					newsid: 223
				}, {
					label: '消费',
					newsid: 221
				}, {
					label: '娱乐',
					newsid: 225
				}, {
					label: '区块链',
					newsid: 208
				}],
				activeIndex: 0, // 标签页当前选择项的下标
				pageList:[]
			}
		},
		mounted() {
			this.pageList = [];
			for (let i = 0; i < this.tabs.length; i++) {
				const item = this.$refs['page' + i]
				if (Array.isArray(item)) {
					this.pageList.push(item[0])
				} else {
					this.pageList.push(item)
				}
			}
			this.switchTab(this.activeIndex);
		},
		methods: {
			toJSON() {},
			switchTab(index) {
				const tabPage = this.pageList[index]
				if ( tabPage.dataList && tabPage.dataList.length === 0) {
					tabPage.loadData();
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.page-container {
		background-color: #fff;
		::v-deep .yui-tabs.yui-tabs--swiper {
			height: 100vh; //需要撑开标签页组件高度

			.page-item {
				flex: 1;
				flex-direction: row;
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
			}

			.yui-tab {
				&--active {
					font-weight: 600;
				}
			}

			.tips {
				font-size: 24rpx;
				padding: 6rpx 18rpx;
			}

		}
	}
</style>
