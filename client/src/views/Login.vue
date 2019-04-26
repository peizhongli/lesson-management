<template>
  <div class="login">
    <h2 class="login-title">登录账户</h2>
    <el-form :model="login" status-icon :rules="rules" ref="loginForm" label-width="60px" class="login-form">
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="login.email" autocomplete="off" placeholder="请输入邮箱" clearable spellcheck="false"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="login.password" autocomplete="off" placeholder="请输入密码" clearable spellcheck="false"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('loginForm')">立即登录</el-button>
      <p class="regi-tip">还没有账号？立即<router-link to='/register'>注册</router-link></p>
    </el-form>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode';

export default {
  name: 'login',
  components: {},
  data() {
    return {
      login: {
        email: '',
        password: '',
      },
      rules: {
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/users/login', this.login)
              .then(res=>{
                this.$message({message: '登录成功', type: 'success'});
                // 存储token到localStorage，解析token
                const {token, name} = res.data;
                localStorage.setItem('userToken', token);
                localStorage.setItem('userName', name);
                const decoded = jwtDecode(token);
                // 存储token到vuex中
                this.$store.dispatch('setAuthenticated', !this.$isEmpty(decoded));
                this.$store.dispatch('setUser', decoded);

                // 登录成功，跳转至首页
                this.$router.push('/index');
              })
              .catch(err=>{
                console.log(err)
                this.$message({message: `登陆失败:${err}`, type: 'success'})
              })
        }
      });
    }
  }
}
</script>
<style scoped>
  .login {
    width: 100%;
    height: 100%;
  }
  .login .login-title {
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 32px;
    color: #409EFF;
  }
  .login-form {
    width: 40%;
    padding: 20px 30px 20px 30px;
    margin: 0 auto;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    box-shadow: 0 0 10px #DCDFE6;
  }
  .login-form .el-button {
    display: block;
    width: 200px;
    margin: 0 auto;
  }
  .login-form .regi-tip {
    margin-top: 20px;
    text-align: right;
    font-size: 14px;
  }
  .login-form .regi-tip a {
    margin-left: 2px;
    color: #409EFF;
  }
</style>


