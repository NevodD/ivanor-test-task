import '@/assets/stylus/main.styl'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import server from '@/plugins/server.js'
import App from './App.vue'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(server)
app.mount('#app')