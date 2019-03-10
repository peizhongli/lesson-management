<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode';

export default {
  name: 'app',
  components: {
    
  },
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
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
