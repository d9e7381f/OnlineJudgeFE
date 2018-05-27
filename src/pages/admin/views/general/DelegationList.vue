<template>
  <div class="view">
    <Panel title="任务列表">
      <el-table
        v-loading="loadingTable"
        element-loading-text="loading"
        ref="table"
        :data="delegationList"
        style="width: 100%;margin-top: 20px;">
        <el-table-column prop="id" label="ID"></el-table-column>

        <el-table-column prop="course" label="课程"></el-table-column>

        <el-table-column prop="delegator.real_name" label="创建者"></el-table-column>

        <el-table-column label="完成者" :key="Math.random()">
          <template slot-scope="scope">
            <el-tag
              style="margin-right:10px"
              v-for="student in scope.row.delegates"
              :key="student.id"
              type="primary">{{student.real_name}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          :key="Math.random()"
          width="200"
          prop="create_time"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.create_time | localtime }}
          </template>
        </el-table-column>

        <el-table-column
          :key="Math.random()"
          fixed="right"
          label="操作"
          width="250">
          <div slot-scope="scope">
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
  </div>
</template>
<script>
import api from '../../api'
export default {
  name: 'delegation-list',
  data () {
    return {
      delegationList: [],
      loadingTable: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      page: {
        limit: 0,
        offset: 0
      }
    }
  },
  methods: {
    currentChange (page) {
      this.currentPage = page
      this.getDelegation(this.currentPage)
    },
    getDelegation (page = 1) {
      this.page.limit = this.pageSize
      this.page.offset = (page - 1) * this.pageSize
      api.getDelegationList(this.page).then(res => {
        this.delegationList = res.data.data.results
        this.total = res.data.data.total
        console.log(this.delegationList)
      })
    }
  },
  mounted () {
    this.getDelegation()
  }

}
</script>
