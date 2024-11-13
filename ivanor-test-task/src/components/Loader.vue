<template>
	<div class="loader">
		<img src="@/assets/img/loader.gif" alt="Идёт загрузка" width="50" height="50">
	</div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
	const body = document.querySelector('body')
	let scrollBarWidth = 0
	if (body) {
		scrollBarWidth = window.innerWidth - body.offsetWidth
	}
	const bodyStyle = body?.style
	if (bodyStyle) {
		if (scrollBarWidth) {
			bodyStyle.paddingRight = scrollBarWidth + 'px'
		}
		bodyStyle.overscrollBehaviorY = 'contain'
		bodyStyle.overflowY = 'hidden'
	}
})

onUnmounted(() => {
	const bodyStyle = document.querySelector('body')?.style
	if (bodyStyle) {
		bodyStyle.paddingRight = '0px'
		bodyStyle.overscrollBehaviorY = 'auto'
		bodyStyle.overflowY = 'auto'
	}
})
</script>

<style lang="stylus">
	.loader
		display flex
		justify-content center
		align-items center
		position fixed
		inset: 0
		background-color rgba($bgMain, 0.8)
		z-index 100
</style>