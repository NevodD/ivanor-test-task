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
	
	send (type, parameters = '', id) {
		const appStore = useAppStore()
		const {url, method} = this.getUrl(type, new URLSearchParams(parameters).toString(), id)
		let options = {}
		let headers = {}
		if(method === 'get' || method === 'delete') {
			headers = {
				'Token': import.meta.env.VITE_APP_ORDERS_TOKEN
			},
			options = {
				method,
				credentials: 'include',
			}
		}
		
		return new Promise((resolve) => {
			appStore.loader = true
			//const timer = setTimeout(() => {appStore.loader = true}, 500);
			if(method === 'delete') {
				let xhr = new XMLHttpRequest();
				// 2. Настраиваем его: GET-запрос по URL /article/.../load
				xhr.open(method, url);
				xhr.setRequestHeader('Token', '1e36a29720be5be090e34f53b21af940')

				// 3. Отсылаем запрос
				xhr.send();

				// 4. Этот код сработает после того, как мы получим ответ сервера
				xhr.onload = function() {
					if (xhr.status != 204) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
					 	alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
						// appStore.loader = false
					} else { // если всё прошло гладко, выводим результат
						//appStore.loader = false
						return resolve(true)
					}
				};

				//xhr.onprogress = function(event) {
				//	if (event.lengthComputable) {
				//		alert(`Получено ${event.loaded} из ${event.total} байт`);
				//	} else {
				//		alert(`Получено ${event.loaded} байт`); // если в ответе нет заголовка Content-Length
				//	}
					//appStore.loader = false
				//};
				
				xhr.onerror = function() {
					alert("Запрос не удался");
				};
				appStore.loader = false
			} else{
				
				fetch(url, {headers, options})
				.then(response => {
					resolve(response)
					//clearTimeout(timer)
				})
				.catch((err) => {
					appStore.error = true
					resolve(err)
					//clearTimeout(timer)
				}).finally(() => {
					appStore.loader = false
				})
			}
		})
	}
	
	getUrl(type, parameters = '', id) {
		if (!this.api) this.setApi()
		let basePath = this.api

		return {
			'getOrders': {url: basePath + '/orders' + (parameters ? '?' + parameters : ''), method: 'get'},
			'getInfoAboutOrder': {url: basePath + '/order/' + id, method: 'get'},
			'deleteOrder': {url: basePath + '/order/' + id, method: 'delete'},
		}[type];
	}

}

export default Request.getInstance()
