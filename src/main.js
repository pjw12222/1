/*
 * @Author: your name
 * @Date: 2020-03-13 16:20:06
 * @LastEditTime: 2020-03-14 18:04:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './styles/element-variables.scss'
import 'font-awesome/css/font-awesome.min.css'
import './utils/filter_utils.js'

import store from "./store";
import "./assets/css/reset.css";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.config.productionTip = false

window.bus = new Vue();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")

