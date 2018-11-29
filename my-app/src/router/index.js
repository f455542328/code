import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/login.vue'
import Home from '@/views/home.vue'
import Index from '@/views/index.vue'
import Users from '@/views/users/users.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'index',
          path: 'index',
          component: Index
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        }
      ]
    }
  ]
})
