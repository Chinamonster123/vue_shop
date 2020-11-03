<template>
  <div><el-button type="info" plain @click="logout">退出</el-button></div>
</template>

<script>
export default {
  methods: {
    logout() {
      //清除token
      window.sessionStorage.clear();
      //回到登录界面
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
</style>