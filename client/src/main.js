import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './http'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import publicMethods from '../public/js/public'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$isEmpty = publicMethods.isEmpty;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
