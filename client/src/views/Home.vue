<template>
  <div id="lesson-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="课程名">
        <el-input v-model="searchForm.title" placeholder="请输入课程名"></el-input>
      </el-form-item>
      <el-form-item label="课程类型" prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择课程分类">
            <el-option label='全部' value=''></el-option>
            <el-option
              v-for="item in typeList"
              :label="item.name"
              :value="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchLesson">搜索</el-button>
        <el-button @click="searchForm={}">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="15" v-if="lessonList.length>0">
      <el-col :span="6" v-for="item in lessonList" :key="item.id">
        <el-card :body-style="{ padding: '0' }" shadow="hover">
          <div class="lesson-cover-wrap"><img :src="item.cover" class="lesson-cover"></div>
          <div class="lesson-info">
            <p class="title">{{item.title}}<button @click="toDetails(item)" class="to-details el-icon-arrow-right"></button></p>
            <div class="bottom clearfix">
              <p class="type">
                <span class="el-icon-edit">作者：{{item.author}}</span>
                <span>分类：{{item.type}}</span>
              </p>
              <time class="time el-icon-time">上传于{{item.date}}</time>
              <p class="tag">
                <span>
                  <button class="el-icon-sugar" :style="item.liked?'color:#5cb6ff':''" @click="likeLesson(item)"> {{item.likes.length}}</button>
                  <button class="el-icon-chat-dot-round" @click="toDetails(item)"> {{item.discussion.length}}</button>
                  <button class="el-icon-view">{{item.views}}</button>
                </span>
                <button  class="el-icon-star-on collect" :style="item.collected?'color:#5cb6ff':''" @click="collectLesson(item)"></button>
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <p class="no-result" v-else>没找到结果哦，换个关键词或者分类吧~</p>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" :layout="pagination.layout" :total="pagination.total">
      </el-pagination>
  </div>
</template>
<script>
import typeList from "../static/lessonTypeList.js";
export default {
  name: 'home',
  components: {},
  data() {
    return {
      lessonList: [],
      lessons: [],
      pagination: {
        currentPage: 1,
        pageSize: 8,
        pageSizes: [8,16,24,32],
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
      },
      searchForm: {
        title: null,
        type: null,
      },
      typeList,
    }
  },
  created() {
    this.getLessonList()
  },
  methods: {
    // 获取所有课程信息
    getLessonList: function(params) {
      this.$axios.get('/api/profiles/',{params})
        .then(res=>{
          console.log(res.data)
          this.lessonList = res.data.data;
          this.pagination.total = res.data.sum;
        })
        .catch(err=>{
          console.log(err);
        })
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = val;
      let page = {
        pageSize: this.pagination.pageSize,
        currentPage: this.pagination.currentPage
      }
      this.getLessonList(page)
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      let page = {
        pageSize: this.pagination.pageSize,
        currentPage: this.pagination.currentPage
      }
      this.getLessonList(page)
    },
    // 收藏
    collectLesson(item) {
      console.log(item)
      let status = ''
      if(item.collected) {
        status = 0
      } else {
        status = 1
      }
      this.$axios.post(`/api/profiles/collect/${item.id}`,{status})
      .then(res=>{
        item.collected = !item.collected
      })
      .catch(err=>{
        console.log(err)
      })
    },
    // 点赞
    likeLesson(item) {
      console.log(item)
      let status,count
      if(item.liked) {
        status = 0
        count = -1
      } else {
        status = 1
        count = 1
      }
      console.log(count, item.likes)
      this.$axios.post(`/api/profiles/like/${item.id}`,{status})
      .then(res=>{
        item.liked = !item.liked
        item.likes.length += count
        count = 0
      })
      .catch(err=>{
        console.log(err)
      })
    },
    // 详情页
    toDetails: function(item) {
      this.$router.push({path: 'lessonInfo', query: { lesson: item.id }})
    },
    // 搜索
    searchLesson: function() {
      for(let i in this.searchForm) {
        this.pagination.currentPage = 1
        if (this.searchForm[i] === '' || this.searchForm[i] === undefined) {
          this.searchForm[i] = null
        }
      }
      this.getLessonList(this.searchForm)
    }
  },
}
</script>
<style scoped>
 #lesson-wrap .el-pagination {
   text-align: right;
   margin: 30px 0;
 }
 #lesson-wrap .el-card {
   color: #606266;
   margin-bottom: 15px;
 }
 #lesson-wrap .lesson-info {
   position: relative;
   padding: 8px 15px;
 }
 #lesson-wrap .el-card .el-button {
   padding: 0;
   margin: 5px auto 0;
 }
 #lesson-wrap .el-card button.to-details {
   position: absolute;
   top: 10px;
   right: 10px;
   font-size: 20px;
   color: #999;
 }
 #lesson-wrap .el-card p.title {
   margin-bottom: 8px;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
   width: 100%;
 }
 #lesson-wrap .el-card .time, #lesson-wrap .el-card p.tag, #lesson-wrap .el-card p.type {
   font-size: 13px;
   color: #999;
   line-height: 24px;
 }
 #lesson-wrap .el-card p.type span {
   margin-right: 15px;
 }
 #lesson-wrap .el-card p.tag {
   display: flex;
   justify-content: space-between;
 }
 #lesson-wrap .el-card .time, #lesson-wrap .el-card p.tag span button {
   display: inline-block;
   margin-right: 15px;
 }
 #lesson-wrap .lesson-cover-wrap {
   height: 180px;
   overflow: hidden;
 }
 #lesson-wrap img.lesson-cover {
   position: relative;
   width: 100%;
   display: block;
   top: 50%;
   transform: translateY(-50%);
 }
 #lesson-wrap p.no-result {
   width: 100%;
   padding-top: 50px;
   text-align: center;
   font-size: 14px;
   color: #999;
 }
</style>
