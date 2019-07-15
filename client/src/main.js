import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './http'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import publicMethods from '../public/js/public'
import '../public/css/iconfont.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$isEmpty = publicMethods.isEmpty;
Vue.prototype.$axios = axios;

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:5000',
}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
