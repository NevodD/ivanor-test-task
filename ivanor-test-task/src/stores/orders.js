import { defineStore } from 'pinia'
import Request from '@/core/Request.js'

export const useOrdersStore = defineStore('orders', () => {
	
	const getOrders = async (parameters) => {
		const response = await Request.send('getOrders', parameters = '')
		const data = await response.json()
		return data
	}

	return {
		getOrders
	}
})