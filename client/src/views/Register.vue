<template>
  <div class="register">
    <el-card>
      <h2 class="regi-title">注册账户</h2>
      <el-form
        :model="regi"
        status-icon
        :rules="rules"
        ref="regiForm"
        label-width="80px"
        class="regi-form"
      >
        <el-form-item label="用户名" prop="name">
          <el-input
            type="text"
            v-model="regi.name"
            autocomplete="off"
            placeholder="请输入用户名"
            clearable
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="email"
            v-model="regi.email"
            autocomplete="off"
            placeholder="请输入邮箱"
            clearable
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="regi.password"
            autocomplete="off"
            placeholder="请输入密码"
            clearable
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="regi.checkPass"
            autocomplete="off"
            placeholder="请确认密码"
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="identity">
          <el-select v-model="regi.identity" placeholder="请选择身份">
            <el-option label="老师" value="老师"></el-option>
            <el-option label="学生" value="学生"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="submitForm('regiForm')">立即注册</el-button>
        <p class="login-tip">
        <span>已有账号？立即</span>
        <router-link to="/login">登录</router-link>
      </p>
      </el-form>
    </el-card>
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
export default {
  name: "register",
  components: {},
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.regi.checkPass !== "") {
          this.$refs.regiForm.validateField("checkPass");
        }
        callback();
      }
    };
    let confirmPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.regi.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      regi: {
        name: "",
        email: "",
        password: "",
        checkPass: "",
        identity: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱地址",
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
            validator: validatePass,
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            required: true,
            validator: confirmPass,
            trigger: "blur"
          }
        ],
        identity: [
          {
            required: true,
            message: "请选择身份",
            trigger: "change"
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
            .post("/api/users/register", this.regi)
            .then(res => {
              this.$message({
                message: "账号注册成功,即将跳转到登录页",
                type: "success"
              });
              this.$router.push("/login");
            })
            .catch(err => {
              console.log(err.response);
              this.$message({
                message: `注册失败:${err.response.data}`,
                type: "warning"
              });
            });
        }
      });
    }
  }
};
</script>
<style scoped>
.register {
  width: 100vw;
  height: 100vh;
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
  overflow: hidden;
}
.register .regi-title {
  padding: 30px 0 22px;
  text-align: center;
  font-size: 32px;
  color: #aaa;
  background-color: #f7f7f7;
}
.register .el-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  border: 0;
  z-index: 5;
}
.register .el-card::before {
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
.regi-form {
  padding: 22px;
}
.regi-form .el-select {
  width: 100%;
}
.regi-form .el-button {
  display: block;
  width: 200px;
  margin: 0 auto;
}
.register .login-tip {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.register .login-tip a {
  color: #409eff;
}
.register canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
<style>
.register .el-card__body {
  padding: 0;
}
</style>


