<!--
 * @Author: your name
 * @Date: 2020-03-13 16:55:03
 * @LastEditTime: 2020-04-15 21:40:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\components\ArticleList.vue
 -->
<template>
  <el-container class="article_list">
    <el-main class="main">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="全部简历" name="all">
          <blog_table
            state="-1"
            :showEdit="true"
            :showDelete="true"
            :showRestore="false"
            :activeName="activeName"
          ></blog_table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import ResumeTable from "./ResumeTable.vue";

export default {
  mounted: function() {},
  data() {
    return {
      activeName: "all",
      isAdmin: false
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  components: {
    blog_table: ResumeTable,
  }
};
</script>
<style>
.article_list > .header {
  background-color: #ececec;
  margin-top: 10px;
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
}

.article_list > .main {
  /*justify-content: flex-start;*/
  display: flex;
  flex-direction: column;
  padding-left: 0px;
  background-color: #fff;
  padding-top: 0px;
  margin-top: 8px;
}
</style>
