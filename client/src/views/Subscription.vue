<template>
  <div id="subscription-wrap">
    <div v-if="lessonList.length>0" class="table-container">
      <el-button type="primary" @click="$router.push('home')" round style="margin-bottom:20px">回到首页</el-button>
      <el-row :gutter="15">
        <el-col :span="6" v-for="item in lessonList" :key="item.id">
          <el-card :body-style="{ padding: '0' }" shadow="hover">
            <div class="lesson-cover-wrap"><img :src="item.cover" class="lesson-cover"></div>
            <div class="lesson-info">
              <p class="title">{{item.title}}<button @click="toDetails(item)" class="to-details el-icon-arrow-right"></button></p>
              <div class="bottom clearfix">
                <p class="type">分类：{{item.type}}</p>
                <time class="time el-icon-time">上传于{{item.date}}</time>
                <p class="tag">
                  <span>
                    <button class="iconfont icon-like" :style="item.liked?'color:#5cb6ff':''" @click="likelesson(item)"> {{item.likes.length}}</button>
                    <button class="iconfont icon-comment" @click="discusslesson(item)"> {{item.discussion.length}}</button>
                  </span>
                  <button  class="el-icon-star-on collect" :style="item.collected?'color:#5cb6ff':''" @click="collectlesson(item)"></button>
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
    <div class="add-tip-box" v-else>
      <p>还没有订阅任何课程哦，快去订阅吧~<el-button type="primary" round><router-link to="index">回到首页</router-link></el-button></p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'subscription',
  data() {
    return {
      lessonList: [],
      pagination: {
        currentPage: 1,
        pageSize: 8,
        pageSizes: [8, 16, 32, 64],
        total: 0,
        layout: "total, sizes, prev, pager, next, jumper"
      },

    }
  },
  created() {
    this.getProfile()
    console.log(this.lessonList)
  },
  methods: {
    // 获取课程信息
    getProfile(page) {
      this.$axios
        .get("/api/profiles/",{
          params: {
            subscription: window.localStorage.getItem('userName'),
            currentPage: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          }
        })
        .then(res => {
          this.lessonList = res.data.data
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
  },
}
</script>
<style scoped>
#subscription-wrap a {
  color: #fff;
}
#subscription-wrap .add-tip-box {
  width: 100%;
  padding: 50px 0 0;
  text-align: center;
}
#subscription-wrap .el-pagination {
   text-align: right;
   margin: 30px 0;
 }
#subscription-wrap .el-card {
   color: #606266;
   margin-bottom: 15px;
 }
 #subscription-wrap .lesson-info {
   position: relative;
   padding: 8px 15px;
 }
 #subscription-wrap .el-card .el-button {
   padding: 0;
   margin: 5px auto 0;
 }
 #subscription-wrap .el-card button.to-details {
   position: absolute;
   top: 10px;
   right: 10px;
   font-size: 20px;
   color: #999;
 }
 #subscription-wrap .el-card p.title {
   margin-bottom: 8px;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
   width: 100%;
 }
 #subscription-wrap .el-card .time, #subscription-wrap .el-card p.tag, #subscription-wrap .el-card p.type {
   font-size: 13px;
   color: #999;
   line-height: 24px;
 }
 #subscription-wrap .el-card p.tag {
   display: flex;
   justify-content: space-between;
 }
 #subscription-wrap .el-card .time, #subscription-wrap .el-card p.tag span button {
   display: inline-block;
   margin-right: 15px;
 }
 #subscription-wrap .lesson-cover-wrap {
   height: 180px;
   overflow: hidden;
 }
 #subscription-wrap img.lesson-cover {
   position: relative;
   width: 100%;
   display: block;
   top: 50%;
   transform: translateY(-50%);
 }
</style>
