<template>
  <el-container class="home-container">
    <el-header
      ><div>
        <img src="../assets/logo.png" alt="" width="60px" height="60px" /><span
          >电商后台管理系统</span
        >
      </div>
      <el-button type="info" plain @click="logout">退出</el-button></el-header
    >
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'"
        ><div class="toggle-button" @click="toggleClick">
          <i v-if="isCollapse" class="el-icon-caret-right"></i>
          <i v-else class="el-icon-caret-left"></i>
        </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="isCollapse"
          :default-active="activePath"
          router
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
            ><template slot="title">
              <i :class="iconList[item.id]" style="margin-right: 15px"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + child.path"
              v-for="child in item.children"
              :key="child.id"
              @click="saveNavState('/' + child.path)"
            >
              <template slot="title">
                <i class="el-icon-menu" style="margin-right: 15px"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu></el-aside
      >
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  data() {
    return {
      menuList: [],
      iconList: {
        125: "el-icon-user-solid",
        103: "el-icon-s-help",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-picture",
      },
      isCollapse: false,
      activePath: "",
    };
  },
  methods: {
    logout() {
      //清除token
      window.sessionStorage.clear();
      //回到登录界面
      this.$router.push("/login");
    },
    getMenuList() {
      this.$axios({
        method: "get",
        url: "/menus",
      })
        .then((res) => {
          console.log(res.data);
          this.menuList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toggleClick() {
      return (this.isCollapse = !this.isCollapse);
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #5e7788;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}

.toggle-button {
  background-color: #495065;
  text-align: center;
  cursor: pointer;
}
</style>