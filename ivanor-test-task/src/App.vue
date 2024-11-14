<template>
  <div v-if="!appStore.error" class="orders main-wrapper">
    <table v-if="orders.length" class="orders__table">
      <caption class="orders__caption">Найдено {{ orders.length }} {{ totalCurrentQuantityWord }}</caption>
      <tr class="orders__row">
        <th class="orders__th" v-for="header in headersForTable" :key="header" v-html="header"></th>
      </tr>
      <tr class="orders__row" v-for="order in preparedOrders" :key="order.id" @click="getInfoAboutOrder(order.id)">
        <td class="orders__td text-center">{{ order.id }}</td>
        <td class="orders__td">{{ order.created }}</td>
        <td class="orders__td" :class="{ 'orders__td_completed': order.status.id === 4, 'orders__td_reserved': order.status.id === 6, 'orders__td_cancelled': order.status.id === 5}">{{ order.status.title }}</td>
        <td class="orders__td">{{ order.shipment.method.title }}</td>
        <td class="orders__td">{{ order.shipment.date }}</td>
        <td class="orders__td">{{ order.payment.method.title }}</td>
        <td class="orders__td">{{ order.shop.title }}</td>
        <td class="orders__td">{{ order.client.lastname }} {{ order.client.firstname }}</td>
        <td class="orders__td text-center">{{ order.amount }}</td>
        <td class="orders__td text-center">{{ order.quantity }}</td>
        <td class="orders__td text-center">{{ order.operator }}</td>
      </tr>
    </table>
    <p v-else class="orders__empty">Ничего не найдено</p>
    <div v-if="loaderMiniShow" class="orders__loader-mini" :class="{ 'hidden': loaderMiniHidden }" ref="loaderMini">
      <LoaderMini />
    </div>
  </div>
  <ModalsInfoAboutOrder v-if="infoAboutOrder" />
  <Loader v-if="appStore.loader" />
  <ErrorPage v-if="appStore.error" />
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useAppStore } from '@/stores/app.js'
  import { useOrdersStore } from '@/stores/orders';
  import Loader from '@/components/Loader.vue';
  import LoaderMini from '@/components/LoaderMini.vue';
  import ErrorPage from '@/components/ErrorPage.vue';
  import ModalsInfoAboutOrder from '@/components/modals/ModalsInfoAboutOrder.vue';

  const appStore = useAppStore()
  const ordersStore = useOrdersStore()

  const headersForTable = ['Номер заказа (ID)', 'Дата-время создания заказа', 'Статус заказа', 'Тип отгрузки', 'Дата отгрузки', 'Способ оплаты', 'Место отгрузки (адрес&nbsp;магазина)', 'ФИО клиента', 'Сумма заказа', 'Количество товаров в&nbsp;заказе', 'Кто создал заказ (оператор)']

  const loaderMini = ref(null)
  const loaderMiniShow = computed(() => {
    return orders.value.length > preparedOrders.value.length
  })
  const loaderMiniHidden = ref(true)
  
  
  const orders = computed(() => {
    return ordersStore.orders
  })

  const infoAboutOrder = computed(() => {
    return ordersStore.infoAboutOrder
  })

  const preparedOrders = ref([])

  const totalCurrentQuantity = computed(() => {
    return orders.value.length
  })
  
  const totalCurrentQuantityWord = computed(() => {
    let number = totalCurrentQuantity.value
    let word = 'заказ'
    if (number % 10 === 1 && number % 100 !== 11) {
      word += ' '
    } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
      word += 'а '
    } else {
      word += 'ов '
    }
    return word
  })
  
  const limits = ref(0)
  const offset = ref(100)
  
  const autoLoadMore = () => {
		if (loaderMini.value) {
			const callback = function (entries, observer) {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
              loadMore()
							observer.unobserve(loaderMini.value)
					}
					})
			};
			const observer = new IntersectionObserver(callback);
			observer.observe(loaderMini.value);
		}
	}

  const loadMore = () => {
    loaderMiniHidden.value = false
    if(orders.value.length - preparedOrders.value.length > offset.value) {
      limits.value += offset.value
      setTimeout(() => {
        autoLoadMore()
      })
    } else {
      limits.value += orders.value.length - preparedOrders.value.length
    }
    preparedOrders.value = orders.value.slice(0, limits.value)
    setTimeout(() => {
      loaderMiniHidden.value = true
    })
  }

  const getInfoAboutOrder = (id) => {
    ordersStore.getInfoAboutOrder(id)
  }

  watch(() => orders.value, () => {
    if(loaderMiniShow.value) {
      loadMore()
    }
  })

</script>


<style lang="stylus">
  .orders
    display flex
    flex-direction column
    justify-content center
    row-gap rem(50)
    padding-top rem(40) 
    padding-bottom rem(60)
    overflow-x auto

    &__table
      width 100%
      border-collapse collapse
      overflow hidden

    &__caption
      border-top rem(1) solid $bordertTable
      border-left rem(1) solid $bordertTable
      border-right rem(1) solid $bordertTable
      padding rem(20) rem(10)

    &__row:not(:first-of-type)
      &:hover
        cursor pointer

    &__th
    &__td
      border rem(1) solid $bordertTable
      padding rem(5)

    &__td_completed
      background-color darken($bgSuccess, 30)
      color: $textContrast

    &__td_reserved
      background-color $bgSuccess

    &__td_cancelled
      background-color $bgError

    &__empty
      border rem(1) solid $bordertTable
      padding rem(20) rem(10)
      text-align center

    &__loader-mini.hidden
      visibility hidden


</style>
