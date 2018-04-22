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
      @current-change="getEduProblem"
      :page-size="limit"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
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
        contest: {}
      }
    },
    mounted () {
      this.getCourse()
      api.getContest(this.contestID).then(res => {
        this.contest = res.data.data
        this.getEduProblem()
      }).catch(() => {
      })
    },
    methods: {
      pushRouter (page = 1, courseID) {
        this.loading = true
        let params = {
          offset: (page - 1) * this.limit,
          limit: this.limit,
          in_course: true,
          is_valid: true,
          course_id: courseID,
          rule_type: this.contest.rule_type
        }
        api.getEduProblemList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.problems = res.data.data.results
        }).catch(() => {})
      },
      getCourse () {
        api.getCourse().then(res => {
          this.courseList = res.data.data.course
          this.changeChildren(this.courseList)
        }).catch(() => {
        })
      },
      handleCourseChange (value) {
        this.pushRouter(this.page, value[ value.length - 1 ])
      },
      changeChildren (list) {
        for (var listitem of list) {
          if (listitem[ 'children' ].length === 0) {
            delete listitem[ 'children' ]
          } else {
            this.changeChildren(listitem[ 'children' ])
          }
        }
      },
      getEduProblem (page = 1) {
        this.loading = true
        let params = {
          offset: (page - 1) * this.limit,
          limit: this.limit,
          in_course: true,
          is_valid: true,
          rule_type: this.contest.rule_type
        }
        api.getEduProblemList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.problems = res.data.data.results
        }).catch(() => {
        })
      },
      handleAddProblem (problemID) {
        let data = {
          problem_id: problemID,
          contest_id: this.contestID
        }
        api.addProblemFromEdu(data).then(() => {
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
