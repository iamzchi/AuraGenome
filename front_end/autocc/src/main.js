import { createApp } from 'vue'
import './style.css'
import TDesign from 'tdesign-vue-next';
import App from './App.vue'

const app = createApp(App);
app.use(TDesign);
app.mount('#app');
