<template>
  <div class="register">
    <div class="content">
      <div class="head">
        <ul>
          <li>
            <router-link to="/">
              <i class="fa fa-user-o" aria-hidden="true"></i>返回登录
            </router-link>
          </li>
          <li><i class="fa fa-question-circle" aria-hidden="true"></i>帮助</li>
        </ul>
      </div>
      <div class="part">
        <h1>SmartResume</h1>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm form1"
          v-loading="loading"
        >
          <el-form-item label="昵称：" prop="nickname">
            <el-input v-model="ruleForm.nickname"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="QQ号：" prop="qqnumber">
            <el-input v-model="ruleForm.qqnumber"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码：" prop="dbpassword">
            <el-input v-model="ruleForm.dbpassword" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="registerBtn"
              @click="submitForm('ruleForm')"
              >注册</el-button
            >
            <el-button type="primary" @click="resetForm('ruleForm')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.register {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  background: #fff;
  text-align: center;
}
.register .head {
  line-height: 50px;
  padding-right: 100px;
  background: #20a0ff;
  text-align: right;
  border-bottom: 1px solid #f1f1f1;
}
.register .head ul li {
  list-style: none;
  display: inline-block;
  margin-left: 30px;
  color: #fff;
  font-size: 14px;
}
.register .head a {
  color: #fff;
  text-decoration: none;
}
.register .head ul li:last-child {
  margin-right: 100px;
}
.register .head ul li i {
  margin-right: 10px;
}
.register .part {
  width: 780px;
  margin: 0 auto;
  text-align: center;
}
.register .part h1 {
  width: 100%;
  font-family: "华文行楷";
  font-size: 30px;
  color: #20a0ff;
  line-height: 50px;
  margin-left: 35px;
  margin-top: 25px;
}
.register .part .form1 /deep/ {
  width: 500px;
  margin: 0 auto;
  margin-top: 20px;
  color: black;
}
.register .part .registerBtn {
  margin-right: 50px;
}
</style>
<script>
import { getRequest } from "../../utils/api";
import { postRequest } from "../../utils/api";
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入昵称"));
      } else {
        if (value.length >= 3 && value.length <= 10) {
          callback();
        } else {
          callback(new Error("长度在3到10个字符之间"));
        }
      }
    };
    var validateNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入电话号码"));
      } else {
        var reg1 = /^[0-9]{11}$/;
        if (!reg1.test(value)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }
    };
    var validateMail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入联系邮箱"));
      } else {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!reg.test(value)) {
          callback(new Error("输入的联系邮箱必须包含@"));
        } else {
          getRequest("/user/checkRegister?email=" + value).then(resp => {
            if (resp.status == 200) {
              //成功
              var json = resp.data.data;
              console.log(json);
              console.log(json == "false");
              if (json == "false") {
                callback(new Error("输入的邮箱已被注册"));
              } else {
                callback();
              }
            } else {
              callback();
            }
          });
        }
      }
    };
    var validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入QQ号"));
      } else {
        callback();
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        if (this.ruleForm.dbpassword !== "") {
          this.$refs.ruleForm.validateField("dbpassword");
        }
        callback();
      }
    };
    var validatedbPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        nickname: "",
        phone: "",
        email: "",
        qqnumber: "",
        password: "",
        dbpassword: ""
      },
      rules: {
        nickname: [{ validator: validateName, trigger: "blur" }],
        phone: [{ validator: validateNum, trigger: "blur" }],
        email: [{ validator: validateMail, trigger: "blur" }],
        qqnumber: [{ validator: validateUserName, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        dbpassword: [{ validator: validatedbPass, trigger: "blur" }]
      },
      loading: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(JSON.stringify(this.ruleForm));
          this.loading = true;
          postRequest("/user/userRegister", JSON.stringify(this.ruleForm)).then(
            resp => {
              if (resp.status == 200) {
                this.$message({"message":"注册成功",duration:1500,type: 'success'});
                this.loading = false;
                this.$router.replace({ path: "/" });
              } else {
                this.loading = false;
                this.$message({"message":"注册失败",type: 'error'});
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
