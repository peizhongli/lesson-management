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
      </section>
      <section>
        <el-table :data="lessonInfo.articleList" class="lesson-table" border>
          <el-table-column prop="date" label="上传时间" width="120"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="toEdit(scope)" type="text" size="small">编辑</el-button>
              <el-button @click="toBrowse(scope)" type="text" size="small">浏览</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      lessonContent: ""
    };
  },
  created() {
    this.getLessonInfo();
  },
  methods: {
    getLessonInfo: function() {
      this.$axios
        .get(`/api/profiles/${this.lessonId}`)
        .then(res => {
          this.lessonInfo = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    toEdit: function(item,index) {
      console.log(item.$index)
      this.$router.push({path: 'lessonEdit', query: { lesson: this.lessonId, index: item.$index}})
    },
    toBrowse: function(item,index) {
      console.log(item.$index)
      this.$router.push({path: 'lessonBrowse', query: { lesson: this.lessonId, index: item.$index}})
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
#lesson-info p.mes {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}
#lesson-info p.mes span,
#lesson-info p.mes time {
  margin-right: 15px;
}
#lesson-info .lesson-table {
  margin: 20px auto;
  width: 80%;
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
