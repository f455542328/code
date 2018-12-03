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
          <el-button type="success" @click="add" plain>+新增</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table  :data="dataList" border style="width: 100%">
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
          <el-switch  v-model="scope.row.mg_state" @change="sChange(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <!-- scope数据源中的数据对象：得到数据： scope.row -->
          <el-button type="primary" icon="el-icon-edit" v-model="scope.row"  @click="edit(scope.row)" size="mini" plain></el-button>
          <el-button type="danger" v-model="scope.row.id" @click="del(scope.row.id)" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="warning" icon="el-icon-check" @click="roels(scope.row.id)" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加用户" :visible.sync="dialogAddVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="AddLabelWidth">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="AddLabelWidth">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="email" :label-width="AddLabelWidth">
          <el-input type="text" v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="AddLabelWidth">
          <el-input type="text" v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑用户-->
    <el-dialog title="编辑用户" :visible.sync="dialogEditVisible">
      <el-form :model="editForm">
        <el-form-item  label="用户名" :label-width="AddLabelWidth">
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
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改角色-->
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
    <!--分页-->
    <el-pagination
    @size-change="sizeChange"
    @current-change="numChange"
    :current-page="pagenum"
    :page-sizes="pagesizes"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 修改面板 -->
    <!-- 分配角色 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: [],
      rolesList: [],
      query: '',
      pagenum: 1,
      pagesize: 10,
      pagesizes: [10, 20, 40],
      total: 0,
      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogRoleVisible: false,
      AddLabelWidth: '100px',
      roleLabelWidth: '100px',
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      roleObj: {
        username: '',
        id: '',
        rid: ''
      }
    }
  },
  methods: {
    // 得到所有的数据
    getDataList() {
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
          this.dataList = data.users
          setTimeout(() => {
            this.loading = false
            // 得到数据的
            this.total = data.total
          }, 1000)
        }
      })
    },
    numChange(val) {
      this.pagenum = val
      this.getDataList()
    },
    sizeChange(val) {
      this.pagesize = val
      this.getDataList()
    },
    search() {
      this.getDataList()
    },
    del(id) {
      this.$confirm('此操作将删除该用户,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: `users/${id}`,
          method: 'delete',
          headers: {
            'Authorization': window.localStorage.getItem('token')
          }
        }).then(res => {
          let {meta} = res.data
          if (meta.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message.error(meta.msg)
          }
          this.getDataList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    sChange(row) {
      this.$http({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: 'put',
        headers: {

        }
      }).then(res => {
        let {meta} = res.data
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    add() {
      this.dialogAddVisible = true
    },
    addSubmit() {
      this.$http({
        url: 'users',
        method: 'post',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        },
        data: {
          username: this.form.username,
          password: this.form.password,
          email: this.form.password,
          mobile: this.form.mobile
        }
      }).then(res => {
        let {meta} = res.data
        if (meta.status === 201) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
        this.dialogAddVisible = false
        for (var item in this.form) {
          this.form[item] = ''
        }
        this.getDataList()
      })
    },
    edit(row) {
      this.dialogEditVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    editSubmit() {
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
        let {meta} = res.data
        if (meta.status === 200) {
          this.getDataList()
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
        this.dialogEditVisible = false
        for (var item in this.form) {
          this.editForm[item] = ''
        }
      })
    },
    roels(id) {
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
  mounted: function () {
    // 得到所有的数据
    this.getDataList()
  }
}
</script>

<style>
  .cardMargin {
    margin: 10px 0px;
  }
</style>
