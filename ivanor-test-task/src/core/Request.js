import { useAppStore } from '@/stores/app'

class Request {
	static getInstance () {
		return Request._instance || new Request()
	}

	orders () {
		this.api = ''
	}
	
	setApi() {
		this.api = import.meta.env.VITE_APP_ORDERS_API
	}
	
	send (type, parameters = '') {
		const appStore = useAppStore()
		const {url, method} = this.getUrl(type, new URLSearchParams(parameters).toString())
		let options = {}
		let headers = {}
		if(method === 'get') {
			headers = {
				'Token': import.meta.env.VITE_APP_ORDERS_TOKEN
			},
			options = {
				method,
				credentials: 'include',
			}
		}
		
		return new Promise((resolve) => {
			const timer = setTimeout(() => {appStore.loader = true}, 500);
			fetch(url, {headers, options})
			.then(response => {
				if(!response.ok) {
					appStore.error = true
				}
				resolve(response)
				clearTimeout(timer)
			})
			.catch((err) => {
				appStore.error = true
				resolve(err)
				clearTimeout(timer)
			}).finally(() => {
				appStore.loader = false
			})
		})
	}
	
	getUrl(type, parameters = '') {
		if (!this.api) this.setApi()
		let basePath = this.api

		return {
			'getOrders': {url: basePath + '/orders' + (parameters ? '?' + parameters : ''), method: 'get'},

		}[type];
	}

}

export default Request.getInstance()
