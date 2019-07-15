<template>
  <div id="user-info">
    <el-card>
      <section slot="header">
        <p class="title">{{userInfo.name}}</p>
        <el-button type="primary" @click="showDialog" class="edit-btn">编辑</el-button>
      </section>
      <section class="info clearfix">
        <img :src="userInfo.avatar" alt="" class="user-avatar">
        <div class="user-content">
          <p class="name">用户名：{{userInfo.name}}</p>
          <p class="email">邮箱：{{userInfo.email}}</p>
          <p class="identity">身份：{{userInfo.identity}}</p>
        </div>
      </section>
    </el-card>
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
      <el-form-item label="头像" prop="avatar">
        <avatar-edit :setting="setting" @uploadFile="uploadFile($event)" ref="avatar"></avatar-edit>
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
import avatarEdit from '../components/avatarEdit'
export default {
  name: 'userInfo',
  components: {avatarEdit},
  data() {
    return {
      dialogFormVisible: false,
      userInfo: {},
      newUser: {},
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
      },
      showImg: false,
      setting: {
        width: 160,
        height: 160,
        maxSize: 2,
        imgSrc: null
      },
      newAvatar: null
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
    uploadFile: function(src) {
      this.newAvatar = src
    },
    showDialog: function() {
      this.newAvatar = null
      this.newUser = JSON.parse(JSON.stringify(this.userInfo))
      this.dialogFormVisible = true
      this.setting.imgSrc = this.newUser.avatar
      this.$nextTick(()=>{
        this.$refs.avatar.imgShow = true
      })
    },
    getUserMes: function() {
      this.$axios.get('/api/users/current')
      .then(res=>{
        this.userInfo = res.data
        this.$store.getters.user.avatar =  this.userInfo.avatar
      })
      .catch(err=>{
        console.log(err)
      })
    },
    updateUserInfo: function() {
      this.$refs.userForm.validate(valid=>{
        if(valid) {
          let data = {}
          if(this.newAvatar) {
            let avatar = this.newAvatar.replace(/^data:image\/\w+;base64,/, "")
            data.avatar = avatar
          } else {
            data.avatar = this.newUser.avatar
          }
          data.name = this.newUser.name
          data.email = this.newUser.email
          console.log(data,this.userInfo)
          if(data.name===this.userInfo.name&&data.email===this.userInfo.email&&data.avatar===this.userInfo.avatar) {
            this.$message('您没有更新信息哦~')
          } else {
            this.$axios.put(`/api/users/update/${this.newUser.id}`, data)
              .then(res => {
                this.$message({ message: "个人信息已更新", type: "success" });
                this.dialogFormVisible = false;
                this.getUserMes();
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  message: `个人信息更新失败:${err.response.data}`,
                  type: "warning"
                });
              });
          }
        }
      })
    }
  },
}
</script>
<style>
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
#user-info .el-card .el-card__header, #user-info .el-card .el-card__body {
  position: relative;
}
#user-info .el-card .title {
  display: inline-block;
  margin-right: 10px;
}
#user-info .el-card img {
  float: left;
  width: 160px;
  height: 160px;
  border-radius: 50%;
}
#user-info .el-card .user-content {
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  margin-left: 200px;
  color: #999;
  line-height: 30px;
}
</style>