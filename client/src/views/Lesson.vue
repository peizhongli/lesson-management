<template>
  <div>
    <div v-if="LessonList.length > 0" class="table-container">
      <el-button type="primary" @click="handlerAdd" round class="add-btn">添加</el-button>
      <el-table :data="LessonList" style="width: 100%" border>
        <el-table-column label="上传日期" align="center" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程标题" prop="title" align="center"></el-table-column>
        <el-table-column label="课程分类" prop="type" align="center"></el-table-column>
        <el-table-column label="课程描述" prop="describe" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="cover"
          label="封面"
          width="120">
          <template slot-scope="scope">
            <img :src="scope.row.cover" width="100px">
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button size="mini" @click="toEdit(scope.row)">前往</el-button>
            <el-button size="mini" type="primary" @click="editLesson(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="offlineLesson(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :layout="pagination.layout"
        :total="pagination.total"
      ></el-pagination>
    </div>
    <div class="add-tip-box" v-else>
      <p>还没有添加课程哦~</p>
      <el-button type="primary" @click="handlerAdd" round>立即添加</el-button>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" ref="lessonForm" :rules="formRules">
        <el-form-item label="课程标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="dialogForm.title" autocomplete="off" clearable spellcheck="false"></el-input>
        </el-form-item>
        <el-form-item label="课程描述" prop="describe" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.describe" autocomplete="off" clearable spellcheck="false"></el-input>
        </el-form-item>
        <el-form-item label="课程分类" :label-width="formLabelWidth" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择课程分类">
            <el-option
              v-for="item in typeList"
              :label="item.name"
              :value="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程封面" prop="cover" :label-width="formLabelWidth">
          <avatar-edit :setting="setting" @uploadFile="uploadFile($event)" ref="avatar"></avatar-edit>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitLessonForm('lessonForm', lessonId)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import typeList from "../static/lessonTypeList.js"
import avatarEdit from '../components/avatarEdit'
export default {
  name: "lesson",
  components: {avatarEdit},
  data() {
    return {
      dialogTitle: "",
      LessonList: [],
      dialogFormVisible: false,
      dialogForm: {
        title: "",
        type: "",
        describe: "",
        cover: ""
      },
      formLabelWidth: "120px",
      typeList,
      formRules: {
        title: [
          {
            required: true,
            message: "请输入课程标题",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择课程分类",
            trigger: "change"
          }
        ]
      },
      lessonId: "",
      pagination: {
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 15, 30],
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper"
      },
      setting: {
        width: 160,
        height: 160,
        maxSize: 2,
        imgSrc: null
      },
      newCover: null
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    // 获取课程信息
    getProfile() {
      this.$axios
        .get("/api/profiles",{
          params: {
            author: window.localStorage.getItem('userName'),
            currentPage: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          }
        })
        .then(res => {
          this.LessonList = res.data.data;
          this.pagination.total = res.data.sum;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 分页
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = val;
      let page = {
        pageSize: this.pagination.pageSize,
        currentPage: this.pagination.currentPage
      }
      this.getProfile()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      let page = {
        pageSize: this.pagination.pageSize,
        currentPage: this.pagination.currentPage
      }
      this.getProfile()
    },

    // 添加课程信息
    handlerAdd() {
      this.dialogTitle = "添加课程信息";
      this.dialogForm = {}
      console.log(this.$refs.lessonForm)
      if(this.$refs.lessonForm) {
        this.$refs.lessonForm.resetFields();
      }
      this.lessonId = null
      this.setting.imgSrc = null
      this.dialogFormVisible = true;
    },

    // 编辑课程信息
    editLesson(item) {
      console.log(item)
      this.dialogTitle = "修改课程信息";
      this.dialogForm = item;
      this.setting.imgSrc = item.cover
      this.dialogFormVisible = true;
      this.lessonId = item.id;
    },

    toEdit(item) {
      this.$router.push({path: 'lessonInfo', query: { lesson: item.id }})
    },

    // 删除课程信息
    offlineLesson(item) {
      this.$confirm(
        `即将下线"${item.title}", 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$axios
            .delete(`/api/profiles/delete/${item.id}`)
            .then(res => {
              this.$message({ message: "课程已下线", type: "info" });
              this.getProfile();
            })
            .catch(err => {
              this.$message({ message: "课程下线失败", type: "warning" });
            });
        })
        .catch(() => {});
    },

    // 提交课程信息表单
    submitLessonForm(formName, lessonId) {
      console.log(lessonId);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {}
          data.title = this.dialogForm.title
          data.type = this.dialogForm.type
          data.describe = this.dialogForm.describe
          if (!this.lessonId) {
            if(this.newCover) {
              let cover = this.newCover.replace(/^data:image\/\w+;base64,/, "")
              data.cover = cover
            } else {
              data.cover = ''
            }
            this.$axios
              .post("/api/profiles/add", data)
              .then(res => {
                console.log(res)
                this.dialogFormVisible = false;
                this.pagination.currentPage = 1;
                this.getProfile();
                this.lessonId = ''
                this.$message({ message: "课程创建成功", type: "success" });
                this.$confirm('前往添加第一节课程?拥有至少一节课程才可以被同学们看到哦', '提示', {
                  confirmButtonText: '立即前往',
                  cancelButtonText: '稍后添加',
                  type: 'success'
                }).then(() => {
                  this.$router.push({path: 'lessonEdit', query: { lesson: res.data.id }})
                }).catch(() => {
                  returns
                });
              })
              .catch(err => {
                this.$message({
                  message: `课程创建失败:${err}`,
                  type: "warning"
                });
              });
          } else {
            if(this.newCover) {
              let cover = this.newCover.replace(/^data:image\/\w+;base64,/, "")
              data.cover = cover
            } else {
              data.cover = this.setting.imgSrc
            }
            this.$axios
              .put(`/api/profiles/edit/${this.lessonId}`, data)
              .then(res => {
                this.$message({ message: "课程信息已更新", type: "success" });
                this.dialogFormVisible = false;
                this.getProfile();
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  message: `课程信息更新失败:${err}`,
                  type: "warning"
                });
              });
          }
        }
      });
    },
    uploadFile: function(src) {
      this.newCover = src
    },
  }
};
</script>
<style scoped>
.add-btn {
  margin-bottom: 20px;
}
.dialog-footer {
  min-width: 200px;
}
.add-tip-box {
  padding: 100px 0;
  text-align: center;
}
.add-tip-box p {
  color: #999;
  font-size: 20px;
  margin-bottom: 24px;
}
.el-pagination {
  text-align: center;
  margin: 30px auto 0;
}
.cover-wrap {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-wrap input {
  opacity: 0;
}
.cover-wrap .cover {
  width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}
.cover-wrap:hover {
  border-color: #409eff;
}
</style>
<style>
  .el-dialog {
    margin-top: 0!important;
    top: 50%;
    transform: translateY(-50%);
  }
</style>