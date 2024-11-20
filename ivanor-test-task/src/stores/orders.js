import { defineStore } from 'pinia'
import { ref } from 'vue'
import Request from '@/core/Request.js'

export const useOrdersStore = defineStore('orders', () => {
	const orders = ref([])

	const infoAboutOrder = ref(null)

	const infoAboutStatusDeleteOrder = ref(null)
	
	const getOrders = async (parameters = '') => {
		const response = await Request.send('getOrders', parameters)
		if (response?.status === 200) {
			const data = await response.json()
			orders.value = data.orders
		} else {
			orders.value = []
			return await response.text()
		}
	}

	const getInfoAboutOrder = async (id) => {
		const response = await Request.send('getInfoAboutOrder', '', id)
		if (response?.status === 200) {
			const data = await response.json()
			infoAboutOrder.value = data.order
		} else {
			infoAboutOrder.value = null
			return await response.text()
		}
	}

	const deleteOrder = async (id) => {
		const response = await Request.send('deleteOrder', '', id)
		if (response?.status === 204) {
			const data = await response.text()
			infoAboutStatusDeleteOrder.value = data
		} else {
			infoAboutStatusDeleteOrder.value = null
			return await response.text()
		}
	}

	return {
		orders,
		infoAboutOrder,
		infoAboutStatusDeleteOrder,
		getOrders,
		deleteOrder,
		getInfoAboutOrder
	}
})