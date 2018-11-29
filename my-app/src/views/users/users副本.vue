<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <el-card class="cardMargin">
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
            <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="add" plain>新增</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column prop="mg_state" label="状态" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="sChange(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <!-- scope数据源中的数据对象：得到数据： scope.row -->
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)" size="mini" plain></el-button>
          <el-button type="danger" @click="del(scope.row.id)" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="warning" @click="roles(scope.row.id)" icon="el-icon-check" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="numChange" @size-change="sizeChange" :current-page="pagenum" :page-sizes="pagesizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="添加用户" :visible.sync="dialogAddVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="AddLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="AddLabelWidth">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="email" :label-width="AddLabelWidth">
          <el-input type="text" v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="AddLabelWidth">
          <el-input type="text" v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改面板 -->
    <el-dialog title="修改用户" :visible.sync="dialogEditVisible">
      <el-form :model="editForm">
        <el-form-item label="用户名" :label-width="AddLabelWidth">
          <el-input disabled v-model="editForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="email" :label-width="AddLabelWidth">
          <el-input type="text" v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="AddLabelWidth">
          <el-input type="text" v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="ediSubmit">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
      <el-form :model="roleObj">
        <el-form-item label="当前用户" :label-width="roleLabelWidth">
          {{ roleObj.username }}
        </el-form-item>
        <el-form-item label="选择角色" :label-width="roleLabelWidth">
          <el-select v-model="roleObj.rid" placeholder="请选择">
            <el-option label="请选择角色" :value="-1">
            </el-option>
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">分配角色</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 这个数据应该来自于服务器
      // 在页面打开进行加载：created() mounted()
      tableData: [
      ],
      // 设置默认的当前页
      pagenum: 1,
      // 设置默认的页容量
      pagesize: 10,
      // 设置数据的部条数
      total: 0,
      // 设置搜索的数据
      query: '',
      // 设置页容量数组
      pagesizes: [10, 20, 30, 40],
      // 用来控制新增对话框的显示和隐藏
      dialogAddVisible: false,
      // 用来控制修改对话框的显示和隐藏
      dialogEditVisible: false,
      // 用来控制分配角色对话框的显示和隐藏
      dialogRoleVisible: false,
      // 设置表单元素的标题的宽度
      AddLabelWidth: '100px',
      roleLabelWidth: '140px',
      // 实现新增对话框中的数据源
      form: {
        name: '',
        password: '',
        email: '',
        phone: ''
      },
      // 创建一个用修改的对象
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 设置一个加载等待效果
      loading: true,
      // 接收所有的角色列表数据
      rolesList: [],
      // 修改角色的对象
      roleObj: {
        id: '',
        rid: '',
        username: ''
      }
    }
  },
  methods: {
    // 得到所有的数据
    getTableData() {
      // 通过异步请求得到数据
      // 将来除了login路径以外所有的请求都必须在请求头中带上一个token：Authorization
      this.$http({
        url: 'users',
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        },
        params: { // 用来传递参数
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.query
        }
      }).then(res => {
        // 解构
        var { data, meta } = res.data
        // 判断
        if (meta.status === 200) {
          // 将data中的数据赋值tableData
          // data: {pagenum: '',total: '',users}
          // 关闭加载组件
          this.tableData = data.users
          setTimeout(() => {
            this.loading = false
            // 得到数据的
            this.total = data.total
          }, 1000)
        }
      })
    },
    // 当前页改变的事件
    numChange(val) {
      // val：对应的就是当前页面，它就是我们设置pagenum
      this.pagenum = val
      // 由于当前页面发生了改变，数据需要重新得到
      this.getTableData()
    },
    // 页容量改变的事件
    sizeChange(val) {
      // 这里得到的val就是我们pagesize
      this.pagesize = val
      // 重新得到数据
      this.getTableData()
    },
    // 搜索的事件
    search() {
      // 重新调用方法得到数据
      this.getTableData()
    },
    // 状态改变的事件
    sChange(row) {
      // 将最新的状态得到后提交到服务器
      // /users/:uId/state/:type
      //  :uId: 是要修改状态对象的id
      //    row.id
      //  :type：是要修改状态对象的状态
      //    row.mg_state
      // 最新的状态
      this.$http({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: 'put',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        var { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            message: '状态修改成功',
            type: 'success'
          })
        } else {
          this.$message.error('状态修改失败')
        }
      })
    },
    // 删除的事件
    del(id) {
      // 掉用一下删除的接口就OKEY了
      // api: users/:id
      this.$confirm('您确定要删除吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定删除
        this.$http({
          url: 'users/' + id,
          method: 'delete',
          headers: {
            'Authorization': window.localStorage.getItem('token')
          }
        }).then(res => {
          var { meta } = res.data
          if (meta.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // 更新数据
            this.getTableData()
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => {
        // 取消删除
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增的事件:打开新增面板
    add() {
      this.dialogAddVisible = true
    },
    // 新增的事件：提交新增的参数
    addSubmit() {
      // 提交参数
      this.$http({
        url: 'users',
        method: 'post',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        },
        data: {
          username: this.form.name,
          password: this.form.password,
          email: this.form.email,
          mobile: this.form.phone
        }
      }).then(res => {
        var { meta } = res.data
        if (meta.status === 201) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
        // 关闭新增面板
        this.dialogAddVisible = false
        // 将面板中内容清空
        for (var item in this.form) {
          this.form[item] = ''
        }
      })
    },
    // 修改的事件：打开修改面板
    edit(row) {
      this.dialogEditVisible = true
      // 将要修改的数据填充到修改面板中
      // 使用row中的属性给form对象赋值
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 修改的事件：提交修改的参数
    ediSubmit() {
      this.$http({
        url: 'users/' + this.editForm.id,
        method: 'put',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        },
        data: {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }
      }).then(res => {
        var { meta } = res.data
        if (meta.status === 200) {
          // 更新数据
          this.getTableData()
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
        // 关闭对话框
        this.dialogEditVisible = false
      })
    },
    // 分配角色：将当前用户的角色显示在面板中
    roles(id) {
      // 打开一个面板
      this.dialogRoleVisible = true
      this.getRolesList()
      // 根据id得到用户信息
      this.$http({
        url: 'users/' + id,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        var { data, meta } = res.data
        if (meta.status === 200) {
          this.roleObj.id = data.id
          this.roleObj.rid = data.rid
          this.roleObj.username = data.username
        }
      })
    },
    // 得到角色列表
    getRolesList() {
      this.$http({
        url: 'roles',
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        var { data, meta } = res.data
        if (meta.status === 200) {
          // 将数据赋值到rolesList中
          this.rolesList = data
          // 将数据绑定到下拉框中
        } else {
          this.$message.error('获取角色列表失败')
        }
      })
    },
    // 设置角色
    setRole() {
      this.$http({
        url: `users/${this.roleObj.id}/role`,
        method: 'put',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        },
        data: {
          rid: this.roleObj.rid
        }
      }).then(res => {
        var { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            message: '角色设置成功',
            type: 'success'
          })
        } else {
          this.$message.error('角色设置失败')
        }
        // 关闭对话框
        this.dialogRoleVisible = false
      })
    }
  },
  mounted() {
    // 得到所有的数据
    this.getTableData()
  }
}
</script>

<style>
  .cardMargin {
    margin: 10px 0px;
  }
</style>
