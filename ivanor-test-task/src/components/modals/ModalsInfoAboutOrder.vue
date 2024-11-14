<template>
	<div class="modals-info-about-order freeze-scroll">
		<div class="modals-info-about-order__wrapper">
			<h2 class="modals-info-about-order__title">Информация о заказе</h2>
			<div class="modals-info-about-order__inner">
				<ul class="modals-info-about-order__inner-list">
					<li class="modals-info-about-order__inner-item">
						<h3 class="modals-info-about-order__subtitle">Данные по заказу</h3>
						<dl class="modals-info-about-order__list">
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Номер заказа (ID)</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.id }}</dd>
							</div>
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Номер в учетной системе</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.uid1c }}</dd>
							</div>
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Дата создания</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.created }}</dd>
							</div>
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Статус заказа</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.status.title }}</dd>
							</div>
						</dl>
					</li>
					<li class="modals-info-about-order__inner-item">
						<h3 class="modals-info-about-order__subtitle">Данные по клиенту</h3>
						<dl class="modals-info-about-order__list">
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Фамилия</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.client.lastname }}</dd>
							</div>
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Имя</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.client.firstname }}</dd>
							</div>
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Телефон</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.client.phone }}</dd>
							</div>
						</dl>
					</li>
					<li class="modals-info-about-order__inner-item">
						<h3 class="modals-info-about-order__subtitle">Данные по магазину</h3>
						<dl class="modals-info-about-order__list">
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Адрес</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.shop.title }}</dd>
							</div>
						</dl>
					</li>
					<li v-if="infoAboutOrder.payment.method.id !== 1" class="modals-info-about-order__inner-item">
						<h3 class="modals-info-about-order__subtitle">Данные по способу оплаты</h3>
						<dl class="modals-info-about-order__list">
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Способ оплаты</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.payment.method.title }}</dd>
							</div>
							<div class="modals-info-about-order__item">
								<dt class="modals-info-about-order__dt">Статус оплаты</dt>
								<dd class="modals-info-about-order__dd">{{ infoAboutOrder.payment.status.title }}</dd>
							</div>
						</dl>
					</li>
					<li v-if="infoAboutOrder.items.length" class="modals-info-about-order__inner-item">
						<h3 class="modals-info-about-order__subtitle">Состав заказа</h3>
						<ul class="modals-info-about-order__main-list">
							<li class="modals-info-about-order__main-item" v-for="item in infoAboutOrder.items" :key="item.id">
								<dl class="modals-info-about-order__list">
									<div class="modals-info-about-order__item">
										<dt class="modals-info-about-order__dt">Наименование товара</dt>
										<dd class="modals-info-about-order__dd">{{ item.title }}</dd>
									</div>
									<div class="modals-info-about-order__item">
										<dt class="modals-info-about-order__dt">Количество</dt>
										<dd class="modals-info-about-order__dd">{{ item.quantity }}</dd>
									</div>
									<div class="modals-info-about-order__item">
										<dt class="modals-info-about-order__dt">Цена</dt>
										<dd class="modals-info-about-order__dd">{{ item.price }}</dd>
									</div>
									<div class="modals-info-about-order__item">
										<dt class="modals-info-about-order__dt">Статус резервирования этой позиции в заказе</dt>
										<dd class="modals-info-about-order__dd">{{ item.status }}</dd>
									</div>
								</dl>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<button class="modals-info-about-order__close" @click="closeModals"></button>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue';
	import { useOrdersStore } from '@/stores/orders';
	const ordersStore = useOrdersStore()

	const infoAboutOrder = computed(() => {
		return ordersStore.infoAboutOrder
	})

	const closeModals = () => {
		ordersStore.infoAboutOrder = null
	}
</script>

<style lang="stylus">
	.modals-info-about-order
		display flex
		justify-content center
		align-items center
		position fixed
		inset: 0
		background-color rgba($bgMain, 0.8)
		z-index 100

		&__wrapper
			display flex
			flex-direction column
			row-gap rem(20)
			position relative
			border-radius rem(10)
			background-color $bgMain
			padding-top rem(60)
			padding-bottom rem(60)
			padding-left rem(20)
			padding-right rem(20)
			width 90%
			height 90vh
			@supports (height: 90dvh)
				height 90dvh
			overflow hidden
			box-shadow 0px 0px rem(20) rgba(0, 0, 0, 0.1)
			@media $desktop
				width 60%
				max-height 80vh
				@supports (max-height: 80dvh)
					max-height 80dvh

		&__title
			font-weight: 500
			font-size: rem(22)
			line-height: 1.3
			text-align: center

		&__inner
			display flex
			width 100%
			height 100%
			flex-direction column
			row-gap rem(10)
			overflow-y auto
			flex-grow 1


		&__inner-list
			display flex
			flex-direction column
			row-gap rem(30)

		&__inner-item
			display flex
			flex-direction column
			row-gap rem(20)

		&__list
			display flex
			flex-direction column
			row-gap rem(10)

		&__item
			display grid
			grid-template-columns 1fr 1fr

		&__dt
			font-weight: 500

		&__main-list
			display flex
			flex-direction column
			row-gap rem(20)

		&__close
			position absolute
			top 0
			right 0
			width rem(50)
			height rem(50)
			background-image url('@/assets/img/icons/button-close.svg')
			background-size rem(20)
			background-repeat no-repeat
			background-position 20% 70%
			&:hover
				cursor pointer
		
</style>