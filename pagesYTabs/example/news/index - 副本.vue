<template>
	<view class="page-container">
		<y-tabs v-model="activeIndex" swipeable animated swipe-animated :isLazyRender="false" color="#1989fa" title-active-color="#000" title-inactive-color="#555" background="#fff"
			@change="switchTab">
			<y-tab v-for="(tab, index) in tabs" :title="tab.title" :key="index">
				<newsPage class="page-item" :nid="tab.newsid" :ref="'page' + index" />
			</y-tab>
		</y-tabs>
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
					title: '最新',
					newsid: 0
				}, {
					title: '大公司',
					newsid: 23
				}, {
					title: '内容',
					newsid: 223
				}, {
					title: '消费',
					newsid: 221
				}, {
					title: '娱乐',
					newsid: 225
				}, {
					title: '区块链',
					newsid: 208
				}],
				activeIndex: 0, // 标签页当前选择项的下标
				pageList: []
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.pageList = [];
				for (let i = 0; i < this.tabs.length; i++) {
					const item = this.$refs['page' + i]
					if (Array.isArray(item)) {
						this.pageList.push(item[0])
					} else {
						this.pageList.push(item)
					}
				}
			})
		},
		methods: {
			toJSON() {},
			switchTab(index) {
				const tabPage = this.pageList[index]
				if (tabPage.dataList && tabPage.dataList.length === 0) {
					tabPage.loadData();
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.page-item {
		/* #ifndef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 88px);
		/* #endif */
		position: relative;
		overflow: hidden;
		display: block;
	}
</style>
