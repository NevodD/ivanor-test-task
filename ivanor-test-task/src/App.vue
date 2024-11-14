<template>
  <div class="orders main-wrapper">
    <table v-if="orders.length >= 0" class="orders__table">
      <caption class="orders__caption">Найдено {{ orders.length }} {{ totalCurrentQuantityWord }}</caption>
      <tr class="orders__row">
        <th class="orders__th" v-for="header in headersForTable" :key="header" v-html="header"></th>
      </tr>
      <tr class="orders__row" v-for="order in preparedOrders" :key="order.id">
        <td class="orders__td">{{ order.id }}</td>
        <td class="orders__td">{{ order.created }}</td>
        <td class="orders__td" :class="{ 'orders__td_dark-green': order.status.id === 4, 'orders__td_green': order.status.id === 6, 'orders__td_red': order.status.id === 5}">{{ order.status.title }}</td>
        <td class="orders__td">{{ order.shipment.method.title }}</td>
        <td class="orders__td">{{ order.shipment.date }}</td>
        <td class="orders__td">{{ order.payment.method.title }}</td>
        <td class="orders__td">{{ order.shop.title }}</td>
        <td class="orders__td">{{ order.client.lastname }} {{ order.client.firstname }}</td>
        <td class="orders__td">{{ order.amount }}</td>
        <td class="orders__td">{{ order.quantity }}</td>
        <td class="orders__td">{{ order.operator }}</td>
      </tr>
    </table>
    <div v-if="loaderMiniShow" class="orders__loader-mini" :class="{ 'hidden': loaderMiniHidden }" ref="loaderMini">
      <LoaderMini />
    </div>
  </div>
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

    &__loader-mini.hidden
      visibility hidden


</style>
