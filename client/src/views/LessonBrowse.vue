<template>
  <div id="lesson-info">
    <el-card>
      <section slot="header">
        <p class="title">
          {{lessonInfo.title}}
          <el-button type="primary" :class="lessonInfo.subscribed?'subscribed':''" @click="subscribeLesson">{{lessonInfo.subscribed?'已订阅':'+订阅'}}</el-button>
        </p>
        <p class="mes">
          <span class="iconfont icon-people author"> {{lessonInfo.author}}</span>
          <time class="time el-icon-time">上传于{{lessonInfo.date}}</time>
          <span>分类：{{lessonInfo.type}}</span>
          <span v-if="lessonInfo.collections">收藏数：{{lessonInfo.collections.length}}</span>
          <span v-if="lessonInfo.views">{{lessonInfo.views}}人看过</span>
        </p>
      </section>
      <section class="info">
        <div class="lesson-content ql-editor">
          <p>{{lessonTitle}}</p>
          <div class="lesson-main" v-html="lessonContent"></div>
        </div>
      </section>
      <section class="comment">
        <p class="comment-title">评论区</p>
        <el-input
          type="textarea"
          autosize
          placeholder="说点什么吧..."
          v-model="commentContent"
          maxlength="500" show-word-limit spellcheck="false">
        </el-input>
        <el-button type="primary" size="mini" class="comment-btn" @click="postComment">评论</el-button>
        <ul class="comment-list">
          <li v-for="(item, index) in lessonInfo.discussion" :key="index">
          <p class="iconfont icon-people comment-content">{{item.name}}:<span>{{item.content}}</span><p>
          <p class="el-icon-time">{{item.time}}</p>
          </li>
        </ul>
      </section>
    </el-card>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
export default {
  name: 'lessonInfo',
  data() {
    return {
      lessonId: this.$route.query.lesson,
      lessonIndex: this.$route.query.index,
      lessonInfo: {},
      lessonContent: '',
      commentContent: '',
      lessonTitle: ''
    }
  },
  created() {
    this.getLessonInfo()
    this.getLessonContent()
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
    },
    getLessonContent: function() {
      this.$axios
        .get(`/api/profiles/edit/${this.lessonId}/${this.lessonIndex}`)
        .then(res => {
          this.lessonContent = res.data.content;
          this.lessonTitle = res.data.title
        })
        .catch(err => {
          console.log(err);
        });
    },
    postComment: function() {
      let data = {content: this.commentContent}
      this.$axios.post(`/api/profiles/comment/${this.lessonId}`,data)
      .then(res=>{
        this.$message({
          message: '评论成功',
          type: 'success'
        })
        this.commentContent = ''
        this.getLessonInfo()
      })
      .catch(err=>{
        console.log(err)
      })
    },
    subscribeLesson: function() {
      let status = this.lessonInfo.subscribed?0:1
      this.$axios.post(`/api/profiles/subscribe/${this.lessonId}`,{status})
      .then(res=>{
        this.lessonInfo.subscribed = !this.lessonInfo.subscribed
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
  padding: 20px;
}
#lesson-info p.title {
  position: relative;
  padding-right: 100px;
  font-size: 22px;
  font-weight: bold;
  color: #666;
}
#lesson-info p.title button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
#lesson-info p.title button.subscribed {
  background-color: #e1e1e1;
  color: #999;
  border-color: #e1e1e1;
}
#lesson-info p.mes {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}
#lesson-info p.mes span, #lesson-info p.mes time {
  margin-right: 15px;
}
#lesson-info .comment {
  margin-top: 10px;
  padding: 20px;
  border-top: 1px solid #e1e1e1;
}
#lesson-info .comment-title {
  font-size: 20px;
  margin-bottom: 20px;
}
#lesson-info .comment-btn {
  margin-top: 15px;
}
#lesson-info ul.comment-list {
  margin-top: 30px;
  color: #666;
}
#lesson-info ul.comment-list li {
  padding: 20px 0;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
}
#lesson-info ul.comment-list li:last-child {
  border: none;
}
#lesson-info p.comment-content {
  font-size: 18px;
}
#lesson-info ul.comment-list li span {
  color: #777;
  margin-left: 10px;
}
</style>
<style>
#lesson-info .el-card__body, #lesson-info .ql-editor {
  padding: 0;
}
#lesson-info textarea {
  resize: none;
  padding: 12px 15px;
}
</style>
