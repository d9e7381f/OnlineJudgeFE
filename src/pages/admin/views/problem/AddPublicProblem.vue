<template>
  <div>
    <div style="float: right;margin-top: -20px;">
      <el-cascader
            size="small"
            :options="courseList"
            :props="cascaderprops"
            @change="handleCourseChange"
            placeholder="课程筛选" clearable></el-cascader>
    </div>

    <el-table :data="problems" v-loading="loading">
      <el-table-column
        label="ID"
        width="100"
        prop="id">
      </el-table-column>
      <el-table-column
        label="展示ID"
        width="200"
        prop="_id">
      </el-table-column>
      <el-table-column
        label="题目"
        prop="title">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="添加"
                    @click.native="handleAddProblem(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getProblemList"
      :page-size="limit"
      :total.sync="total"
      :current-page.sync="page"
      >
    </el-pagination>
  </div>
</template>
<script>
  import utils from '@/utils/utils'
  import api from '@admin/api'

  export default {
    name: 'add-problem-from-public',
    props: ['contestID'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        problems: [],
        courseList: [],
        cascaderprops: {
          value: 'id',
          label: 'name'
        },
        query: {
          course: ''
        },
        contest: {}
      }
    },
    mounted () {
      this.getCourse()
      api.getContest(this.contestID).then(res => {
        this.contest = res.data.data
        this.getProblemList()
      }).catch(() => {
      })
    },
    methods: {
      pushRouter (page = 1) {
        this.loading = true
        let params = {
          offset: (page - 1) * this.limit,
          limit: this.limit,
          in_course: true,
          is_valid: true,
          course_id: this.query.course,
          rule_type: this.contest.rule_type
        }
        api.getProblemList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.problems = res.data.data.results
        }).catch(() => {})
      },
      getCourse () {
        api.getCourse().then(res => {
          this.courseList = res.data.data.course
          utils.deleteEmptyChildren(this.courseList)
        }).catch(() => {})
      },
      handleCourseChange (value) {
        this.query.course = value[ value.length - 1 ]
        this.page = 1
        this.pushRouter(this.page)
      },
      getProblemList (page = 1) {
        this.page = page
        this.loading = true
        let params = {
          offset: (page - 1) * this.limit,
          limit: this.limit,
          in_course: true,
          is_valid: true,
          course_id: this.query.course,
          rule_type: this.contest.rule_type
        }
        api.getProblemList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.problems = res.data.data.results
        }).catch(() => {})
      },
      // 处理添加题目
      handleAddProblem (problemID) {
        let data = {
          problem_id: problemID,
          contest_id: this.contestID
        }
        api.addContestProblemFromEdu(data).then(() => {
          this.$emit('on-change')
        }, () => {}).catch(() => {})
      }
    }
  }
</script>
<style scoped>
  .page {
    margin-top: 20px;
    text-align: right
  }

</style>
