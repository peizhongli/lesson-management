<template>
  <el-header class="header">
    <el-row class="top">
      <el-col :span="6">欢迎</el-col>
      <el-col :span="6" :offset="12" class="user-box">
        <img :src="user.avatar" alt class="user-img">
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
  name: "headNav",
  components: {},
  data() {
    return {};
  },
  created() {
    this.sockets.subscribe("notice", data => {
      console.log("新消息");
      this.open(data);
    });
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    open(data) {
      this.$notify({
        title: "提示",
        dangerouslyUseHTMLString: true,
        duration: 0,
        message: `<p><span style="color:#409eff;">${
          data.author
        }</span> 的 <span style="color:#409eff;">${data.title}</span> 更新了 <a href='/lessonInfo?lesson=${data.id}' style="color:#409eff;">立即前往</a></p>`
      });
    },
    handleCommand(command) {
      switch (command) {
        case "userInfo":
          this.$router.push("/userInfo");
          break;
        case "logout":
          this.logout();
          break;
        default:
          break;
      }
    },
    logout() {
      this.$axios
        .get("/api/profiles/subscription")
        .then(res => {
          this.$socket.emit("logout", {
            username: this.$store.getters.user.name,
            list: res.data.list
          });
          // 清除token，设置vuex中的身份状态
          localStorage.removeItem("userToken");
          this.$store.dispatch("clearCurrentState");
          // 跳转到登录页
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
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
  background: linear-gradient(
    to left,
    #c4e17f,
    #c4e17f 12.5%,
    #f7fdca 12.5%,
    #f7fdca 25%,
    #fecf71 25%,
    #fecf71 37.5%,
    #f0776c 37.5%,
    #f0776c 50%,
    #db9dbe 50%,
    #db9dbe 62.5%,
    #c49cde 62.5%,
    #c49cde 75%,
    #62c2e4 75%,
    #62c2e4 87.5%,
    #409eff 87.5%,
    #409eff
  );
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
  cursor: pointer;
}
</style>

