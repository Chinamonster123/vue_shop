import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login,
  meta: {
    title:'登录'
  }
  }, {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/',
        redirect: '/welcome'
      },
      {
      path: '/welcome',
      component:Welcome
      }, {
        path: '/users',
        component:Users
      }, {
        path: '/rights',
        component:Rights
      }, {
        path: '/roles',
        component:Roles
      }, {
        path: '/categories',
        component:Cate
      },{
        path: '/params',
        component:Params
      }, {
        path: '/goods',
        component: List,
    },{
      path: '/goods/add',
      component: Add
      }, {
        path: '/orders',
        component:Order
    }],
    meta: {
      title:'电商后台管理系统'
    }
}]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  //to 将要访问的路由
  //from 从哪个路由进行跳转
  //next 是一个函数 next()表示放行   next(path) 强制跳转到该路由
  document.title=to.matched[0].meta.title
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
