<template>
	<div class="error-page">
		<h2 class="error-page__title">Ошибка</h2>
		<button class="error-page__error-button" @click="closeErrorPage()">
			повторить
		</button>
	</div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const closeErrorPage = () => {
	location.reload()
	appStore.errors = false
}

</script>

<style lang="stylus">
	.error-page
		display flex
		flex-direction column
		align-items center
		justify-content center
		row-gap rem(20)
		min-height: 100vh
		@supports (min-height: 100dvh)
			min-height: 100dvh
		padding rem(40) rem(20) rem(60) rem(20)

		&__title
			font-weight: 500
			font-size: rem(22)
			line-height: 1.3
			text-align: center

		&__error-button
			display flex
			justify-content center
			align-items center
			font-weight: 500
			line-height: 1.3
			text-align: center
			color: $textContrast
			background-color: $bgContrast
			padding: rem(12) rem(20)
			text-transform uppercase
</style>