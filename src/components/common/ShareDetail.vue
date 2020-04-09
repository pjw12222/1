<!--
 * @Author: your name
 * @Date: 2020-03-13 16:55:03
 * @LastEditTime: 2020-04-04 23:53:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\components\BlogDetail.vue
 -->
<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <div style="text-align: left;">
        <el-button
          type="text"
          icon="el-icon-back"
          @click="goBack"
          style="padding-bottom: 0px;"
          >返回</el-button
        >
      </div>
    </el-col>
    <el-col :span="24">
      <div>
        <div>
          <h3 style="margin-top: 0px;margin-bottom: 0px">
            {{ article.title }}
          </h3>
        </div>
        <div
          style="width: 100%;margin-top: 5px;display: flex;justify-content: flex-end;align-items: center"
        >
          <div
            style="display: inline; color: #20a0ff;margin-left: 50px;margin-right:20px;font-size: 12px;"
          >
            {{ article.nickname }}
          </div>
          <span style="color: #20a0ff;margin-right:20px;font-size: 12px;"
            >浏览 {{ article.pageView == null ? 0 : article.pageView }}</span
          >
          <span style="color: #20a0ff;margin-right:20px;font-size: 12px;">
            {{ article.editTime | formatDateTime }}</span
          >
          <el-tag
            type="success"
            v-for="(item, index) in article.tags"
            :key="index"
            size="small"
            style="margin-left: 8px"
            >{{ item.tagName }}
          </el-tag>
          <span style="margin:0px 50px 0px 0px"></span>
        </div>
      </div>
    </el-col>
    <el-col>
      <div style="text-align: left" v-html="article.htmlContent"></div>
    </el-col>
    <el-col>
      <div>
        <div style="display:block">
          <el-divider
            ><i class="fa fa-commenting-o" aria-hidden="true"></i
          ></el-divider>
          <el-button type="text" disabled>评论管理</el-button>
        </div>
        <!--头部-->
        <div class="detailManaHead">
          <div class="updateDataWrap">
            <span v-if="addDisable" style="padding-right:10px">
              <el-button size="medium" type="primary" @click="addRow"
                >新增</el-button
              >
            </span>
            <span v-else style="padding-right:10px">
              <el-button size="medium" type="primary" @click="addRow" disabled
                >新增</el-button
              >
            </span>
            <el-button size="medium" type="primary" @click="handleEdit"
              >修改</el-button
            >
            <el-button size="medium" type="primary" @click="hanleSave"
              >保存</el-button
            >
            <el-button size="medium" type="danger" @click="handleDel"
              >删除</el-button
            >
          </div>
        </div>
        <!--表格-->
        <div>
          <template>
            <el-table
              ref="multipleTable"
              :data="tableData"
              :key="tableData.id"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" width="150" label="序号">
              </el-table-column>
              <el-table-column prop="detailContent" label="详情" width="700">
                <template slot-scope="scope">
                  <span v-if="scope.row.show">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入评论"
                      v-model="scope.row.detailContent"
                    ></el-input>
                  </span>
                  <span v-else>{{ scope.row.detailContent }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="userId" label="作者" width="230">
                <template slot-scope="scope">
                  <span>{{ scope.row.userId }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { getRequest, postRequest } from "../../utils/api";
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          userId: "张三",
          detailContent: "评论"
        }
      ],
      multipleSelection: [],
      article: {},
      loading: false,
      activeName: "",
      headId: null,
      addDisable: true,
      editIndex: null
      //comments:[],
    };
  },
  mounted: function() {
    var aid = this.$route.query.aid;
    this.headId = aid;
    this.activeName = this.$route.query.an;
    var _this = this;
    this.loading = true;
    getRequest("/community/queryInfoHeadById/" + aid).then(
      resp => {
        _this.loading = false;
        if (resp.status == 200) {
          let middleresult = {};
          let data = resp.data;
          middleresult.title = data.title;
          middleresult.htmlContent = data.headContent;
          middleresult.editTime = new Date();
          middleresult.tags = [{ tagName: "tag1" }, { tagName: "tag2" }];
          _this.article = middleresult;
        } else {
          _this.$message({ type: "error", message: "页面加载失败!" });
        }
      },
      resp => {
        _this.loading = false;
        _this.$message({ type: "error", message: "页面加载失败!" });
      }
    );
    _this.loading = false;
    _this.loadDetailContent();
  },

  methods: {
    // 加载评论详情
    loadDetailContent() {
      getRequest("/community/queryAllDetail/" + this.headId).then(resp => {
        if (resp.status == 200) {
          this.tableData = resp.data;
          console.log(this.tableData);
        }
      });
      this.isEditInit();
    },
    // 可编辑初始化
    isEditInit() {
      this.tableData.map(i => {
        i.show = false;
        return i;
      });
    },

    // 修改某一行的编辑状态
    toggleSelection(rows) {
      console.log(rows);
      rows.show = !rows.show;
    },
    goBack() {
      this.$router.go(-1);
    },
    //点击新增
    addRow: function() {
      let list = {
        detailContent: "",
        userId: localStorage.getItem("userId"),
        show: true
      };
      this.tableData.push(list);
      this.index = this.tableData.length;
      this.addDisable = false;
    },
    //点击修改
    handleEdit: function() {
      if (this.tableData[this.index - 1].detailContent == "") {
        this.$message({
          message: "请输入评论",
          duration: 1500,
          type: "warning"
        });
      } else {
        this.toggleSelection(this.tableData[this.index - 1]);
      }
    },
    //点击删除
    handleDel: function() {},
    //点击保存
    hanleSave: function() {
      let upload = this.tableData[this.index - 1];
      upload.headId = this.headId;
      postRequest("/community/insertInfoDetail", JSON.stringify(upload)).then(
        resp => {
          if (resp.status == 200) {
            this.$message({
              message: "评论提交成功",
              duration: 1500,
              type: "success"
            });
            this.loadDetailContent();
          } else {
            this.$message({
              message: "评论提交失败",
              duration: 1500,
              type: "error"
            });
          }
        }
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /*分页方法*/
    handleSizeChange(val) {}
  }
};
</script>

<style scoped>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.headerWrap {
  height: 36px;
  line-height: 36px;
}
.tablenameWrap {
  width: 150px;
}
.updateDataWrap {
  margin: 20px 0;
}
.pagination {
  float: right;
  margin-top: 20px;
}
.detailManaHead {
  display: flex;
  justify-content: flex-start;
}
</style>
