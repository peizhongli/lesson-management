<template>
  <div class="login">
    <el-card class="box-card">
      <h2 class="login-title">登 录</h2>
      <el-form
        :model="login"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="60px"
        class="login-form"
      >
        <el-form-item prop="email">
          <el-input
            type="email"
            v-model="login.email"
            autocomplete="off"
            placeholder="请输入邮箱"
            prefix-icon="el-icon-user"
            clearable
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="login.password"
            autocomplete="off"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            clearable
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" round>立即登录</el-button>
        <p class="regi-tip">
          <span>还没有账号？立即</span>
          <router-link to="/register">注册</router-link>
        </p>
      </el-form>
    </el-card>
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
import jwtDecode from "jwt-decode";

export default {
  name: "login",
  components: {},
  data() {
    return {
      login: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.$nextTick(() => {
      var canvas = this.$refs.canvas;
      var ctx = canvas.getContext("2d");

      var rgb = "255"; // 线条颜色值
      var extendDis = 5; // 可超出的画布边界
      var lineDis = 100; // 连线距离

      lineDis *= lineDis;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      var RAF = (function() {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          }
        );
      })();

      // 鼠标活动时，获取鼠标坐标
      var warea = { x: null, y: null };

      window.onmousemove = function(e) {
        e = e || window.event;

        warea.x = e.clientX - canvas.offsetLeft;
        warea.y = e.clientY - canvas.offsetTop;
      };

      window.onmouseout = function(e) {
        warea.x = null;
        warea.y = null;
      };

      // 添加粒子
      // x，y为粒子坐标，xa, ya为粒子xy轴加速度，max为连线的最大距离
      var dots = [];
      for (var i = 0; i < 150; i++) {
        var x = Math.random() * (canvas.width + 2 * extendDis) - extendDis;
        var y = Math.random() * (canvas.height + 2 * extendDis) - extendDis;
        var xa = (Math.random() * 2 - 1) / 1.5;
        var ya = (Math.random() * 2 - 1) / 1.5;

        dots.push({
          x: x,
          y: y,
          xa: xa,
          ya: ya
        });
      }

      // 延迟100秒开始执行动画，如果立即执行有时位置计算会出错
      setTimeout(function() {
        animate();
      }, 100);

      // 每一帧循环的逻辑
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bubDrawLine([warea].concat(dots));

        RAF(animate);
      }

      /**
       * 逐个对比连线
       * @param ndots
       */
      function bubDrawLine(ndots) {
        var ndot;

        dots.forEach(function(dot) {
          move(dot);

          // 循环比对粒子间的距离
          for (var i = 0; i < ndots.length; i++) {
            ndot = ndots[i];

            if (dot === ndot || ndot.x === null || ndot.y === null) continue;

            var xc = dot.x - ndot.x;
            var yc = dot.y - ndot.y;

            // 如果x轴距离或y轴距离大于max,则不计算粒子距离
            if (xc > ndot.max || yc > lineDis) continue;

            // 两个粒子之间的距离
            var dis = xc * xc + yc * yc;

            // 如果粒子距离超过max,则不做处理
            if (dis > lineDis) continue;

            // 距离比
            var ratio;

            // 如果是鼠标，则让粒子向鼠标的位置移动
            if (ndot === warea && dis < 20000) {
              dot.x -= xc * 0.01;
              dot.y -= yc * 0.01;
            }

            // 计算距离比
            ratio = (lineDis - dis) / lineDis;

            // 粒子间连线
            ctx.beginPath();
            ctx.lineWidth = ratio / 2;
            ctx.strokeStyle = "rgba(" + rgb + ", " + rgb + ", " + rgb + ", 1";
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(ndot.x, ndot.y);
            ctx.stroke();
          }

          // 将已经计算过的粒子从数组中删除
          ndots.splice(ndots.indexOf(dot), 1);
        });
      }

      /**
       * 粒子移动
       * @param dot
       */
      function move(dot) {
        dot.x += dot.xa;
        dot.y += dot.ya;

        // 遇到边界将加速度反向
        dot.xa *=
          dot.x > canvas.width + extendDis || dot.x < -extendDis ? -1 : 1;
        dot.ya *=
          dot.y > canvas.height + extendDis || dot.y < -extendDis ? -1 : 1;

        // 绘制点
        ctx.fillStyle = "rgba(" + rgb + ", " + rgb + ", " + rgb + ", 1";
        ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/users/login", this.login)
            .then(res => {
              this.$message({ message: "登录成功", type: "success" });
              // 存储token到localStorage，解析token
              const { token, name } = res.data;
              localStorage.setItem("userToken", token);
              localStorage.setItem("userName", name);
              const decoded = jwtDecode(token);
              // 存储token到vuex中
              this.$store.dispatch("setAuthenticated", !this.$isEmpty(decoded));
              this.$store.dispatch("setUser", decoded);
              this.$axios
                .get("/api/profiles/subscription")
                .then(res => {
                  this.$socket.emit("login", {
                    username: name,
                    list: res.data.list
                  });
                })
                .catch(err => {
                  console.log(err);
                });
              // 登录成功，跳转至首页
              this.$router.push("/index");
            })
            .catch(err => {
              console.log(err);
              this.$message({ message: `登陆失败:${err}`, type: "success" });
            });
        }
      });
    }
  }
};
</script>
<style scoped>
.login {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
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
    #669ae1 75%,
    #669ae1 87.5%,
    #62c2e4 87.5%,
    #62c2e4
  );
}
.login .el-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  margin: 0 auto;
  border: 0;
  overflow: hidden;
  z-index: 5;
}
.login .login-title {
  padding: 28px 0 20px;
  margin-bottom: 22px;
  text-align: center;
  font-size: 30px;
  color: #aaa;
  background-color: #f7f7f7;
}
.login .el-card::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  display: block;
  width: 100%;
  height: 8px;
  background: linear-gradient(
    to right,
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
    #669ae1 75%,
    #669ae1 87.5%,
    #62c2e4 87.5%,
    #62c2e4
  );
}
.login-form .el-input,
.login-form .el-button {
  width: 300px;
  display: block;
  margin: 0 auto;
}
.login-form .regi-tip {
  padding: 22px 100px 22px 0;
  text-align: right;
  font-size: 14px;
  color: #999;
}
.login-form .regi-tip a {
  color: #409eff;
}
.login canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
<style>
.login .el-card__body {
  padding: 0;
}
.login .el-form-item__content {
  width: 300px;
  margin: 0 auto !important;
}
</style>


