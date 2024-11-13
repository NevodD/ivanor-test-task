import { defineStore } from 'pinia'
import { ref } from 'vue'
import Request from '@/core/Request.js'

export const useOrdersStore = defineStore('orders', () => {

	const orders = ref([])
	
	const getOrders = async (parameters = '') => {
		const response = await Request.send('getOrders', parameters)
		const data = await response.json()
		orders.value = data.orders
	}

	return {
		orders,
		getOrders
	}
})