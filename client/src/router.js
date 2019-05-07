import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index'
import Notfound from './views/Notfound'
import Register from './views/Register'
import Login from './views/Login'
import Home from './views/Home'
import UserInfo from './views/UserInfo'
import Lesson from './views/Lesson'
import Collection from './views/Collection'
import Subscription from './views/Subscription'
import LessonInfo from './views/LessonInfo'
import LessonEdit from './views/LessonEdit'
import LessonBrowse from './views/LessonBrowse'
import LessonEditList from './views/LessonEditList'
import Test from './components/avatarEdit'

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
          component: Home,
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
          component: Lesson,
        },
        {
          path: '/collection',
          component: Collection
        },
        {
          path: '/subscription',
          component: Subscription
        },
        {
          path: '/lessonInfo',
          component: LessonInfo
        },
        {
          path: '/lessonEdit',
          component: LessonEdit
        },
        {
          path: '/lessonBrowse',
          component: LessonBrowse
        },
        {
          path: '/lessonEditList',
          component: LessonEditList
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
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '*',
      name: 'notfound',
      component: Notfound
    },
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
