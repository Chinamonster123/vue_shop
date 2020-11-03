import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

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
    meta: {
      title:'主页'
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
