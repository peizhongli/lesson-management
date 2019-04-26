<template>
  <div>
    <div v-if="tableData.length > 0" class="table-container">
      <el-button type="primary" @click="handlerAdd" round class="add-btn">添加</el-button>
      <el-table :data="tableData" style="width: 100%" border max-height="320">
        <el-table-column label="上传日期" align="center" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程标题" prop="title" align="center"></el-table-column>
        <el-table-column label="课程类型" prop="type" align="center"></el-table-column>
        <el-table-column label="课程描述" prop="describe" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="cover"
          label="封面"
          width="180">
          <template slot-scope="scope">
            <img :src="scope.row.cover" style="width: 50px;height:50px;">
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editLesson(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="offlineLesson(scope.$index, scope.row)">删除</el-button>
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
        <el-form-item label="课程类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择课程类型">
            <el-option
              v-for="item in typeList"
              :label="item.name"
              :value="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程封面" prop="cover" :label-width="formLabelWidth">
          <div class="cover-wrap" @click="uploadCover">
            <img :src="dialogForm.cover" alt="" class="cover">
            <input ref="coverInput" type="file" class="file-upload" @change="addImg">
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitLessonForm('lessonForm', lessonId)">确 定</el-button>
        <el-button type="primary" @click="toEdit(lessonId)">编辑课程详情</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import typeList from "../static/lessonTypeList.js";
export default {
  name: "lesson",
  components: {},
  data() {
    return {
      dialogTitle: "",
      tableData: [],
      LessonList: [],
      dialogFormVisible: false,
      dialogForm: {
        title: "",
        type: "",
        describe: "",
        cover: ""
      },
      showImg: false,
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
            message: "请选择课程类型",
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
      }
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    // 获取课程信息
    getProfile() {
      this.$axios
        .get("/api/profiles")
        .then(res => {
          this.LessonList = res.data;
          this.pagination.total = res.data.length;
          this.tableData = res.data.filter((item, index) => {
            return index < this.pagination.pageSize;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 分页
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = val;
      this.tableData = this.LessonList.filter((item, index) => {
        return index < val;
      });
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.tableData = this.LessonList.filter((item, index) => {
        return (
          index < val * this.pagination.pageSize &&
          index >= (val - 1) * this.pagination.pageSize
        );
      });
    },

    // 添加课程信息
    handlerAdd() {
      this.dialogTitle = "添加课程信息";
      // this.dialogForm = {};
      this.dialogFormVisible = true;
      this.showImg = false
    },

    // 编辑课程信息
    editLesson(index) {
      this.dialogTitle = "修改课程信息";
      this.dialogForm = this.tableData[index];
      this.dialogFormVisible = true;
      this.lessonId = this.tableData[index]._id;
    },

    toEdit(lessonId) {
      this.$router.push({path: 'lessonEdit', query: { lesson: lessonId }})
    },

    // 删除课程信息
    offlineLesson(index) {
      this.$confirm(
        `即将下线"${this.tableData[index].title}", 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$axios
            .delete(`/api/profiles/delete/${this.tableData[index]._id}`)
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
          let formData = new FormData()
          let cover = this.dialogForm.cover
          if(this.$refs.coverInput.files.length > 0) {
            cover = this.$refs.coverInput.files[0]
          }
          formData.append('cover', cover)
          formData.append('title', this.dialogForm.title)
          formData.append('type', this.dialogForm.type)
          formData.append('describe', this.dialogForm.describe)
          if (!this.lessonId) {
            this.$axios
              .post("/api/profiles/add", formData)
              .then(res => {
                this.$message({ message: "课程创建成功", type: "success" });
                this.dialogFormVisible = false;
                this.getProfile();
                this.lessonId = ''
                this.pagination.currentPage = 1;
              })
              .catch(err => {
                this.$message({
                  message: `课程创建失败:${err}`,
                  type: "warning"
                });
              });
          } else {
            this.$axios
              .put(`/api/profiles/edit/${this.lessonId}`, formData)
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
      // if(this.dialogForm.cover !== '') {
      //   let cover = this.$refs.coverInput.files[0]
      //   let formData = new FormData()
      //   formData.append('cover', cover)
      //   formData.append('name', 111)
      //   this.$axios.post('/api/api/profiles/uploadImg', formData)
      //     .then(res=>{
      //       console.log(res)
      //     })
      //     .catch(err=>{
      //       console.log(err)
      //     })
      // }
    },

    handleAvatarSuccess(res, file) {
      this.dialogForm.cover = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg"||"image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    uploadCover() {
      this.$refs.coverInput.dispatchEvent(new MouseEvent('click'))
    },
    addImg() {
      console.log('===========添加图片')
      let reader = new FileReader();
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = ()=>{
        this.dialogForm.cover = reader.result
        this.showImg = true
        console.log(this.dialogForm.cover)
      }
    }

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