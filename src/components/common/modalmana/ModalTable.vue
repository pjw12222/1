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
        placeholder="请选择模板类型"
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
      ></el-table-column>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        prop="style"
        label="所属分类"
        width="120"
        align="left"
      ></el-table-column>
      <el-table-column label="文件" align="left">
        <template slot-scope="scope">
          <i class="fa fa-file-text-o" aria-hidden="true"></i
          >{{ scope.row.attachment }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.$index, scope.row)"
            >预览</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDownLoad(scope.$index, scope.row)"
            >下载</el-button
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
        :total="this.modals.length"
        @current-change="currentChange"
        v-show="this.modals.length > 0"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getRequest } from "../../../utils/api";
import { formatdate } from "../../../utils/utils";

export default {
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatdate(date, "yyyy-MM-dd hh:mm:ss"); // 此处可根据自己的需要自定义想要的日期格式
    },
  },
  data() {
    return {
      modals: [],
      selItems: [],
      loading: false,
      currentPage: 1,
      totalCount: -1,
      pageSize: 5,
      keywords: "",
      displayData: [],
      titleLists: [],
    };
  },
  mounted: function() {
    var _this = this;
    this.loading = true;
    _this.loadTitle();
    _this.loadModal();
  },
  methods: {
    handleSelectionChange(val) {
      this.selItems = val;
    },
    handleView(index, row) {
      this.$message({
        message: "该功能尚未开放，敬请期待！！！",
        type: "warning",
      });
    },
    handleDownLoad(index, row) {
      getRequest("/resume/downloadFile?fileName=" + row.attachment).then(
        (resp) => {
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
    loadTitle() {
      getRequest("/admin/queryTitleByType?type=" + "模板分类").then((resp) => {
        if (resp.status == 200) {
          this.titleLists = resp.data;
        }
      });
    },
    loadModal() {
      getRequest("/model/queryAllModels?style=" + this.keywords).then(
        (resp) => {
          if (resp.status == 200) {
            this.modals = resp.data;
          }
          this.tableList();
          this.loading = false;
        }
      );
    },
    searchClick() {
      this.loading = true;
      this.loadModal();
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
        // this.modals是总数据;
        if (this.modals[j]) {
          this.displayData.push(this.modals[j]);
        }
      }
    },
  },
};
</script>
