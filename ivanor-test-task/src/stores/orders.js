import { defineStore } from 'pinia'
import { ref } from 'vue'
import Request from '@/core/Request.js'

export const useOrdersStore = defineStore('orders', () => {

	const orders = ref([])

	const infoAboutOrder = ref(null)
	
	const getOrders = async (parameters = '') => {
		const response = await Request.send('getOrders', parameters)
		const data = await response.json()
		orders.value = data.orders
	}

	const getInfoAboutOrder = async (id) => {
		const response = await Request.send('getInfoAboutOrder', '', id)
		const data = await response.json()
		infoAboutOrder.value = data.order
	}

	return {
		orders,
		infoAboutOrder,
		getOrders,
		getInfoAboutOrder
	}
})