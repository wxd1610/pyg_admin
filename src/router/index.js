import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
// import VueRouter from 'vue-router';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
// 添加导航守卫
// router.beforeEach((to, from, next) => {
//   // to去的路由对象
//   // from离开路由对象
//   // next滴啊用 下一个路由
//   // next('/xxx')去某个路由
//   if (to.path === '/login') return next()

//   if (!sessionStorage.getItem('token')) return next('/login')
//   next()
// })
