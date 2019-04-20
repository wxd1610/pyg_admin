<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <el-button class="iconfont icon-menu" size="mini"></el-button>
      <span class="title">品优购后台管理系统</span>
      <el-button type="danger" class="logout" size="mini">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse?'65px':'180px'" class="home_asider">
        <el-menu
          :collapse-transition="false"
          :collapse="collapse"
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航三</span>
            </template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home_main">Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  mounted() {
    this.getData();
  },
  methosd: {
    toggleMenu() {
      this.collapse = !this.collapse;
    },
    getData() {
      this.$http.get("menus").then(res => {
        res.data;
      });
    }
  }
};
</script>
<style>
.home_container {
  height: 100%;
  /* background: rgb(168, 116, 116); */
}
.home_header {
  background: #373d41;
}
.home_aside {
  background: #333744;
}
.home_main {
  background: #eaedf1;
}
.title {
color: #ccc;
font-size: 18px;
margin-left: 20px;
line-height: 60px;
}
.logout {
    float: right;
    margin-top: 15px;
}
</style>
