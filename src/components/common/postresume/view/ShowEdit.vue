<template>
  <div class="document">
    <Header />
    <el-row id="resume" class="main">
      <el-col :span="24">
        <el-row class="row">
          <el-col>
            <h1 style="font-weight: bold">{{ this.content.baseMsg.name }}</h1>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="24">
            <span class="tag">电话：</span>{{ this.content.baseMsg.phone }} |
            <span class="tag">邮箱：</span>{{ this.content.baseMsg.email }} |
            <span class="tag">地址：</span>{{ this.content.baseMsg.address }}
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="24">
            <span class="tag">个人网址：</span>{{ this.content.baseMsg.web }} |
            <span class="tag">wechat：</span> weixin1899855881
          </el-col>
        </el-row>
        <el-row class="row skill">
          <el-col>
            <h2 class="title">专业技能</h2>
            <hr />
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <mavon-editor
              class="mavon-editor"
              v-html="content.skillMsg"
              :boxShadow="false"
            />
          </el-col>
        </el-row>
        <el-row class="row intern">
          <el-col>
            <h2 class="title">实习/工作经历</h2>
            <hr />
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in content.internMsg" :key="index">
          <el-col>
            <div class="intern-header">
              <span>{{ item.comName }}</span>
              <span class="intern-position">{{ item.comPosition }}</span>
              <span class="intern-time">
                {{ item.dateStart }} 至 {{ item.dateEnd }}
              </span>
            </div>
          </el-col>
          <el-col>
            <mavon-editor
              class="mavon-editor"
              v-html="item.internValue"
              :boxShadow="false"
            />
          </el-col>
        </el-row>
        <el-row class="row project">
          <el-col>
            <h2 class="title">项目经历</h2>
            <hr />
          </el-col>
        </el-row>
        <el-row v-for="item in content.projectMsg" :key="item.proName">
          <el-col>
            <div class="intern-header">
              <span> {{ item.proName }} </span>
              <span class="intern-position"> {{ item.proPosition }} </span>
              <span class="intern-position"> {{ item.proPartment }} </span>
              <span class="intern-time">
                {{ item.dateStart }} 至 {{ item.dateEnd }}
              </span>
            </div>
          </el-col>
          <el-col>
            <mavon-editor
              class="mavon-editor"
              v-html="item.proValue"
              :boxShadow="false"
            />
          </el-col>
        </el-row>

        <el-row class="row education">
          <el-col>
            <h2 class="title">教育经历</h2>
            <hr />
          </el-col>
        </el-row>
        <el-row v-for="item in content.educationMsg" :key="item.eduSchoolName">
          <el-col>
            <div class="intern-header">
              <span> {{ item.eduSchoolName }} </span>
              <span class="intern-position"> {{ item.eduProfession }} </span>
              <span class="intern-position"> {{ item.eduSecCollege }} </span>
              <span class="intern-time">
                {{ item.dateStart }} 至 {{ item.dateEnd }}
              </span>
            </div>
          </el-col>
          <el-col>
            <mavon-editor
              class="mavon-editor"
              v-html="item.eduValue"
              :boxShadow="false"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="btn">
      <el-col>
        <el-button type="danger" size="mini" @click="handleUpload"
          >简历上传</el-button
        >
        <!-- <el-button type="danger" size="mini" @click="handleWindowPrint">PDF 预览</el-button> -->
        <el-button type="danger" size="mini" @click="handleDown"
          >PDF 下载</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Header from "../Header.vue";
import htmlToPdf from "../../../../utils/htmlToPdf";
import { async } from "q";
import { postRequest } from "../../../../utils/api";

export default {
  components: {
    Header
  },
  data() {
    return {
      content: "",
      value: ""
    };
  },
  methods: {
    fetchData() {
      this.content = this.$store.state;
    },

    handleUpload() {
      let _this = this;
      this.$prompt("请输入标题", "编辑", {
        confirmButtonText: "上传",
        // inputValue: '',
        cancelButtonText: "取消"
      }).then(({ value }) => {
        //value就是输入值
        if (value == null || value.length == 0) {
          _this.$message({
            type: "info",
            message: "标题不能为空!"
          });
        } else {
          _this.loading = true;
          console.log(JSON.stringify(this.content));
          postRequest("/resume/uploadResume/", JSON.stringify(this.content)).then(
            resp => {
              if (resp.status == 200) {
                _this.$message({
                  type: "success",
                  message: "简历上传成功",
                  duration: 1500
                });
                if (localStorage.getItem("type") == "普通用户") {
                  _this.$router.replace("/home");
                }else{
                  _this.$router.replace("/adminhome")
                }
              }
            },
            resp => {
              if (resp.status == 403) {
                _this.$message({
                  type: "error",
                  message: resp.data
                });
              }
              _this.loading = false;
            }
          );
        }
      });
    },

    handleDown() {
      htmlToPdf.downloadPDF(document.querySelector("#resume"));
    },

    //浏览器方式打印
    handleWindowPrint() {
      document.body.innerHTML = document.querySelector("#resume").outerHTML;
      //转异步 等待dom元素渲染（样式）完毕在打印
      setTimeout(() => {
        //打印
        window.print();
        //刷新页面
        window.location.reload();
      }, 20);
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
.btn {
  margin: 10px;
  text-align: center;
}
.intern-time {
  float: right;
  margin-right: 20px;
}
.intern-position {
  margin-left: 20px;
}
.intern-header {
  text-align: left;
  font-size: 14px;
  font-weight: 800;
  margin-left: 20px;
  padding-bottom: 5px;
}
.mavon-editor {
  margin: 0 20px;
  margin-bottom: 5px;
  padding: 5px 0px;
  padding-left: 20px;
  width: 90%;
  border: none;
  min-height: 100px;
}
.tag {
  font-weight: bold;
}
.skill,
.intern,
.project,
.education .title {
  font-weight: bold;
}
.skill,
.intern,
.project,
.education {
  text-align: left;
  display: block;
}
.document {
  width: 100%;
  overflow: hidden;
}
.main {
  text-align: center;
  margin: 20px;
  margin-left: 120px;
  padding: 10px;
  max-width: 1200px;
  background: #fefefe;
}
.row {
  margin: 0 10px;

  /* border: 1px solid green;  */
  padding: 5px 10px;
}
</style>
