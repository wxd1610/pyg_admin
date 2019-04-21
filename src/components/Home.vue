<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <el-button icon="iconfont icon-menu" @click="toggleMenu()" size="mini" circle></el-button>
      <span class="title">品优购后台管理系统</span>
      <el-button class="logout" type="danger" size="mini" round>退出</el-button>
    </el-header>
    <el-container>
      <el-aside class="home_aside" :width="collapse?'65px':'180px'" >
        <el-menu
          :collapse="collapse"
          :collapse-transition="false"
          style="border: none; margin-top: 5px"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1" v-for="item in menus" :key="item.id" unique-opened="true">
            <template slot="title" >
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="item1 in item.children" :key="item1.id">{{item1.authName}}</el-menu-item>
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
    return {
      collapse: false,
      menus: []
      // list :[]
    };
  },
  mounted() {
    // 获取菜单数据
    this.getData();
  },
  methods: {
    toggleMenu() {
      this.collapse = !this.collapse;
    },
    getData() {
      // 获取数据
      this.$http.get("menus").then(res => {
        console.log(res.data);
        this.menus = res.data.data;
      });
    }
    // axios.get('/home')
  }
};
</script>

<style scoped>
.home_container {
  height: 100%;
}
.home_header {
  background: #373d41;
  line-height: 60px;
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
  padding-left: 20px;
}
.logout {
  float: right;
  margin-top: 15px;
}
</style>
