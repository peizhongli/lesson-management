<template>new
  <div id="user-info">
    <el-card>
      <section slot="header">
        <p class="title">{{newUser.name}}</p>
      </section>
      <section class="info clearfix">
        <img :src="newUser.avatar" alt="" class="user-avatar">
        <div class="user-content">
          <!-- <p class="mes">
            <span class="iconfont icon-people author"> {{newUser.author}}</span>
            <time class="time el-icon-time">上传于{{newUser.date}}</time>
          </p> -->
          <p class="email">{{newUser.email}}</p>
          <p class="identity">{{newUser.identity}}</p>
        </div>
      </section>
    </el-card>
    <el-button type="primary" @click="showDialog">编辑</el-button>
    <el-dialog title="更新个人信息" :visible.sync="dialogFormVisible">
      <el-form :model="newUser" status-icon :rules="rules" ref="userForm" label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input type="text" v-model="newUser.name" autocomplete="off" placeholder="请输入用户名" clearable spellcheck="false"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="newUser.email" autocomplete="off" placeholder="请输入邮箱" clearable spellcheck="false"></el-input>
      </el-form-item>
      <!-- <el-form-item label="旧密码" prop="password">
        <el-input type="password" v-model="regi.password" autocomplete="off" placeholder="请输入旧密码" clearable spellcheck="false"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="regi.password" autocomplete="off" placeholder="请输入新密码" clearable spellcheck="false"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="regi.checkPass" autocomplete="off" placeholder="请确认新密码" clearable spellcheck="false"></el-input>
      </el-form-item> -->
      <el-form-item label="身份" prop="identity">{{newUser.identity}}</el-form-item>
      <el-form-item label="课程封面" prop="avatar">
          <div class="avatar-wrap" @click="uploadAvatar">
            <img :src="newUser.avatar" alt="" class="avatar">
            <input ref="avatarInput" type="file" class="file-upload" @change="addImg">
          </div>
        </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'userInfo',
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
      dialogFormVisible: false,
      newUser: '',
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
      },
      showImg: false,
    }
  },
  created() {
    this.getUserMes()
  },
  computed: {
    user (){
      return this.$store.getters.user;
    }
  },
  methods: {
    showDialog: function() {
      this.dialogFormVisible = true
    },
    uploadAvatar() {
      this.$refs.avatarInput.dispatchEvent(new MouseEvent('click'))
    },
    addImg() {
      console.log('===========添加图片')
      let reader = new FileReader();
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = ()=>{
        this.newUser.avatar = reader.result
        this.showImg = true
        console.log(this.newUser.avatar)
      }
    },
    getUserMes: function() {
      this.$axios.get('/api/users/current')
      .then(res=>{
        console.log(res.data)
        this.newUser = res.data
      })
      .catch(err=>{
        console.log(err)
      })
    },
    updateUserInfo: function() {
      this.$refs.userForm.validate(valid=>{
        if(valid) {
          let formData = new FormData()
          let avatar = this.newUser.avatar
          if(this.$refs.avatarInput.files.length > 0) {
            avatar = this.$refs.avatarInput.files[0]
          }
          formData.append('avatar', avatar)
          formData.append('name', this.newUser.name)
          formData.append('email', this.newUser.email)
          this.$axios
            .put(`/api/users/update/${this.newUser.id}`, formData)
            .then(res => {
              this.$message({ message: "个人信息已更新", type: "success" });
              this.dialogFormVisible = false;
              this.getUserMes();
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: `个人信息更新失败:${err}`,
                type: "warning"
              });
            });
        }
      })
    }
  },
}
</script>
<style scoped>
#user-info .info {
}
#user-info img.user-cover {
  width: 200px;
  float: left;
}
#user-info .user-content {
  margin-left: 210px;
}
#user-info .info p.mes {
  color: #999;
  font-size: 14px;
}
#user-info .info p.mes span {
  margin-right: 10px;
}
#user-info .avatar-avatar {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#user-info .avatar-wrap input {
  opacity: 0;
}
#user-info .avatar-wrap .avatar {
  width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}
#user-info .avatar-wrap:hover {
  border-color: #409eff;
}
</style>