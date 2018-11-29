<template>
  <el-container class="container">
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Asilder/>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入头部组件
import Header from '@/components/header.vue'
// 引入侧边栏组件
import Asilder from '@/components/asilder.vue'
export default {
  // 当进入这个页面之前需要判断 localStorage，应该通过生命周期中钩子函数来判断
  beforeCreate() {
    let token = window.localStorage.getItem('token')
    if (!token) {
      this.$message.error('对不起,请重新登录')
      this.$router.push({name: 'login'})
    }
  },
  components: {
    Header,
    Asilder
  }
}
</script>

<style>
  .container {
    height: 100%;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    height: 100%;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  .position {
    text-align: left;
  }
</style>
