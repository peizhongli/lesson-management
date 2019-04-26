<template>
  <el-container class="index" direction="vertical">
    <head-nav></head-nav>
    <el-container>
      <aside-nav></aside-nav>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import HeadNav from '../components/HeadNav';
import asideNav from '../components/asideNav';

export default {
  name: "index",
  components: {
    HeadNav,
    asideNav
  },
}
</script>
<style scoped>
  .aside-nav {
    width: 200px;
    background-color: #409EFF;
  }
</style>

