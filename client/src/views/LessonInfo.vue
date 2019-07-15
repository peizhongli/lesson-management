<template>
  <div id="lesson-info">
    <el-card>
      <section slot="header">
        <p class="title">{{lessonInfo.title}}</p>
        <p class="mes">
          <span class="iconfont icon-people author">{{lessonInfo.author}}</span>
          <time class="time el-icon-time">上传于{{lessonInfo.date}}</time>
          <span>分类：{{lessonInfo.type}}</span>
          <span v-if="lessonInfo.collections">收藏数：{{lessonInfo.collections.length}}</span>
          <span v-if="lessonInfo.views">{{lessonInfo.views}}人看过</span>
        </p>
        <el-button
          type="primary"
          :class="lessonInfo.subscribed?'subscribed':''"
          @click="subscribeLesson"
          class="subscribe-btn"
        >{{lessonInfo.subscribed?'已订阅':'+订阅'}}</el-button>
      </section>
      <section>
        <div v-if="lessonCount===0">
          <p class="addtip">还没有创建目录哦~</p>
        </div>
        <div v-else>
          <el-table :data="lessonInfo.articleList" class="lesson-table" border>
            <el-table-column prop="date" label="上传时间" width="180"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="toBrowse(scope)" type="text" size="small">浏览</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <section class="comment">
        <p class="comment-title">评论区</p>
        <el-input
          type="textarea"
          autosize
          placeholder="说点什么吧..."
          v-model="commentContent"
          maxlength="500"
          show-word-limit
          spellcheck="false"
        ></el-input>
        <el-button type="primary" size="mini" class="comment-btn" @click="postComment">评论</el-button>
        <ul class="comment-list">
          <li v-for="(item, index) in lessonInfo.discussion" :key="index">
            <p class="iconfont icon-people comment-content">
              {{item.name}}:
              <span>{{item.content}}</span>
            </p>
            <p></p>
            <p class="el-icon-time">{{item.time}}</p>
          </li>
        </ul>
      </section>
    </el-card>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
export default {
  name: "lessonInfo",
  data() {
    return {
      lessonId: this.$route.query.lesson,
      lessonInfo: {},
      lessonContent: "",
      commentContent: "",
      lessonCount: 0
    };
  },
  created() {
    this.getLessonInfo();
  },
  computed: {
    identity() {
      return this.$store.getters.user.identity;
    }
  },
  methods: {
    getLessonInfo: function() {
      this.$axios
        .get(`/api/profiles/${this.lessonId}`)
        .then(res => {
          this.lessonInfo = res.data;
          this.lessonCount = res.data.articleList.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    postComment: function() {
      let data = { content: this.commentContent };
      this.$axios
        .post(`/api/profiles/comment/${this.lessonId}`, data)
        .then(res => {
          this.$message({
            message: "评论成功",
            type: "success"
          });
          this.commentContent = "";
          this.getLessonInfo();
        })
        .catch(err => {
          console.log(err);
        });
    },
    subscribeLesson: function() {
      let status = this.lessonInfo.subscribed ? 0 : 1;
      this.$axios
        .post(`/api/profiles/subscribe/${this.lessonId}`, { status })
        .then(res => {
          this.lessonInfo.subscribed = !this.lessonInfo.subscribed;
          if (this.lessonInfo.subscribed) {
            this.$socket.emit("subscribe", {
              username: this.$store.getters.user.name,
              id: this.lessonId
            });
          } else {
            this.$socket.emit("unsubscribe", {
              username: this.$store.getters.user.name,
              id: this.lessonId
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toEdit: function(item, index) {
      console.log(item.$index);
      this.$router.push({
        path: "lessonEdit",
        query: { lesson: this.lessonId, index: item.$index }
      });
    },
    toBrowse: function(item, index) {
      console.log(item.$index);
      this.$router.push({
        path: "lessonBrowse",
        query: { lesson: this.lessonId, index: item.$index }
      });
    },
    toNewEdit: function() {
      this.$router.push({
        path: "lessonEdit",
        query: { lesson: this.lessonId, index: this.lessonCount }
      });
    }
  }
};
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
#lesson-info .el-card section {
  position: relative;
}
#lesson-info .el-card section .subscribe-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#lesson-info .subscribe-btn.subscribed {
  background-color: #e1e1e1;
  color: #999;
  border-color: #e1e1e1;
}
#lesson-info p.mes {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}
#lesson-info p.mes span,
#lesson-info p.mes time {
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
#lesson-info .lesson-table {
  margin: 20px auto;
  width: 80%;
}
#lesson-info .addtip {
  padding: 100px 0;
  text-align: center;
  color: #999;
}
#lesson-info .add-btn {
  margin: 20px 0 0 116px;
}
</style>
<style>
#lesson-info .el-card__body,
#lesson-info .ql-editor {
  padding: 0;
}
#lesson-info textarea {
  resize: none;
  padding: 12px 15px;
}
</style>
