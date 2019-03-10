import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Notfound from './views/Notfound.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import UserInfo from './views/UserInfo.vue'
import Lesson from './views/Lesson.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '', 
          component: Home
        },
        {
          path: '/home', 
          component: Home
        },
        {
          path: '/userInfo',
          component: UserInfo
        },
        {
          path: '/lesson',
          component: Lesson
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: 'notfound',
      component: Notfound
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.userToken ? true : false;
  if(to.path == '/login' || to.path == '/register') {
    next();
  } else {
    isLogin ? next() : next('/login');
  }
})

export default router;
