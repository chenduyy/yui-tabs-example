<template>
	<view class="container">
		<test-comp>
			<template #test1>ssdfsdf</template>
			<template #test2>ssdfsdf</template>
		</test-comp>
		<yui-tabs :tabs="tabs" v-model="activeIndex" animated :is-lazy-render="false">
			<template #pane0>
				<view>1111werwerwerwerwer</view>
			</template>
			<template #pane1>
				1111
			</template>
			<template #pane2>
				1111
			</template>
			<template #pane3>
				1111
			</template>
		</yui-tabs>
	</view>
</template>

<script>
	import testComp from "./test.vue"
	export default {
		components:{testComp},
		data() {
			return {
				tabs: ['618返场', '颜值水杯', '家居日用', '冲调零食'],
				activeIndex: 0, // 标签页当前选择项的下标
			}
		},
		methods: {}
	}
</script>

<style lang="less" scoped>
	.container {
		padding: 24rpx 32rpx;
	}
</style>
