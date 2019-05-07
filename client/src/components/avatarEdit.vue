<template>
  <div id="avatar">
    <img :src="setting.imgSrc" alt="" :width="setting.width"  @click="uploadAvatar" v-show="imgShow">
    <canvas ref="canvas" :width="setting.width" :height="setting.height" @click="uploadAvatar">抱歉，您的浏览器不支持canvas元素，请尝试更换浏览器或升级</canvas>
    <input type="file" ref="avatarInput" @change="addImg" accept="image/gif, image/jpeg, image/png">
    <!-- <el-button class="el-icon-zoom-in" circle @click="zoomIn"></el-button>
    <el-button class="el-icon-zoom-out" circle @click="zoomOut"></el-button> -->
  </div>
</template>
<script>
export default {
  name: 'avatarEdit',
  props: {
    setting: Object,
  },
  data() {
    return {
      canvas: null,
      imgShow: true
    }
  },
  created() {

  },
  mounted() {
    this.canvas = this.$refs.canvas
  },
  methods: {
    uploadAvatar() {
      this.$refs.avatarInput.dispatchEvent(new MouseEvent('click'))
    },
    addImg: function(img) {
      let _this = this
      let file = event.target.files[0]
      if(file) {
        if(file.type.split('/')[0]!=='image') {
          this.$message('抱歉，您的图片格式不对，请重新选择图片')
          return false
        }
        if(file.size/1024/1024>this.setting.maxSize) {
          this.$message('抱歉，图片不能大于2M，请重新选择图片')
          return false
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ()=> {
          const width = this.setting.width // 裁剪后的宽度
          const height = this.setting.height // 裁剪后的高度
          let cutX = 0 // 原图裁剪的x坐标
          let cutY = 0 // 原图裁剪的y坐标
          let cutWidth = null // 原图裁剪下的宽度
          let cutHeight = null // 原图裁剪下的高度
          let scale = this.setting.width/this.setting.height //裁剪比例
          let ctx = _this.canvas.getContext('2d')
          ctx.clearRect(0,0,width,height); // 清空画布
          let imgObj = new Image()
          imgObj.crossOrigin = 'anonymous'
          imgObj.src = reader.result
          imgObj.onload = ()=>{
            // 横图裁剪宽度 竖图裁剪高度
            if(imgObj.width/imgObj.height>scale) {
              cutX = (imgObj.width-imgObj.height*scale)/2
              cutWidth = imgObj.height*scale
              cutHeight = imgObj.height
            } else {
              cutY = (imgObj.height-imgObj.width/scale)/2
              cutWidth = imgObj.width
              cutHeight = imgObj.width/scale
            }
            console.log(cutX,cutY,cutWidth,cutHeight,width,height)
            ctx.drawImage(imgObj,cutX,cutY,cutWidth,cutHeight,0,0,width,height)
            let src = _this.canvas.toDataURL() // 生成图片文件的base64编码
            this.$emit('uploadFile',src)
            // console.log(src)
          }
        }
      }
      this.imgShow = false
    },
    zoomIn: function() {

    },
    zoomOut: function() {

    }
  },
}
</script>
<style scoped>
  #avatar {
    position: relative;
  }
  #avatar img {
    position: absolute;
    top: 0;
    left: 0;
  }
  #avatar canvas, #avatar img {
    border: 1px solid #e1e1e1;
    cursor: pointer;
  }
  #avatar canvas:hover, #avatar img:hover {
    border-color: #409eff;
  }
  #avatar input {
    display: none;
  }
</style>
