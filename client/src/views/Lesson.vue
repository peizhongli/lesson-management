<template>
  <div>
    <div v-if="tableData.length > 0" class="table-container">
      <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>
      <el-dialog title="课程信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="日期" align="center" width="200">
          <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" align="center"></el-table-column>
        <el-table-column label="支出" prop="expend" align="center"></el-table-column>
        <el-table-column label="收入" prop="income" align="center"></el-table-column>
        <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="现金" prop="cash" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editLesson(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="offlineLesson(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>还没有添加课程哦</div>
  </div>
</template>
<script>
export default {
  name: 'lesson',
  components: {},
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, 
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, 
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, 
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      this.$axios.get('/api/profiles')
        .then(res=>{
          this.tableData = res.data;
        })
        .catch(err=>{
          console.log(err);
        })
    },
    editLesson(index, row) {
      console.log(index, row);
    },
    offlineLesson(index, row) {
      console.log(index, row);
    }
  }
}
</script>
