<template>
  <div id="lesson-info">
    <el-card>
      <section slot="header">
        <p class="title">{{lessonInfo.title}}</p>
      </section>
      <section class="info clearfix">
        <img :src="lessonInfo.cover" alt="" class="lesson-cover">
        <div class="lesson-content">
          <p class="mes">
            <span class="iconfont icon-people author"> {{lessonInfo.author}}</span>
            <time class="time el-icon-time">上传于{{lessonInfo.date}}</time>
          </p>
          <p class="describe">{{lessonInfo.describe}}</p>
        </div>
      </section>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'lessonInfo',
  data() {
    return {
      lessonId: this.$route.query.lesson,
      lessonInfo: {}
    }
  },
  created() {
    this.getLessonInfo()
  },
  methods: {
    getLessonInfo: function() {
      this.$axios.get(`/api/profiles/${this.lessonId}`)
      .then(res=>{
        this.lessonInfo = res.data
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },
}
</script>
<style scoped>
#lesson-info .info {
}
#lesson-info img.lesson-cover {
  width: 200px;
  float: left;
}
#lesson-info .lesson-content {
  margin-left: 210px;
}
#lesson-info .info p.mes {
  color: #999;
  font-size: 14px;
}
#lesson-info .info p.mes span {
  margin-right: 10px;
}
</style>
