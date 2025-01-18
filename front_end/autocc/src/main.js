import { createApp } from 'vue'
import './style.scss'
import TDesign from 'tdesign-vue-next';
import App from './App.vue'
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App);
app.use(TDesign);
app.use(pinia);
app.mount('#app');

