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
      <p>还没有收藏任何课程哦，快去收藏吧~<router-link to="index">回到首页</router-link></p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'collection',
  data() {
    return {
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 15, 30],
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper"
      },

    }
  },
  created() {
    this.getProfile()
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
  },
}
</script>
<style scoped>
.add-tip-box {
  padding: 100px 0;
  text-align: center;
}
.add-tip-box p {
  color: #999;
  font-size: 20px;
  margin-bottom: 24px;
}
</style>
