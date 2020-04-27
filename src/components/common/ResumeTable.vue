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
      <el-input
        placeholder="通过标题搜索该分类下的简历..."
        prefix-icon="el-icon-search"
        v-model="keywords"
        style="width: 400px"
        size="mini"
      ></el-input>
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
      <el-table-column label="标题" width="200" align="left">
        <template slot-scope="scope">
          <span
            style="color: #409eff;cursor: pointer"
            @click="itemClick(scope.row)"
            >{{ scope.row.title }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="最近编辑时间" width="200" align="left">
        <template slot-scope="scope">{{
          scope.row.lastUpdateDate | formatDateTime
        }}</template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="所属分类"
        width="120"
        align="left"
      ></el-table-column>
      <el-table-column label="附件" width="320" align="left">
        <template slot-scope="scope" v-if="scope.row.attachment != undefined">{{
          scope.row.attachment
        }}</template>
        <template v-else>
          -
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" v-if="showEdit || showDelete">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            v-if="scope.row.type == '在线'"
            >编辑</el-button
          >
          <el-button
            size="mini"
            @click="handleDownload(scope.$index, scope.row)"
            v-if="scope.row.type == '线下'"
            >下载</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="showDelete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="blog_table_footer">
      <span></span>
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="this.resumes.length"
        @current-change="currentChange"
        v-show="this.resumes.length > 0"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getRequest } from "../../utils/api";
import { concatGetUrl } from "../../utils/utils";

export default {
  data() {
    return {
      resumes: [],
      selItems: [],
      loading: false,
      totalCount: -1,
      keywords: "",
      dustbinData: [],
      currentPage: 1,
      pageSize: 6,
      displayData: []
    };
  },
  mounted: function() {
    var _this = this;
    this.loading = true;
    this.loadBlogs();
    window.bus.$on("blogTableReload", function() {
      _this.loading = true;
      _this.loadBlogs();
    });
  },
  methods: {
    searchClick() {
      this.loadBlogs();
    },
    itemClick(row) {
      if (row.type == "在线") {
        let identity = localStorage.getItem("type");
        if (identity == "普通用户") {
          this.$router.push({
            path: "/preview",
            query: { from: this.activeName, rid: row.id }
          });
        } else {
          this.$router.push({
            path: "/adminPreview",
            query: { from: this.activeName, rid: row.id }
          });
        }
      }
    },
    //翻页
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.tableList();
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
        // this.resumes是总数据;
        if (this.resumes[j]) {
          this.displayData.push(this.resumes[j]);
        }
      }
    },
    loadBlogs() {
      var _this = this;
      let params = {
        uid: localStorage.getItem("userId"),
        title: this.keywords
      };
      let url = "/resume/queryResumeByUser";
      url = concatGetUrl(params, url);
      getRequest(url)
        .then(
          resp => {
            _this.loading = false;
            if (resp.status == 200) {
              _this.resumes = resp.data;
              _this.tableList();
            } else {
              _this.$message({ type: "error", message: "数据加载失败!" });
            }
          },
          resp => {
            _this.loading = false;
            if (resp.response.status == 403) {
              _this.$message({ type: "error", message: resp.response.data });
            } else {
              _this.$message({ type: "error", message: "数据加载失败!" });
            }
          }
        )
        .catch(resp => {
          //压根没见到服务器
          _this.loading = false;
          _this.$message({ type: "error", message: "数据加载失败!" });
        });
    },
    handleSelectionChange(val) {
      this.selItems = val;
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "/editBlog",
        query: { from: this.activeName, id: row.id }
      });
    },
    handleDownload(index, row) {
      getRequest("/resume/downloadResume?attachment=" + row.attachment).then(
        resp => {
          if (resp.status == 200) {
            let url = window.URL.createObjectURL(new Blob([resp.data]));
            let a = document.createElement("a");
            a.setAttribute("download", row.attachment);
            a.href = url;
            a.click();
          }
        }
      );
    },
    handleDelete(index, row) {
      let _this = this;
      this.$confirm("确认删除 " + row.title + " ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.deleteCate(row.id);
        })
        .catch(() => {
          //取消
          _this.loading = false;
        });
    },
    deleteCate(id) {
      var _this = this;
      this.loading = true;
      //删除
      getRequest("/resume/deleteResume?id=" + id).then(
        resp => {
          var json = resp.data;
          _this.$message({
            type: json.status,
            message: json.msg
          });
          _this.loadBlogs();
        },
        resp => {
          _this.loading = false;
          if (resp.status == 403) {
            _this.$message({
              type: "error",
              message: resp.data
            });
          } else if (resp.status == 500) {
            _this.$message({
              type: "error",
              message: "删除失败,请联系管理员!"
            });
          }
        }
      );
    }
  },
  props: ["state", "showEdit", "showDelete", "activeName", "showRestore"]
};
</script>
