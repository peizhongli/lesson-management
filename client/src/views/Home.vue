<template>
  <div id="lesson-wrap">
    <el-row :gutter="15">
      <el-col :span="6" v-for="item in lessonList" :key="item.id">
        <el-card :body-style="{ padding: '0' }" shadow="hover">
          <div class="lesson-cover-wrap"><img :src="item.cover" class="lesson-cover"></div>
          <div class="lesson-info">
            <p class="title">{{item.title}}<button @click="toDetails(item)" class="to-details el-icon-arrow-right"></button></p>
            <div class="bottom clearfix">
              <time class="time el-icon-time">上传于{{item.date}}</time>
              <p class="tag">
                <span>
                  <button class="iconfont icon-like" :style="item.liked?'color:#5cb6ff':''" @click="likeLesson(item)"> {{item.likes.length}}</button>
                  <button class="iconfont icon-comment" @click="discussLesson(item)"> {{item.discussion.length}}</button>
                </span>
                <button  class="el-icon-star-on collect" :style="item.collected?'color:#5cb6ff':''" @click="collectLesson(item)"></button>
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" :layout="pagination.layout" :total="pagination.total">
      </el-pagination>
  </div>
</template>
<script>
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
      }
    }
  },
  created() {
    this.getLessonList()
  },
  methods: {
    // 获取所有课程信息
    getLessonList: function() {
      this.$axios.get('/api/profiles/all')
        .then(res=>{
          this.lessons = res.data;
          this.pagination.total = res.data.length;
          this.lessonList =  res.data.filter((item, index)=>{
            return index < this.pagination.pageSize;
          });
        })
        .catch(err=>{
          console.log(err);
          console.log(err.response.status);
        })
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = val;
      this.lessonList =  this.lessons.filter((item, index)=>{
        return index < val;
      });
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.lessonList =  this.lessons.filter((item, index)=>{
        return index < val*this.pagination.pageSize && index >= (val-1)*this.pagination.pageSize;
      });
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
 #lesson-wrap .el-card .time, #lesson-wrap .el-card p.tag {
   font-size: 13px;
   color: #999;
   margin-top: 5px;
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
</style>
