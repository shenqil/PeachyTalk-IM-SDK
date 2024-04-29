import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 新增代码：引入全部组件及样式
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);
app.use(Antd).mount("#app");