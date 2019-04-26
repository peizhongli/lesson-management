<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode';

export default {
  name: 'app',
  components: {},
  created() {
    if(localStorage.userToken) {
      const decoded = jwtDecode(localStorage.userToken);
       // 存储token到vuex中
      this.$store.dispatch('setAuthenticated', !this.$isEmpty(decoded));
      this.$store.dispatch('setUser', decoded);
    }
  }
}
</script>
<style>
#app {
  color: #606266;
  font-family: '微软雅黑';
}
body::-webkit-scrollbar {
  width: 6px;
  height: 16px;
  background-color: transparent;
}
body::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #cacaca;
  height: 10px;
}
.el-main {
  min-height: 100%;
}
</style>
