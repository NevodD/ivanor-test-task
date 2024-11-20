<template>
	<div class="modals-info-about-order freeze-scroll" :class="{ close }">
		<div class="modals-info-about-order__wrapper" :class="{ close }">
			<h2 class="modals-info-about-order__title">Информация о заказе</h2>
			<button v-if="infoAboutOrder" class="main-button modals-info-about-order__delete-button" @click="deleteOrder(infoAboutOrder.id)">Удалить заказ</button>
			<p v-if="deleteErrors" class="modals-info-about-order__delete-text">{{ deleteErrors }}</p>
			<div v-if="infoAboutOrder" class="modals-info-about-order__inner">
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
			<p v-if="infoAboutStatusDeleteOrder" class="modals-info-about-order__delete-text">Заказ был удалён</p>
			<button class="modals-info-about-order__close" @click="closeModals"><span class="visually-hidden">закрыть модальное окно</span></button>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { useOrdersStore } from '@/stores/orders';
	const ordersStore = useOrdersStore()

	const close = ref(false)

	const deleteErrors = ref(null)

	const infoAboutOrder = computed(() => {
		return ordersStore.infoAboutOrder
	})

	const infoAboutStatusDeleteOrder = computed(() => {
		return ordersStore.infoAboutStatusDeleteOrder
	})

	const deleteOrder = async (id) => {
    deleteErrors.value = await ordersStore.deleteOrder(id)
  }

	const closeModals = () => {
		close.value = true
		setTimeout(() => {
			ordersStore.infoAboutOrder = null
			ordersStore.infoAboutStatusDeleteOrder = null
			ordersStore.showInfoAboutOrder = false
			close.value = false
		}, 300)
	
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
		animation visible-item-opacity $transition-duration linear

		&.close
			animation hidden-item-opacity 0.5s linear

		&__delete-button
			width max-content
			margin 0 auto

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
			animation visible-item $transition-duration linear
			@media $desktop
				width 60%
				max-height 80vh
				@supports (max-height: 80dvh)
					max-height 80dvh

			&.close
				animation hidden-item 0.5s linear

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

		&__delete-text
			text-align center

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
			@media $hover
				&:hover
					cursor pointer
			
</style>