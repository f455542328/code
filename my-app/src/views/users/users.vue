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
          <el-button type="success" plain>新增</el-button>
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
          <el-button type="primary" icon="el-icon-edit"  size="mini" plain></el-button>
          <el-button type="danger"  icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="warning" icon="el-icon-check" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
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
      query: '',
      pagenum: 1,
      pagesize: 10,
      pagesizes: [10, 20, 40],
      total: 0
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
    sChange(row){
      this.$http({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: 'put',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        var {data, meta} = res.data
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  },
  mounted() {
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
