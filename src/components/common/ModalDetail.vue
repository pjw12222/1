<!--
 * @Author: your name
 * @Date: 2020-03-13 16:55:03
 * @LastEditTime: 2020-04-15 16:09:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\components\BlogDetail.vue
 -->
<template>
  <el-container class="article_list">
    <el-main class="main">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="模板列表" name="all">
          <modal_table></modal_table>
        </el-tab-pane>
        <el-tab-pane label="简历上传" name="post" style="text-align: center;">
          <el-card style="width: 500px;text-align: center;" v-loading="loading">
            <el-upload
              class="upload-demo"
              ref="form"
              action="uploadUrl"
              drag
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :auto-upload="false"
              :on-change="handleChange"
              :file-list="fileList"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击选取</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能选取pdf/doc/docx文件，且不超过5MB
              </div>
            </el-upload>
            <div>
              <el-button
                style="margin: 10px;"
                size="small"
                type="primary"
                @click="submitUpload"
                >上传到服务器</el-button
              >
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import ModalTable from "./modalmana/ModalTable";
import { uploadFileRequest } from "../../utils/api";

export default {
  mounted: function() {
    this.formData = new FormData();
  },
  data() {
    return {
      activeName: "all",
      loading: false,
      fileList: [],
      uploadUrl: "#",
      formData: "",
      value: ""
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    submitUpload() {
      if (this.fileList.length == 0) {
        this.$message("请选择需要上传的简历");
      } else {
        this.formData = new FormData();
        console.log(this.fileList[0]);
        this.formData.append("file", this.fileList[0].raw);
        this.formData.append(
          "userId",
          parseInt(localStorage.getItem("userId"))
        );

        this.$prompt("请输入标题", "编辑", {
          confirmButtonText: "上传",
          // inputValue: '',
          cancelButtonText: "取消"
        }).then(({ value }) => {
          //value就是输入值
          if (value == null || value.length == 0) {
            this.$message({
              type: "info",
              message: "标题不能为空!"
            });
          } else {
            this.loading = true;
            this.formData.append("title", value);
            uploadFileRequest("/resume/uploadFileResume", this.formData).then(
              resp => {
                if (resp.status == 200) {
                  this.$message({
                    type: "success",
                    message: "简历上传成功",
                    duration: 1500
                  });
                  if (localStorage.getItem("type") == "普通用户") {
                    this.$router.replace("/home");
                  } else {
                    this.$router.replace("/adminhome");
                  }
                }
              },
              resp => {
                if (resp.status == 403) {
                  this.$message({
                    type: "error",
                    message: resp.data
                  });
                }
                this.loading = false;
              }
            );
          }
        });
      }
    },

    handleChange(file, fileList) {
      let check = true;
      var FileExt = file.name.replace(/.+\./, "");
      this.isLt5k = file.size / 1024 / 1024 < 5 ? "1" : "0";
      if (this.isLt5k === "0") {
        this.$message({
          message: "上传文件大小不能超过5MB!",
          type: "error"
        });
        check = false;
      }
      if (["pdf", "doc", "docx"].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为pdf、doc、docx的附件！"
        });
        check = false;
      }
      if (check) {
        if (fileList.length > 0) {
          this.fileList = [fileList[fileList.length - 1]]; // 这一步，是展示最后一次选择的csv文件
        } else {
          this.fileList = [file];
        }
      } else {
        if (fileList.length > 1) {
          this.fileList = [fileList[fileList.length - 2]]; // 这一步，是展示最后一次选择的csv文件
        } else {
          this.fileList = [];
        }
      }
    }
  },
  components: {
    modal_table: ModalTable
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
