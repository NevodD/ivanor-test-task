import { defineStore } from 'pinia'
import { ref } from 'vue'
import Request from '@/core/Request.js'

export const useOrdersStore = defineStore('orders', () => {
	const orders = ref([])

	const infoAboutOrder = ref(null)

	const showInfoAboutOrder = ref(false)

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
			showInfoAboutOrder.value = true
		} else {
			infoAboutOrder.value = null
			return await response.text()
		}
	}

	const deleteOrder = async (id) => {
		const response = await Request.send('deleteOrder', '', id)
		console.log(response);
		if (response) {
			infoAboutStatusDeleteOrder.value = true
			infoAboutOrder.value = null
			getOrders()
		} else {
			infoAboutStatusDeleteOrder.value = null
			infoAboutOrder.value = null
		}
	}

	return {
		orders,
		infoAboutOrder,
		showInfoAboutOrder,
		infoAboutStatusDeleteOrder,
		getOrders,
		deleteOrder,
		getInfoAboutOrder
	}
})