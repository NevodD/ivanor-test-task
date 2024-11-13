import { useOrdersStore } from '@/stores/orders'

export default (async () => {
	await Promise.all([
		useOrdersStore().getOrders({dateFrom : '2024-05-01', dateTo : '2024-06-30'})
	])
})