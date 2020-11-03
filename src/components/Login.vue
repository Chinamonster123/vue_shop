<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box"><img src="../assets/logo.png" alt="" /></div>
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"
            ><i slot="prefix" class="el-input__icon el-icon-user"></i
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password"
            ><i slot="prefix" class="el-input__icon el-icon-lock"></i
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/login",
            data: this.loginForm,
          }).then((res) => {
            if (res.data.meta.status !== 200) {
              return alert("用户或密码错误");
            } else {
              window.sessionStorage.setItem("token", res.data.data.token);
              this.$router.push("/home");
            }
          });
        }
      });
    },
  },
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名字", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>