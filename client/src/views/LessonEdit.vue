<template>
  <div id="lesson-edit">
    <quill-editor ref="quillEditor" :options="editorConfig" v-model="editContent"></quill-editor>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'lessonEdit',
  components:{quillEditor},
  data() {
    return {
      lessonId: this.$route.query.lesson,
      lessonInfo: {},
      editContent: '',
      editorConfig: {
        theme: 'snow',
        placeholder: '正文...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', { 'color': [] }, { 'background': [] }, { 'align': [] }],
            [
              {'size': [ 'small', false, 'large', 'huge' ]},
              {'header': [1, 2, 3, 4, false] },
              { 'list': 'ordered'}, 
              { 'list': 'bullet' },
              'blockquote'
            ],
            ['link', 'image','code-block'],
          ]
        }
      },
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
#lesson-edit {
  height: 500px;
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
</style>
