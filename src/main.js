/*
 * @Author: your name
 * @Date: 2020-03-13 16:20:06
 * @LastEditTime: 2020-04-12 13:31:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import './styles/element-variables.scss'
import "font-awesome/css/font-awesome.min.css";
import "./utils/filter_utils.js";

import store from "./store";
import "./assets/css/reset.css";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
//Passive Event Listeners
import "default-passive-events";

import echarts from "echarts";

Vue.prototype.$echarts = echarts;

Vue.use(ElementUI);
Vue.use(mavonEditor);
Vue.config.productionTip = false;

// router.beforeEach((to, from, next) => {
//   let userId = localStorage.getItem("userId");
//   console.log(userId);
//   let isLogin = userId == null || userId == "" || userId == undefined; //true 未登录
//   console.log(isLogin);
//   // if (to.matched.length === 0) {
//   //   //没有匹配到当前路由
//   //   next("/error");
//   // } else
//   if (isLogin && to.path !== "/" && to.path !== "/register") {
//     //如果没有登录，跳转到登录页面
//     next("/");
//   } else if (
//     (to.path === "/" || to.path === "/register" || to.path === "/error") &&
//     !isLogin
//   ) {
//     //如果已经登录，却尝试访问登录页面或者错误页面，将继续保持原本的页面
//     next(from.path);
//   } else {
//     next();
//   }
// });


// import Router from 'vue-router'
// /*设置路由守卫后，this.$router.push(会报错Uncaught (in promise)*/
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//     return originalPush.call(this, location).catch(err => err)
// };
// const originalRepalce = Router.prototype.replace;
// Router.prototype.replace = function replace(location) {
//     return originalRepalce.call(this, location).catch(err => err)
// };


window.bus = new Vue();
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
