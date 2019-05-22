<template>
  <el-aside width="170px">
    <el-row class="aside-nav">
      <el-col>
        <el-menu active-text-color="#409EFF" router :default-active="$route.path">
          <el-menu-item index="/index">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>课程管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/lesson" v-if="identity==='老师'">
                <span>我的课程</span>
              </el-menu-item>
              <el-menu-item index="/collection">
                <span>我的收藏</span>
              </el-menu-item>
              <el-menu-item index="/subscription">
                <span>我的订阅</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/userInfo">
                <span>我的信息</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
export default {
  name: "asideNav",
  components: {},
  data() {
    return {};
  },
  computed: {
    identity (){
      return this.$store.getters.user.identity;
    }
  },
};
</script>
<style scoped>
.aside-nav {
  position: fixed;
  left: 0;
  top: 60px;
  z-index: 5;
  width: 170px;
  height: 100%;
}
.aside-nav .el-col,
.aside-nav ul {
  height: 100%;
}
.aside-nav a {
  color: #333;
}
.aside-nav .is-active a {
  color: #409eff;
}
.el-submenu .el-menu-item {
  padding: 0;
  min-width: auto;
}
</style>

