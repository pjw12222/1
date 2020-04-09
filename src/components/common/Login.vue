<!--
 * @Author: your name
 * @Date: 2020-03-13 16:55:03
 * @LastEditTime: 2020-04-05 11:42:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\components\Login.vue
 -->
<template>
  <div class="login_content">
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="login-container"
      label-position="left"
      label-width="0px"
      v-loading="loading"
    >
      <div class="login_title">
        <ul>
          <li><i class="fa fa-sign-in" aria-hidden="true"></i>登录</li>
          <router-link to="/register" style="text-decoration:none">
            <li><i class="fa fa-user-o" aria-hidden="true"></i>注册</li>
          </router-link>
        </ul>
      </div>
      <el-form-item prop="email">
        <el-input
          type="text"
          v-model="loginForm.email"
          auto-complete="off"
          placeholder="邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <div>
        <el-select
          v-model="loginForm.type"
          placeholder="用户类型"
          style="width: 50%"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-checkbox
          class="login_remember"
          v-model="checked"
          label-position="left"
          >记住密码</el-checkbox
        >
      </div>
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          @click.native.prevent="submitClick"
          style="width: 100%"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { postRequest } from "../../utils/api";
import { getRequest } from "../../utils/api";
import { concatGetUrl } from "../../utils/utils";
export default {
  data() {
    return {
      rules: {
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true,
      loginForm: {
        email: "1563803477@qq.com",
        password: "sang",
        type: "普通用户"
      },
      loading: false,
      options: [
        { lable: 1, value: "普通用户" },
        { lable: 2, value: "系统管理员" }
      ]
    };
  },
  methods: {
    submitClick: function() {
      var _this = this;
      this.loading = true;
      postRequest("/user/login", {
        email: this.loginForm.email,
        password: this.loginForm.password,
        type: this.loginForm.type
      }).then(
        resp => {
          _this.loading = false;
          if (resp.status == 200) {
            //成功
            var json = resp.data.data;
            console.log(json);
            if (json == "true") {
              let obj = {
                email: this.loginForm.email,
                type: this.loginForm.type
              };
              let url = "/user/queryUserIdByEmail";
              url = concatGetUrl(obj, url);
              getRequest(url).then(resp => {
                localStorage.setItem("userId", resp.data.data);
              });
              // 在进入登录首页时设置
              //localStorage.setItem("email", _this.loginForm.email);
              localStorage.setItem("type", _this.loginForm.type);
              if (_this.loginForm.type == "普通用户") {
                _this.$router.replace({
                  path: "/home",
                  query: { role: "user" }
                });
              } else {
                _this.$router.replace({
                  path: "/adminhome",
                  query: { role: "admin" }
                });
              }
            } else {
              _this.$alert("用户名或密码错误⊙﹏⊙∥!", "登录失败!");
            }
          } else {
            //失败
            _this.$alert("登录失败⊙﹏⊙∥!", "登录失败!");
          }
        },
        resp => {
          _this.loading = false;
          _this.$alert("找不到服务器⊙﹏⊙∥!", "登录失败!");
        }
      );
    }
  }
};
</script>
<style>
.login_content {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
  /* display: flex; */
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 130px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  /* display: flex;
  flex-direction: column; */
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: center;
  width: 50%;
}

.login_title ul {
  float: left;
  list-style: none;
  font-size: 18px;
  width: 100%;
  height: 100%;
}

.login_title ul li {
  border-right: 1px solid #666;
  display: inline; /*  将li设置成内联元素就可以了  */
  padding: 5px 5px;
}

.login_title ul li:hover {
  border-right: 1px solid #666;
  display: inline; /*  将li设置成内联元素就可以了  */
  padding: 5px 5px;
  color: #20a0ff;
}

.login_title ul li:last-child {
  /* margin-bottom:-1px ; */
  border-right: none;
}
</style>
