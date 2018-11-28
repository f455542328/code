// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入elementUI对象
import Element from 'element-ui'
// 引入elementUI样式
import 'element-ui/lib/theme-chalk/index.css'
// 引入公用样式
import '@/assets/css/index.css'
// 引入axios
import MyAxios from '@/assets/js/myaxios.js'
// 注册
Vue.use(MyAxios)
// 注册element
Vue.use(Element)
// 注意只要注册完成，将来可以在任意位置使用element中的组件

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
