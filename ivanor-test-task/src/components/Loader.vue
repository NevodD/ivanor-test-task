<template>
	<div class="loader freeze-scroll">
		<img src="@/assets/img/loader.gif" alt="Идёт загрузка" width="50" height="50">
	</div>
</template>

<script setup>

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