<!--
 * @Author: your name
 * @Date: 2020-03-19 14:24:27
 * @LastEditTime: 2020-04-11 20:31:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\components\User\UserDetail.vue
 -->

<template>
  <div style="width:100%;display: inline;">
    <div class="all-container" style="width:75%;float:left;">
      <div class="all-container-padding bg">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <el-form
              :model="userlist"
              :rules="rules"
              ref="EditorUserForms"
              class="form-style"
            >
              <el-form-item
                class="avatar-padding"
                label="头像"
                prop="picture"
                :label-width="formLabelWidth"
              >
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :before-upload="beforeupload"
                  :data="uploadParm"
                  :show-file-list="false"
                  :drag="true"
                  :auto-upload="false"
                  :on-change="uploadFile"
                  :on-success="handleUpSuccess"
                >
                  <img
                    v-if="userlist.picture"
                    :src="userlist.picture"
                    class="avatar"
                    :key="reflesh"
                  />
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon "
                    style="width:80px;height:80px;"
                  ></i>
                </el-upload>
              </el-form-item>
              <el-form-item
                label="昵称"
                placeholder="请输入昵称"
                prop="nickname"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.nickname"></el-input
                ></el-col>
              </el-form-item>
              <el-form-item
                label="姓名"
                placeholder="请输入姓名"
                prop="name"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.name"></el-input
                ></el-col>
              </el-form-item>
              <el-form-item
                label="QQ号"
                placeholder="请输入QQ号"
                prop="qqnumber"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.qqnumber"></el-input
                ></el-col>
              </el-form-item>
              <el-form-item
                label="电话"
                placeholder="请输入电话"
                prop="phone"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input
                    v-model="userlist.phone"
                    placeholder="请输入电话"
                  ></el-input
                ></el-col>
              </el-form-item>
              <el-form-item
                label="邮箱"
                prop="email"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input
                    v-model="userlist.email"
                    placeholder="请输入邮箱"
                    disabled
                  ></el-input
                ></el-col>
              </el-form-item>
              <el-form-item
                label="用户角色"
                prop="type"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.type" disabled></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="积分"
                prop="score"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.score" disabled></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="籍贯"
                prop="natives"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.natives"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="生日"
                prop="birthday"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <!-- <el-input v-model="userlist.birthday"></el-input> -->
                  <el-date-picker
                    v-model="userlist.birthday"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item
                label="性别"
                prop="sex"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.sex"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="学历"
                prop="degree"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.degree"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="专业"
                prop="major"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input v-model="userlist.major"></el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="EditorUserClick('userlist')"
                >保存</el-button
              >
              <el-button type="primary" @click="GoBack">返回</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="second">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item
                label="原密码"
                prop="pass"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input
                    v-model="ruleForm.pass"
                    placeholder="请输入原密码"
                    type="password"
                  ></el-input
                ></el-col>
              </el-form-item>
              <el-form-item
                label="新密码"
                prop="newpass"
                :label-width="formLabelWidth"
              >
                <el-col :span="8"
                  ><el-input
                    v-model="ruleForm.newpass"
                    placeholder="请输入新密码"
                    id="newkey"
                    type="password"
                  ></el-input
                ></el-col>
              </el-form-item>
              <el-form-item
                label="重复新密码"
                prop="checknewpass"
                :label-width="formLabelWidth"
              >
                <el-col :span="8">
                  <el-input
                    v-model="ruleForm.checknewpass"
                    placeholder="请再次输入新密码"
                    id="newkey1"
                    type="password"
                  ></el-input
                ></el-col>
              </el-form-item>
            </el-form>
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="submitForm('ruleForm')"
                >保存</el-button
              >
              <el-button type="primary" @click="GoBack">返回</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div style="width:25%;float:left;">
      <user_rank></user_rank>
    </div>
    <div class="showmodal">
      <h3 style="margin:20px 20px;">勋章墙</h3>
      <div>
        <img
          src="../../assets/img/modal1.png"
          alt="金牌勋章"
          style="width:300px;height:225px; -webkit-filter: grayscale(100%); "
          v-if="!modals.金牌勋章"
        />
        <img
          src="../../assets/img/modal1.png"
          alt="金牌勋章"
          style="width:300px;height:225px;"
          v-else
        />
      </div>
      <div>
        <img
          src="../../assets/img/modal2.png"
          alt="银牌勋章"
          v-if="!modals.银牌勋章"
          style="width:300px;height:225px; -webkit-filter: grayscale(100%);"
        />
        <img
          src="../../assets/img/modal2.png"
          alt="银牌勋章"
          v-else
          style="width:300px;height:225px"
        />
      </div>
      <div>
        <img
          src="../../assets/img/modal3.png"
          alt="铜牌勋章"
          v-if="!modals.铜牌勋章"
          style="width:300px;height:225px; -webkit-filter: grayscale(100%);"
        />
        <img
          src="../../assets/img/modal3.png"
          alt="铜牌勋章"
          v-else
          style="width:300px;height:225px;"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UserRank from "./RankList/UserRank";
import { getuuid } from "../../utils/utils";
import { getBase64 } from "../../utils/utils";
import { concatGetUrl } from "../../utils/utils";
import { getRequest } from "../../utils/api";
import { postRequest } from "../../utils/api";
import { formatDate } from "../../utils/utils";
export default {
  components: {
    user_rank: UserRank,
  },
  data() {
    /*****检验两次密码是否一致***/
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checknewpass !== "") {
          this.$refs.ruleForm.validateField("checknewpass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      uploadParm: {}, //图片的上传
      ruleForm: {}, //修改密码的表单
      activeName: "first",
      loading: true,
      userlist: {}, //用户信息表单
      formLabelWidth: "150px",
      reflesh: false,
      currentEmail: "",
      modals: {},
      /***校验***/
      rules: {
        phone: [
          {
            required: true,
            message: "请输入电话号码",
          },
          {
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: "手机格式不对",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入电子邮箱",
          },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
            message: "请输入有效的邮箱",
          },
        ],

        pass: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码",
          },
        ],

        newpass: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        checknewpass: [
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    //返回上一页
    GoBack() {
      this.$router.go(-1);
    },
    //获取个人用户的信息
    getUser() {
      this.currentEmail = localStorage.getItem("email");
      let type = localStorage.getItem("type");
      getRequest(
        "/user/queryUserByPrimary?email=" + this.currentEmail + "&type=" + type
      ).then((resp) => {
        if (resp.status == 200) {
          console.log(resp.data);
          this.userlist = resp.data;
          console.log(this.userlist);
        }
      });
      getRequest("/user/queryUserModal/" + localStorage.getItem("userId")).then(
        (resp) => {
          this.modals = resp.data;
          console.log(this.modals);
        }
      );
    },
    //tab切换
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //上传之前
    beforeupload(file) {
      this.uploadParm.key = this.uploadParm.dir + getuuid();
      console.log(this.uploadParm);
    },
    //上传图片
    uploadFile(file) {
      getBase64(file.raw).then((res) => {
        this.userlist.picture = res;
        console.log(res);
        //实现图片的实时刷新
        this.reflesh = !this.reflesh;
      });
    },

    //图片上传上传成功
    handleUpSuccess() {},
    //修改密码
    submitForm(ruleForm) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var obj = {
            email: this.currentEmail,
            oldPwd: this.ruleForm.pass,
            newPwd: this.ruleForm.newpass,
            type: localStorage.getItem("type"),
          };
          //保存信息
          var url = concatGetUrl(obj, "/user/updateUserPass");
          console.log(url);
          getRequest(url).then((resp) => {
            if (resp.status == 200) {
              if (resp.data.data == "true") {
                this.$message({
                  message: "修改成功",
                  duration: 1500,
                  type: "success",
                });
              } else {
                this.$message({
                  message: "输入的旧密码错误",
                  duration: 1500,
                  type: "error",
                });
              }
            } else {
              this.$alert("找不到服务器⊙﹏⊙∥!", "修改失败!");
            }
          });
        }
      });
    },
    // 编辑提交的方法
    EditorUserClick() {
      this.$refs.EditorUserForms.validate((valid) => {
        if (valid) {
          this.userlist.birthday = formatDate(this.userlist.birthday);
          console.log(this.userlist);
          //保存信息
          postRequest(
            "/user/updateUserInfo",
            JSON.stringify(this.userlist)
          ).then((resp) => {
            if (resp.status == 200) {
              this.$message({
                message: "修改成功",
                duration: 1500,
                type: "success",
              });
              this.$router.go(-1);
            } else {
              this.$message({
                message: "修改失败",
                duration: 1500,
                type: "error",
              });
            }
          });
        } else {
          this.$message({
            message: "请检查输入的用户信息",
            duration: 1000,
            type: "warning",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.warp-breadcrum {
  height: 40px;
  margin-top: 5px;
  margin-left: 2px;
}
.warp-main {
  margin-top: 40px;
  /* margin-left: 200px; */
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
div /deep/ .el-upload-dragger {
  width: 178px;
  height: 178px;
}
.avatar {
  width: 178px;
  height: 178px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.showmodal {
  display: flex;
  float: left;
  width: 100%;
  border-radius: 15px;
  background-clip: padding-box;
  padding: 35px -20px 15px 35px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.form-style {
  display: flex;
  float: left;
  flex-wrap: wrap;
}
div /deep/.el-input__inner {
  width: 200px;
}
.avatar-padding {
  padding-right: 50%;
}
div /deep/ .el-date-editor.el-input {
  width: 200px;
}
</style>
