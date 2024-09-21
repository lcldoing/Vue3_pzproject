import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'
const app = createApp(App)
//在实例上绑定属性
app.use(router)
app.config.globalProperties.$api = api
app.mount('#app')
