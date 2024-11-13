import { useOrdersStore } from '@/stores/orders'


export default (async () => {
	await Promise.all([
		useOrdersStore().getOrders()
	])
})