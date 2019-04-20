<template>
  <div class="login_container">
    <div class="box">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="iconfont icon-account"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-eye-slash "
            v-model="form.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">登录</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const {
            data: { data, meta }
          } = await this.$http.post("login", this.form);
          if (meta.status !== 200)
            return this.$message.error(meta.msg || "登陆失败");
          sessionStorage.setItem("token", data.token);
          this.$router.push("/home");
        }
      });
    }
  },
};
</script>
<style scoped>
.login_container {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ccc, #5fb7c7);
}
.login_container .box {
  width: 400px;
  height: 250px;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  border-radius: 4px;
  background: linear-gradient(45deg, #d2ecf1, #efefef);
  padding: 0 15px;
  box-sizing: border-box;
}
</style>
