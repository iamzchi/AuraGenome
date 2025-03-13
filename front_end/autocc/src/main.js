import { createApp } from 'vue'
import './style.scss'
import TDesign from 'tdesign-vue-next';
import App from './App.vue'
import { createPinia } from 'pinia'
import mitt from 'mitt'
const pinia = createPinia()

const app = createApp(App);
const bus = mitt();//bus 是 mitt() 创建的事件总线实例（一个普通对象，不具备 install 方法）
app.use(TDesign);
app.use(pinia); //安装 Vue 插件 ,插件一般都具有install方法
app.provide('bus', bus);//用于在全局范围内提供数据或对象。
app.mount('#app');

