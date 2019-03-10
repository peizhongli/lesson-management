<template>
  <el-aside width="200px">
    <el-row class="aside-nav">
      <el-col>
        <el-menu active-text-color="#409EFF" default-active="1">
          <router-link to="/index">
            <el-menu-item index="1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>首页</span>
                </template>
            </el-menu-item>
          </router-link>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-date"></i>
              <span>课程管理</span>
            </template>
            <el-menu-item-group>
              <router-link to="/lesson">
                <el-menu-item index="2-1">
                  <span>我的课程</span>
                </el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item-group>
              <router-link to="/userInfo">
                <el-menu-item index="3-1">
                  <span>我的信息</span>
                </el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
  export default {
    name: 'asideNav',
    components: {},
    data() {
      return {
        
      }
    }
  }
</script>
<style scoped>
  .aside-nav a {
    text-decoration: none;
    color: #333;
  }
  .aside-nav .is-active a {
    color: #409EFF;
  }
</style>

