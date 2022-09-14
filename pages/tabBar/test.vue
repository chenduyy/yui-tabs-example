<template>
	<view>sssss
		<view  v-for="item in 3" :key="item">
			<slot :name="'test'+item">{{'test'+item}}</slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				slotName: 'test'
			}
		},
		methods: {}
	}
</script>

<style>
</style>
