<template>
  <div class = "login-wrap">
    <el-form label-position = "top" :model = "user" status-icon :rules = "rules" ref = "ruleForm"
             label-width = "100px"
             class = "demo-ruleForm login-from">
      <h2 class = "login-title">用户登录</h2>
      <el-form-item label = "用户名" prop = "username">
        <el-input type = "text" v-model = "user.username" autocomplete = "off"></el-input>
      </el-form-item>
      <el-form-item label = "密码" prop = "password">
        <el-input type = "password" v-model = "user.password" autocomplete = "off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class = "login-btn" type = "primary" @click = "login('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    login(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$http.post('login', this.user)
            .then(res => {
              var { data, meta } = res.data
              if (meta.status === 200) {
                this.$message({
                  message: '你已成功登录',
                  type: 'success'
                })
                window.localStorage.setItem('token', data.token)
                this.$router.push({name: 'index'})
              } else {
                this.$message.error('登录失败,请重新登录')
              }
            })
        } else {
          this.$message.error('数据不合法,请重新输入')
        }
      })
    }
  }
}
</script>
<style>
  .login-wrap {
    background-color : #324152;
    height           : 100%;
    display          : flex;
    justify-content  : center;
    align-items      : center;
  }

  .login-wrap .login-from {
    background-color : #fff;
    width            : 400px;
    padding          : 30px;
    border-radius    : 5px;
  }

  .login-wrap .login-from .login-title {
    width      : 100%;
    color      : #303133;
    text-align : center;
  }

  .login-wrap .login-from .login-btn {
    width : 100%;
  }
</style>
