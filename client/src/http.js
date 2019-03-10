import axios from 'axios';
import router from './router';
import { Loading, Message } from 'element-ui';

let loading;
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中···',
    background: 'rgba(0, 0, 0, .5)'
  });
}

function endLoading() {
  loading.close();
}

// 请求拦截
axios.interceptors.request.use(config => {
  startLoading();
  if (localStorage.userToken) {
    // 配置请求头
    config.headers.Authorization = localStorage.userToken;
  }
  return config;
}), error => {
  return Promise.reject(error);
}

// 响应拦截
axios.interceptors.response.use(res => {
  endLoading();
  return res;
}), error => {
  endLoading();
  Message.error(error.res.data);
  // 判断身份状态
  const { status } = error.res;
  if(status == 401) {
    Message.error('身份已过期，请重新登录');
    localStorage.removeItem('userToken');
    this.$router.push('/login')
  }
  return Promise.reject(error);
}

export default axios;
