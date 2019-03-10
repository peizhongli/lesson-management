<template>
  <div class="register">
    <h2 class="regi-title">注册账户</h2>
    <el-form :model="regi" status-icon :rules="rules" ref="regiForm" label-width="80px" class="regi-form">
      <el-form-item label="用户名" prop="name">
        <el-input type="text" v-model="regi.name" autocomplete="off" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="regi.email" autocomplete="off" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="regi.password" autocomplete="off" placeholder="请输入密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="regi.checkPass" autocomplete="off" placeholder="请确认密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="身份" prop="identity">
        <el-select v-model="regi.identity" placeholder="请选择身份">
          <el-option label="老师" value="teacher"></el-option>
          <el-option label="学生" value="student"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="submitForm('regiForm')">立即注册</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'register',
  components: {},
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.regi.checkPass !== '') {
          this.$refs.regiForm.validateField('checkPass');
        }
        callback();
      }
    };
    let confirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'));
      } else if (value !== this.regi.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      regi: {
        name: '',
        email: '',
        password: '',
        checkPass: '',
        identity: ''
      },
      rules: {
        name: [
          { 
            required: true, 
            message: '请输入用户名', 
            trigger: 'blur' 
          },
          { 
            min: 2,
            max: 10, 
            message: '长度在 1 到 10 个字符', 
            trigger: 'blur' 
          }
        ],
        email: [
          { 
            required: true, 
            message: '请输入邮箱地址', 
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
            validator: validatePass, 
            trigger: 'blur' 
          },
          { 
            min: 6, 
            max: 20, 
            message: '长度在 6 到 20 个字符', 
            trigger: 'blur' 
          }
        ],
        checkPass: [
          { 
            required: true, 
            validator: confirmPass, 
            trigger: 'blur' 
          }
        ],
        identity: [
          { 
            required: true, 
            message: '请选择身份', 
            trigger: 'change' 
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/users/register', this.regi)
              .then(res=>{
                this.$message({message: '账号注册成功,即将跳转到登录页', type: 'success'});
                this.$router.push('/login');
              })
              .catch(err=>{
                console.log(err)
                this.$message({message: `注册失败:${err}`, type: 'warning'})
              })
        }
      });
    }
  }
}
</script>
<style scoped>
  .register {
    width: 100%;
    height: 100%;
  }
  .register .regi-title {
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 32px;
    color: #409EFF;
  }
  .regi-form {
    width: 40%;
    padding: 20px 30px 20px 30px;
    margin: 0 auto;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    box-shadow: 0 0 10px #DCDFE6;
  }
  .regi-form .el-button {
    display: block;
    width: 200px;
    margin: 0 auto;
  }
</style>


