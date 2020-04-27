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
  <el-container>
    <el-header class="cate_mana_header">
      <el-input
        placeholder="请输入栏目"
        v-model="content"
        style="width: 200px;"
      >
      </el-input>
      <el-input
        v-model="type"
        placeholder="请输入类型"
        style="width: 200px;"
      ></el-input>
      <el-button
        type="primary"
        size="medium"
        style="margin-left: 10px"
        @click="addNewCate"
        >新增栏目</el-button
      >
      <el-input
        v-model="search"
        placeholder="请输入搜索类型"
        style="width: 200px;"
      ></el-input>
      <el-button type="primary" @click="searchByType">搜索</el-button>
    </el-header>
    <el-main class="cate_mana_main">
      <el-table
        ref="multipleTable"
        :data="displayData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" align="left">
        </el-table-column>
        <el-table-column label="编号" prop="id" width="120" align="left">
        </el-table-column>
        <el-table-column
          label="栏目名称"
          prop="content"
          width="120"
          align="left"
        >
        </el-table-column>
        <el-table-column prop="type" label="类型" align="left">
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="danger"
        :disabled="this.selItems.length == 0"
        style="margin-top: 10px;width: 100px;"
        @click="deleteAll"
        v-if="this.categories.length > 0"
        >批量删除
      </el-button>
    </el-main>
    <div class="blog_table_footer">
      <span></span>
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="this.categories.length"
        @current-change="currentChange"
        v-show="this.categories.length > 0"
      ></el-pagination>
    </div>
  </el-container>
</template>
<script>
import { postRequest } from "../../utils/api";
import { deleteRequest } from "../../utils/api";
import { getRequest } from "../../utils/api";
export default {
  methods: {
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
        // this.categories是总数据;
        if (this.categories[j]) {
          this.displayData.push(this.categories[j]);
        }
      }
    },
    addNewCate() {
      this.loading = true;
      var _this = this;
      let titlesList = [{ content: _this.content, type: _this.type }];
      console.log(JSON.stringify(titlesList));
      postRequest("/admin/doInsertTitle/", JSON.stringify(titlesList)).then(
        (resp) => {
          if (resp.status == 200) {
            var json = resp.data;
            _this.$message({ type: json.status, message: json.msg });
            _this.content = "";
            _this.refresh();
          }
          _this.loading = false;
        },
        (resp) => {
          if (resp.response.status == 403) {
            _this.$message({
              type: "error",
              message: resp.response.data,
            });
          }
          _this.loading = false;
        }
      );
    },
    deleteAll() {
      var _this = this;
      this.$confirm("确认删除这 " + this.selItems.length + " 条数据?", "提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          //批量删除
          var selItems = _this.selItems;
          let ids = [];
          for (var i = 0; i < selItems.length; i++) {
            ids[i] = selItems[i].id;
          }
          getRequest("/admin/doBatchDelete?ids=" + ids).then((resp) => {
            var json = resp.data;
            _this.$message({
              type: json.status,
              message: json.msg,
            });
            _this.refresh();
          });
        })
        .catch(() => {
          //取消
          _this.loading = false;
        });
    },
    handleSelectionChange(val) {
      this.selItems = val;
    },
    handleEdit(index, row) {
      var _this = this;
      this.$prompt("请输入新名称", "编辑", {
        confirmButtonText: "更新",
        inputValue: row.content,
        cancelButtonText: "取消",
      }).then(({ value }) => {
        //value就是输入值
        if (value == null || value.length == 0) {
          _this.$message({
            type: "info",
            message: "数据不能为空!",
          });
        } else {
          _this.loading = true;
          postRequest("/admin/doUpdateTitle/", {
            id: row.id,
            content: value,
          }).then(
            (resp) => {
              var status = resp.status;
              if (status == 200)
                _this.$message({
                  message: "更新成功",
                  duration: 1500,
                  type: "success",
                });
              _this.refresh();
            },
            (resp) => {
              if (resp.status == 403) {
                _this.$message({
                  type: "error",
                  message: resp.data,
                });
              }
              _this.loading = false;
            }
          );
        }
      });
    },
    handleDelete(index, row) {
      let _this = this;
      this.$confirm("确认删除 " + row.content + " ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
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
      deleteRequest("/admin/doDeleteTitle/" + id).then(
        (resp) => {
          var json = resp.data;
          _this.$message({
            type: json.status,
            message: json.msg,
          });
          _this.refresh();
        },
        (resp) => {
          _this.loading = false;
          if (resp.status == 403) {
            _this.$message({
              type: "error",
              message: resp.data,
            });
          } else if (resp.status == 500) {
            _this.$message({
              type: "error",
              message: "该栏目下尚有简历，删除失败!",
            });
          }
        }
      );
    },
    // 按类型进行查找
    searchByType() {
      let _this = this;
      getRequest("/admin/queryTitleByType?type=" + this.search).then(
        (resp) => {
          _this.categories = resp.data;
          _this.loading = false;
        },
        (resp) => {
          if (resp.response.status == 403) {
            _this.$message({
              type: "error",
              message: resp.response.data,
            });
          }
          _this.loading = false;
        }
      );
    },
    refresh() {
      let _this = this;
      getRequest("/admin/queryAllTitles").then(
        (resp) => {
          _this.categories = resp.data;
          _this.tableList();
          _this.loading = false;
        },
        (resp) => {
          if (resp.response.status == 403) {
            _this.$message({
              type: "error",
              message: resp.response.data,
            });
          }
          _this.loading = false;
        }
      );
    },
  },
  mounted: function() {
    this.loading = true;
    this.refresh();
  },
  data() {
    return {
      content: "",
      type: "",
      search: "",
      selItems: [],
      categories: [],
      loading: false,
      currentPage: 1,
      pageSize: 3,
      displayData: [],
    };
  },
};
</script>
<style>
.cate_mana_header {
  background-color: #ececec;
  margin-top: 20px;
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
}

.cate_mana_main {
  /*justify-content: flex-start;*/
  display: flex;
  flex-direction: column;
  padding-left: 5px;
  background-color: #ececec;
  margin-top: 20px;
  padding-top: 10px;
}
</style>
