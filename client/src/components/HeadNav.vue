<template>
  <el-header class="header">
    <el-row class="top">
      <el-col :span="6">欢迎</el-col>
      <el-col :span="6" :offset="12" class="user-box">
        <img :src="user.avatar" alt="" class="user-img">
        <span>{{user.name}}</span>
        <el-dropdown trigger="click" @command="handleCommand">
          <i class="el-icon-caret-bottom header-icon"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo" icon="el-icon-user">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" icon="el-icon-switch-button">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-header>
</template>
<script>
export default {
  name: 'headNav',
  components: {},
  data() {
    return {}
  },
  created() {
    console.log(this.$store.getters.user)
  },
  computed: {
    user (){
      return this.$store.getters.user;
    }
  },
  methods: {
    handleCommand(command) {
      switch(command) {
        case 'userInfo':
          this.$router.push('/userInfo');
          break;
        case 'logout':
          this.logout();
          break;
        default:
          break;
      }
    },
    logout() {
      // 清除token，设置vuex中的身份状态
      localStorage.removeItem('userToken');
      this.$store.dispatch('clearCurrentState');
      // 跳转到登录页
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped>
  .header {
    padding: 0;
  }
  .header .top {
    position: fixed;
    top: 0;
    z-index: 5;
    width: 100%;
    padding: 0 20px;
    font-size: 14px;
    line-height: 60px;
    color: #fff;
    background-color: #409EFF;
  }
  .header .user-box {
    text-align: right;
  }
  .header .user-img {
    display: inline-block;
    margin-right: 8px;
    vertical-align: middle;
    width: 40px;
    border-radius: 50%;
  }
  .header .header-icon {
    margin-left: 8px;
    font-size: 16px;
    color: #fff;
  }
</style>

