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
        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editLesson(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="offlineLesson(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" :layout="pagination.layout" :total="pagination.total">
      </el-pagination>
    </div>
    <div  class="add-tip-box" v-else>
      <p>还没有添加课程哦~</p>
      <el-button type="primary" @click="handlerAdd" round>立即添加</el-button>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form :model="dialogForm" ref="lessonForm" :rules="formRules">
          <el-form-item label="课程标题" :label-width="formLabelWidth" prop="title">
            <el-input v-model="dialogForm.title" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item label="课程描述" prop="describe" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.describe" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item label="课程类型" :label-width="formLabelWidth" prop="type">
            <el-select v-model="dialogForm.type" placeholder="请选择课程类型">
              <el-option v-for="item in typeList" :label="item.name" :value="item.name" :key="item.value"></el-option>
            </el-select>
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
export default {
  name: 'lesson',
  components: {},
  data() {
    return {
      dialogTitle: '',
      tableData: [],
      LessonList: [],
      dialogFormVisible: false,
      dialogForm: {
        title: '',
        type: '',
        describe: ''
      },
      formLabelWidth: '120px',
      typeList: [
        {
          name: '计算机',
          value: 'computer'
        },
        {
          name: '经济学',
          value: 'economics'
        },
        {
          name: '管理学',
          value: 'management'
        },
        {
          name: '心理学',
          value: 'psychology'
        },
        {
          name: '文学',
          value: 'literature'
        },
        {
          name: '艺术',
          value: 'art'
        },
        {
          name: '历史',
          value: 'history'
        },
        {
          name: '哲学',
          value: 'philosophy'
        },
        {
          name: '军事',
          value: 'military'
        },
        {
          name: '其他',
          value: 'others'
        },
      ],
      formRules: {
        title: [
          { 
            required: true, 
            message: '请输入课程标题', 
            trigger: 'blur' 
          },
          { 
            min: 5,
            max: 20, 
            message: '长度在 5 到 20 个字符', 
            trigger: 'blur' 
          }
        ],
        type: [
          { 
            required: true, 
            message: '请选择课程类型', 
            trigger: 'change' 
          }
        ],
      },
      lessonId: '',
      pagination: {
        currentPage: 1,
        pageSize: 2,
        pageSizes: [2,5,10,15,30],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
      }
    }
  },
  created() {
    this.getProfile();
  },
  methods: {
    // 获取课程信息
    getProfile() {
      this.$axios.get('/api/profiles')
        .then(res=>{
          this.LessonList = res.data;
          this.pagination.total = res.data.length;
          this.tableData =  res.data.filter((item, index)=>{
            return index < this.pagination.pageSize;
          });
        })
        .catch(err=>{
          console.log(err);
        })
    },

    // 分页
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = val;
      this.tableData =  this.LessonList.filter((item, index)=>{
        return index < val;
      });
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.tableData =  this.LessonList.filter((item, index)=>{
        return index < val*this.pagination.pageSize && index >= (val-1)*this.pagination.pageSize;
      });
    },

    // 添加课程信息
    handlerAdd() {
      this.dialogTitle ='添加课程信息';
      this.dialogForm = {};
      this.dialogFormVisible = true; 
    },

    // 编辑课程信息
    editLesson(index) {
      this.dialogTitle = '修改课程信息';
      this.dialogForm = this.tableData[index];
      this.dialogFormVisible = true;
      this.lessonId = this.tableData[index]._id
    },

    // 删除课程信息
    offlineLesson(index) {
      this.$confirm(`即将下线"${this.tableData[index].title}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.$axios.delete(`api/profiles/delete/${this.tableData[index]._id}`)
          .then(res=>{
            this.$message({message: '课程已下线', type: 'info'});
            this.getProfile();
          })
          .catch(err=>{this.$message({message: '课程下线失败', type: 'warning'});})
        })
        .catch(() => {});
      
    },

    // 提交课程信息表单
    submitLessonForm(formName, lessonId) {
      console.log(lessonId)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.lessonId) {
            this.$axios.post('/api/profiles/add', this.dialogForm)
            .then(res=>{
              this.$message({message: '课程创建成功', type: 'success'});
              this.dialogFormVisible = false;
              this.getProfile();
            })
            .catch(err=>{
              this.$message({message: `课程创建失败:${err}`, type: 'warning'})
            })
          } else {
            this.$axios.post(`/api/profiles/edit/${this.lessonId}`, this.dialogForm)
            .then(res=>{
              this.$message({message: '课程信息已更新', type: 'success'});
              this.dialogFormVisible = false;
              this.getProfile();
            })
            .catch(err=>{
              console.log(err)
              this.$message({message: `课程信息更新失败:${err}`, type: 'warning'})
            })
          }
        }
      });
    }
  }
}
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
</style>
