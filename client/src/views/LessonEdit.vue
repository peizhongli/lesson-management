<template>
  <div id="lesson-edit">
    <el-button type="primary" class="save-btn" @click="saveArticle">保存</el-button>
    <p class="title">
      <span>标题：</span>
      <el-input v-model="lessonTitle" placeholder="请输入标题"></el-input>
    </p>
    <p class="text">
      <span>正文：</span>
      <quill-editor ref="quillEditor" :options="editorConfig" v-model="editContent"></quill-editor>
    </p>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
export default {
  name: "lessonEdit",
  components: { quillEditor },
  data() {
    return {
      lessonId: this.$route.query.lesson,
      lessonIndex: this.$route.query.index || 0,
      lessonTitle: "",
      editContent: "",
      editorConfig: {
        theme: "snow",
        placeholder: "正文...",
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "underline",
              { color: [] },
              { background: [] },
              { align: [] }
            ],
            [
              { size: ["small", false, "large", "huge"] },
              { header: [1, 2, 3, 4, false] },
              { list: "ordered" },
              { list: "bullet" },
              "blockquote"
            ],
            ["link", "image", "code-block"]
          ]
        }
      }
    };
  },
  created() {
    console.log(this.$route.query);
    this.getLessonContent();
  },
  methods: {
    getLessonContent: function() {
      this.$axios
        .get(`/api/profiles/edit/${this.lessonId}/${this.lessonIndex}`)
        .then(res => {
          this.editContent = res.data.content;
          this.lessonTitle = res.data.title
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveArticle: function() {
      this.$axios
        .post(`/api/profiles/save/${this.lessonId}`, {
          data: this.editContent,
          title: this.lessonTitle,
          index: this.lessonIndex
        })
        .then(res => {
          this.$message({ message: "保存成功", type: "success" });
          this.$router.push({path: 'lessonEditList', query: { lesson: this.lessonId }})
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
#lesson-edit {
  height: 500px;
}
#lesson-edit .title,
#lesson-edit .text {
  display: flex;
}
#lesson-edit .el-input,
#lesson-edit .quill-editor {
  flex: 1;
}
#lesson-edit .text {
  margin-top: 10px;
}
#lesson-edit span {
  line-height: 40px;
}
#lesson-edit img.lesson-cover {
  width: 200px;
  float: left;
}
#lesson-edit .info-content {
  margin-left: 210px;
}
#lesson-edit .info p.mes {
  color: #999;
  font-size: 14px;
}
#lesson-edit .info p.mes span {
  margin-right: 10px;
}
#lesson-edit .quill-editor {
  height: 450px;
}
#lesson-edit .save-btn {
  margin-bottom: 10px;
}
</style>
