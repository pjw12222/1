<style type="text/css">
.blog_table_footer {
  display: flex;
  box-sizing: content-box;
  padding-top: 10px;
  padding-bottom: 0px;
  margin-bottom: 0px;
  justify-content: space-between;
}
</style>
<template>
  <div>
    <div style="display: flex;justify-content: flex-start">
      <el-select
        prefix-icon="el-icon-search"
        v-model="keywords"
        placeholder="请选择文章类型"
        style="width: 200px;"
      >
        <el-option
          v-for="item in titleLists"
          :key="item.id"
          :label="item.content"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        style="margin-left: 3px"
        @click="searchClick"
        >搜索</el-button
      >
    </div>
    <!--<div style="width: 100%;height: 1px;background-color: #20a0ff;margin-top: 8px;margin-bottom: 0px"></div>-->
    <el-table
      ref="multipleTable"
      :data="displayData"
      tooltip-effect="dark"
      style="width: 100%;overflow-x: hidden; overflow-y: hidden;"
      max-height="390"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column
        type="selection"
        width="35"
        align="left"
        v-if="showEdit || showDelete"
      ></el-table-column>
      <el-table-column label="标题" width="400" align="left">
        <template slot-scope="scope">
          <span
            style="color: #409eff;cursor: pointer"
            @click="itemClick(scope.row)"
            >{{ scope.row.title }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="cateName"
        label="所属分类"
        width="120"
        align="left"
      ></el-table-column>
      <el-table-column label="最近编辑时间" width="200" align="left">
        <template slot-scope="scope">{{
          scope.row.editTime | formatDate
        }}</template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="作者"
        width="120"
        align="left"
      ></el-table-column>
      <el-table-column label="操作" align="left" v-if="showEdit || showDelete">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleEdit(scope.$index, scope.row)"
            v-if="showEdit"
            >编辑</el-button
          >
          <el-button
            size="mini"
            @click="handleRestore(scope.$index, scope.row)"
            v-if="showRestore"
            >还原</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="showDelete"
            style="display:none"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="blog_table_footer">
      <!-- <el-button
        type="danger"
        size="mini"
        style="margin: 0px;"
        v-show="this.articles.length > 0 && showDelete"
        :disabled="this.selItems.length == 0"
        @click="deleteMany"
        >批量删除</el-button
      > -->
      <span></span>
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="this.articles.length"
        @current-change="currentChange"
        v-show="this.articles.length > 0"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { putRequest } from "../../utils/api";
import { getRequest } from "../../utils/api";
import { concatGetUrl } from "../../utils/utils";
import { formatdate } from "../../utils/utils";

export default {
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatdate(date, "yyyy-MM-dd hh:mm:ss"); // 此处可根据自己的需要自定义想要的日期格式
    },
  },
  data() {
    return {
      articles: [],
      selItems: [],
      loading: false,
      currentPage: 1,
      totalCount: -1,
      pageSize: 5,
      keywords: "",
      dustbinData: [],
      titleLists: [],
      userLists: [],
      displayData: [],
    };
  },
  mounted: function() {
    var _this = this;
    this.loading = true;

    // 获取用户列表
    getRequest("/admin/queryAllUsers").then((resp) => {
      _this.userLists = resp.data;
      // 获取标签列表
      getRequest("/admin/queryTitleByType?type=文章栏").then((resp) => {
        _this.titleLists = resp.data;
        localStorage.setItem("titleLists", JSON.stringify(_this.titleLists));
        this.loadBlogs(1, this.pageSize);
        window.bus.$on("blogTableReload", function() {
          _this.loading = true;
          _this.loadBlogs(_this.currentPage, _this.pageSize);
        });
      });
    });
  },
  methods: {
    searchClick() {
      this.loadBlogs(1, this.pageSize);
    },
    itemClick(row) {
      this.$router.push({ path: "/shareDetail", query: { aid: row.id } });
    },
    deleteMany() {
      var selItems = this.selItems;
      for (var i = 0; i < selItems.length; i++) {
        this.dustbinData.push(selItems[i].id);
      }
      this.deleteToDustBin(selItems[0].state);
    },
    //翻页
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.tableList();
    },
    loadBlogs(page, count) {
      var _this = this;
      var url = "";
      let userId = localStorage.getItem("userId");
      if (_this.state == 1) {
        let obj = { userId: userId, type: _this.keywords };
        url = concatGetUrl(obj, "/community/queryInfoHeadByUser");
      } else if (_this.state == -1) {
        url = "/community/queryAllInfoHead?type=" + _this.keywords;
      }
      if (url != "") {
        getRequest(url)
          .then(
            (resp) => {
              _this.loading = false;
              _this.articles = [];
              if (resp.status == 200) {
                let frontDatas = resp.data;
                for (let frontData of frontDatas) {
                  let article = {};
                  article.id = frontData.id;
                  article.title = frontData.title;
                  article.cateName = frontData.scope1;
                  article.editTime = frontData.lastUpdateDate;
                  article.userId = frontData.userId;
                  _this.articles.push(article);
                }
                // 对返回数据的用户编号和标签编号进行处理
                _this.articles.map((item) => {
                  let userId = item.userId;
                  let user = _this.userLists.find((item) => {
                    return item.id == userId;
                  });
                  let cateName = item.cateName;
                  let cate = _this.titleLists.find((item) => {
                    return item.id == cateName;
                  });
                  item.cateName = cate.content;
                  item.nickname = user.nickname;
                  return item;
                });
                _this.tableList();
              } else {
                _this.$message({ type: "error", message: "数据加载失败!" });
              }
            },
            (resp) => {
              _this.loading = false;
              if (resp.response.status == 403) {
                _this.$message({ type: "error", message: resp.response.data });
              } else {
                //_this.$message({type: 'error', message: '数据加载失败!'});
              }
            }
          )
          .catch((resp) => {
            //压根没见到服务器
            _this.loading = false;
            //_this.$message({type: 'error', message: '数据加载失败!'});
          });
      } else {
        _this.articles = [];
        _this.loading = false;
      }
    },
    handleSelectionChange(val) {
      this.selItems = val;
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "/postShare",
        query: { from: this.activeName, id: row.id },
      });
    },
    handleDelete(index, row) {
      this.dustbinData.push(row.id);
      this.deleteToDustBin(row.state);
    },
    handleRestore(index, row) {
      let _this = this;
      this.$confirm("将该文件还原到原处，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _this.loading = true;
          putRequest("/article/restore", { articleId: row.id }).then((resp) => {
            if (resp.status == 200) {
              var data = resp.data;
              _this.$message({ type: data.status, message: data.msg });
              if (data.status == "success") {
                window.bus.$emit("blogTableReload"); //通过选项卡都重新加载数据
              }
            } else {
              //_this.$message({type: 'error', message: '还原失败!'});
            }
            _this.loading = false;
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消还原",
          });
        });
    },
    deleteToDustBin(state) {
      var _this = this;
      this.$confirm(
        state != 2
          ? "将该文件放入回收站，是否继续?"
          : "永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          _this.loading = true;
          // var url = "";
          // if (_this.state == -2) {
          //   url = "/admin/article/dustbin";
          // } else {
          //   url = "/article/dustbin";
          // }
          // putRequest(url, { aids: _this.dustbinData, state: state }).then(
          //   resp => {
          //     if (resp.status == 200) {
          //       var data = resp.data;
          //       _this.$message({ type: data.status, message: data.msg });
          //       if (data.status == "success") {
          //         window.bus.$emit("blogTableReload"); //通过选项卡都重新加载数据
          //       }
          //     } else {
          //       _this.$message({ type: "error", message: "删除失败!" });
          //     }
          //     _this.loading = false;
          //     _this.dustbinData = [];
          //   },
          //   resp => {
          //     _this.loading = false;
          //     _this.$message({ type: "error", message: "删除失败!" });
          //     _this.dustbinData = [];
          //   }
          // );
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除",
          });
          _this.dustbinData = [];
        });
    },
    // 实现前端分页效果
    // 计算当前页面的数据
    tableList() {
      // this.displayData是当前页面要显示的数据
      this.displayData = [];
      for (
        // pageSize是当前页面要显示总条数，例如：每页显示20条；currentPage是当前页面数;
        var j = this.pageSize * (this.currentPage - 1);
        j < this.pageSize * this.currentPage;
        j++
      ) {
        // this.articles是总数据;
        if (this.articles[j]) {
          this.displayData.push(this.articles[j]);
        }
      }
    },
  },
  props: ["state", "showEdit", "showDelete", "activeName", "showRestore"],
};
</script>
