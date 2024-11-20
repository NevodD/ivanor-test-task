<template>
  <div v-if="!appStore.error" class="orders main-wrapper">
    <div class="orders__search">
      <div class="orders__search-wrapper">
        <label class="orders__label">
          <input class="orders__input" :type="formData.search.type" :name="formData.search.name" inputmode="numeric" :placeholder="formData.search.placeholder" :value="formData.search.value" @keydown.enter="searchOrder" @input="formData.search.value = $event.target.value, validateInput(formData.search)">
          <span v-if="formData.search.error" class="orders__error">{{ formData.search.error }}</span>
        </label>
        <button class="main-button orders__button" @click="searchOrder">искать</button>
      </div>
      <p v-if="searchError" class="orders__search-error">{{ searchError }}</p>
    </div>
    <div class="orders__filters">
      <div class="orders__filters-wrapper">
        <label class="orders__label">
          <span class="orders__placeholder">
            {{ formData.dateFrom.placeholder }}
          </span>
          <input class="orders__input" :type="formData.dateFrom.type" :name="formData.dateFrom.name" inputmode="numeric" v-model="formData.dateFrom.value" :min="formData.dateFrom.min" :max="formData.dateFrom.max" @keydown.enter.prevent="filtersOrder" @change="validateInput(formData.dateFrom)">
          <span v-if="formData.dateFrom.error" class="orders__error">{{ formData.dateFrom.error }}</span>
        </label>
        <label class="orders__label">
          <span class="orders__placeholder">
            {{ formData.dateTo.placeholder }}
          </span>
          <input class="orders__input" :type="formData.dateTo.type" :name="formData.dateTo.name" inputmode="numeric" v-model="formData.dateTo.value" :min="formData.dateTo.min" :max="formData.dateTo.max" @keydown.enter.prevent="filtersOrder" @change="validateInput(formData.dateTo)">
          <span v-if="formData.dateTo.error" class="orders__error">{{ formData.dateTo.error }}</span>
        </label>
        <div v-if="formData.status.items.length" class="orders__select-wrapper" :class="{ active: toggleSelect }">
          <button class="orders__select-button" @click.stop="toggleSelect = !toggleSelect">Статус заказа<span v-if="formData.status.value.length" class="orders__selected">{{ formData.status.value.length }}</span></button>
          <ul class="orders__select">
            <li class="orders__option" v-for="item in formData.status.items" :key="item.id">
              <label class="orders__label-checkbox" @click.stop>
                <input class="orders__select-input" :type="formData.status.type" :name="formData.status.name" :value="item.id" v-model="formData.status.value" @keydown.enter="filtersOrder" @change="validateInput(formData.status)">
                {{ item.title }}
              </label>
            </li>
          </ul>
        </div>
        <button class="main-button orders__button" @click="filtersOrder">искать</button>
        <p v-if="filtersError" class="orders__search-error orders__search-error_filters">{{ filtersError }}</p>
      </div>
    </div>
      
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
  <ModalsInfoAboutOrder v-if="showInfoAboutOrder" />
  <Loader v-if="appStore.loader" />
  <ErrorPage v-if="appStore.error" />
</template>

<script setup>
  import { ref, computed, onMounted, watch, reactive, onUnmounted } from 'vue';
  import { useAppStore } from '@/stores/app.js'
  import { useOrdersStore } from '@/stores/orders';
  import Loader from '@/components/Loader.vue';
  import LoaderMini from '@/components/LoaderMini.vue';
  import ErrorPage from '@/components/ErrorPage.vue';
  import ModalsInfoAboutOrder from '@/components/modals/ModalsInfoAboutOrder.vue';
  import { useValidate } from '@/assets/js/validate.js';

  const { validateInput, onlyNumbers, orderLength } = useValidate();

  const appStore = useAppStore()
  const ordersStore = useOrdersStore()

  const showInfoAboutOrder = computed(() => {
    return ordersStore.showInfoAboutOrder
  })

  const headersForTable = ['Номер заказа (ID)', 'Дата-время создания заказа', 'Статус заказа', 'Тип отгрузки', 'Дата отгрузки', 'Способ оплаты', 'Место отгрузки (адрес&nbsp;магазина)', 'ФИО клиента', 'Сумма заказа', 'Количество товаров в&nbsp;заказе', 'Кто создал заказ (оператор)']

  const variantsStatusOrder = [
    {
      id: 1,
      title: 'Заказ обрабатывается'
    },
    {
      id: 2,
      title: 'Заказ обработан'
    },
    {
      id: 3,
      title: 'Не хватило товара для резервирования'
    },
    {
      id: 4,
      title: 'Заказ выполнен'
    },
    {
      id: 5,
      title: 'Заказ отменен'
    },
    {
      id: 6,
      title: 'Заказ зарезервирован'
    }
  ]

  const toggleSelect = ref(false)

  const removeToggleSelect = () => {
    if(toggleSelect.value) {
      toggleSelect.value = false
    }
  }

  const loaderMini = ref(null)
  const loaderMiniShow = computed(() => {
    return orders.value.length > preparedOrders.value.length
  })
  const loaderMiniHidden = ref(true)

  const searchError = ref('')

  const filtersError = ref('')
  
  const formData = reactive({
    search: {
      name: 'search',
      type: 'text',
      placeholder: 'Поиск по номеру заказа',
      value: '',
      error: '',
      validators: [onlyNumbers],
      validate: false,
    },
    dateFrom: {
      name: 'dateFrom',
      type: 'date',
      value: '2024-05-01',
      error: '',
      placeholder: 'От даты',
      validate: false,
      min: '2024-05-01',
      max: '2024-06-30'
    },
    dateTo: {
      name: 'date-to',
      type: 'date',
      placeholder: 'До даты',
      value: '2024-06-30',
      error: '',
      validate: false,
      min: '2024-05-01',
      max: '2024-06-30'
    },
    status: {
      name: 'status',
      type: 'checkbox',
      value: [],
      error: '',
      validate: false,
      items: variantsStatusOrder
    },
  })
  
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

  const searchOrder = async () => {
    if(formData.search.value) {
      searchError.value = await ordersStore.getInfoAboutOrder(formData.search.value)
    } else {
      searchError.value = 'Введите номер заказа'
    }
  }

  const filtersOrder = async () => {
    if(formData.dateFrom.value || formData.dateTo.value || formData.status.value.length) {
      const parameters = {
        dateFrom: formData.dateFrom.value,
        dateTo: formData.dateTo.value,
        orderStatus: formData.status.value
      }
      filtersError.value = await ordersStore.getOrders(parameters)
    } else {
      filtersError.value = 'Выберите параметры поиска'
    }
  }

  watch(() => orders.value, () => {
      limits.value = 0
      preparedOrders.value = []
      loadMore()
  })

  watch(() => formData.search.value, () => {
    if(formData.search.value) {
      formData.search.value = formData.search.value.replace(/[^\d]/g, '');
      if(searchError.value) {
        searchError.value = ''
      }
    }
  })
  watch(() => [formData.dateFrom.value, formData.dateTo.value, formData.status.value], () => {
    if(formData.dateFrom.value || formData.dateTo.value || formData.status.value.length) {
      if(filtersError.value) {
        filtersError.value = ''
      }
    }
  })

  
  onMounted(() => {
    document.querySelector('body').addEventListener('click', removeToggleSelect)
  })
  
  onUnmounted(() => {
    document.querySelector('body').removeEventListener('click', removeToggleSelect)
  })
</script>


<style lang="stylus">
  .orders
    display flex
    flex-direction column
    row-gap rem(50)
    padding-top rem(40) 
    padding-bottom rem(60)
    overflow-x auto
    min-height 100vh
    @supports (min-height: 100dvh)
      min-height 100dvh

    &__search
      display flex
      flex-direction column
      row-gap rem(5)

    &__search-wrapper
      display grid
      grid-template-columns 1fr max-content
      align-items start
      column-gap rem(20)
      row-gap rem(5)

    &__search-error_filters
      margin-top rem(-10)
      @media $desktop
        margin-top 0

    &__label
      position relative
      display flex
      flex-direction column
      row-gap rem(5)

    &__label:has(.orders__input[type=date])
      margin-top rem(15)
      @media $desktop
        margin-top 0

    &__label-checkbox
      display flex
      align-items center
      column-gap rem(5)
      padding rem(5) rem(10)
      min-height rem(30)
      @media $hover
        &:hover
          cursor pointer

    &__label-checkbox:has(:checked)
      background-color rgba($bgContrast, 0.1)

    &__input
      display flex
      align-items center
      padding rem(13) rem(20)
      border rem(1) solid $bordertTable
      min-height rem(46)

    &__input[type=date]
      position relative

    &__input[type=date]::-webkit-calendar-picker-indicator
      position absolute
      top 50%
      right 5%
      inset 0
      width 100%
      height 100%
      background transparent

    &__input[type=date]::before
      display block
      content attr(data-placeholder)
      position absolute
      left 0
      top 0

    &__placeholder
      position absolute
      left 0
      bottom 110%
      z-index 1

    &__select-wrapper
      position relative

    &__select-wrapper.active
      .orders__select
        visibility visible
        max-height 100vh

      .orders__select-button:after
        transform rotateX(180deg)

    &__select-button
      display flex
      align-items center
      justify-content space-between
      width 100%
      min-height rem(46)
      text-align left
      padding rem(10) rem(50) rem(10) rem(20) 
      border rem(1) solid $bordertTable

    &__select-button:after
      content ''
      position absolute
      top rem(12)
      right rem(10)
      width rem(20)
      height rem(20)
      background-image url('@/assets/img/icons/arrow-down.svg')
      background-size rem(15)
      background-repeat no-repeat
      background-position 50%
      transition $transition-duration

    &__select
      position absolute
      top calc(100% - 0.1rem)
      left 0
      right 0
      max-height 0
      border-left rem(1) solid $bordertTable
      border-right rem(1) solid $bordertTable
      border-bottom rem(1) solid $bordertTable
      background-color $bgMain
      visibility hidden
      overflow hidden
      transition $transition-duration

    &__select-input
      width rem(15)
      height rem(15)
      accent-color $bgContrast

    &__selected
      display flex
      align-items center
      justify-content center
      width rem(20)
      height rem(20)
      border-radius 50%
      background-color $bgContrast
      color $textContrast

    &__error
      color $textError
      font-size rem(12)

    &__filters-wrapper
      display grid
      grid-template-columns 1fr
      align-items start
      row-gap rem(20)
      @media $desktop
        grid-template-columns repeat(3, 1fr) max-content
        column-gap rem(20)
        row-gap rem(5)

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
      @media $hover
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
