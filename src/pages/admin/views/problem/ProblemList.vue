<template>
  <div class="view">
    <Panel :title="contestId ? '比赛题目列表' : '题目列表'">
      <div slot="header" >
          <div class="header-option" style="margin: 0 auto;margin-left: 5px;">
            <el-cascader :options="courseList"
              :props="cascaderprops"
              v-model="courseID"
              filterable
              clearable
              placeholder="选择题目所属课程">
            </el-cascader>
          </div>
          <div class="header-option" style="margin: 0 auto;margin-left: 5px;">
            <el-cascader :options="collectionList"
              :props="cascaderprops"
              v-if="ProblemList || (UncheckProblemList && switchProblem)"
              filterable
              clearable
              change-on-select
              @change="handleCollectionChange"
              placeholder="选择题目分类"></el-cascader>
          </div>
         <div class="header-option" style="margin: 0 auto;margin-left: 5px;">
           <el-input
              v-model="keyword"
              prefix-icon="el-icon-search"
              placeholder="关键字">
           </el-input>
         </div>
        <div class="header-option" style="margin: 0 auto;margin-left: 5px;">
          <el-switch
          v-if="UncheckProblemList"
          v-model="switchProblem"
          @change="getProblemList"
          active-text="公共"
          inactive-text="教学">
          </el-switch>
        </div>
      </div>

      <el-table
        v-loading="loading"
        element-loading-text="加载中"
        ref="table"
        :data="problemList"
        @row-dblclick="handleDblclick"
        style="width: 100%">
        <el-table-column
          v-if="showID"
          :key="Math.random()"
          width="100"
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          width="150"
          :key="Math.random()"
          label="序号">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{row._id}}</span>
            <el-input v-show="row.isEditing" v-model="row._id"
                      @keyup.enter.native="handleInlineEdit(row)">

            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          prop="title"
          label="标题">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{row.title}}</span>
            <el-input v-show="row.isEditing" v-model="row.title"
                      @keyup.enter.native="handleInlineEdit(row)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          prop="userprofile.real_name"
          label="创建人">
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
          width="100"
          prop="visible"
          label="可见">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.visible"
                       active-text=""
                       inactive-text=""
                       @change="updateDisplay(scope.row.id,scope.row.visible)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          fixed="right"
          label="操作"
          width="250">
          <div slot-scope="scope">
            <icon-btn v-if="!UncheckProblemList" name="编辑" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn v-if="UncheckProblemList" name="通过" icon="check" @click.native="validate(scope.row.id)"></icon-btn>
            <icon-btn name="预览" icon="view"  @click.native="openViewProblem(scope.row.id)"></icon-btn>
            <icon-btn v-if="contestId" name="设置公开" icon="sort"
                      @click.native="makeContestProblemPublic(scope.row.id)"></icon-btn>
            <icon-btn icon="download" name="下载测试实例"
                      @click.native="downloadTestCase(scope.row.id)"></icon-btn>
            <icon-btn icon="delete" name="删除"
                      @click.native="deleteProblem(scope.row.id)"></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-button type="primary" size="small"
                   @click="goCreateProblem" icon="el-icon-plus">创建题目
        </el-button>
        <el-button v-if="contestId" type="primary"
                   size="small" icon="el-icon-plus"
                   @click="addProblemDialogVisible = true">从教学题库中添加
        </el-button>
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <el-dialog title="确定更新该题目吗? "
               width="20%"
               :visible.sync="InlineEditDialogVisible"
               @close-on-click-modal="false">
      <div>
        <p>ID: {{currentRow._id}}</p>
        <p>标题: {{currentRow.title}}</p>
      </div>
      <span slot="footer">
        <cancel @click.native="InlineEditDialogVisible = false; getProblemList(currentPage)"></cancel>
        <save @click.native="updateDisplayIDAndTitle(currentRow.id,currentRow._id,currentRow.title)"></save>
      </span>
    </el-dialog>
     <el-dialog title="预览题目"
               width="80%"
               :visible.sync="viewProblem"
               @close-on-click-modal="false">
      <view-problem-component :problemId="viewProblemId" ></view-problem-component>
    </el-dialog>
    <el-dialog title="添加比赛题目"
               v-if="contestId"
               width="80%"
               :visible.sync="addProblemDialogVisible"
               @close-on-click-modal="false">
      <add-problem-component :contestID="contestId" @on-change="getProblemList"></add-problem-component>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'
  import utils from '@/utils/utils'
  import AddProblemComponent from './AddPublicProblem.vue'
  import ViewProblemComponent from './ViewProblem.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: 'ProblemList',
    components: {
      AddProblemComponent,
      ViewProblemComponent
    },
    data () {
      return {
        admin_type: '',
        pageSize: 10,
        total: 0,
        showID: false,
        problemList: [],
        keyword: '',
        classSet: [],
        cascaderprops: {
          value: 'id',
          label: 'name'
        },
        loading: false,
        courseList: [],
        courseID: 0,
        collectionList: [],
        collectionID: 0,
        currentPage: 1,
        routeName: '',
        ProblemList: true,
        UncheckProblemList: false,
        EduProblemList: false,
        contestId: '',
        viewProblemId: '',
        switchProblem: true,
        // for make public use
        currentProblemID: '',
        currentRow: {},
        viewProblem: false,
        InlineEditDialogVisible: false,
        makePublicDialogVisible: false,
        addProblemDialogVisible: false
      }
    },
    mounted () {
      this.init()
      this.routeName = this.$route.name
      this.contestId = this.$route.params.contestId
      this.getProblemList(this.currentPage)
      this.getCollection()
    },
    methods: {
      init () {
        this.routeName = this.$route.name
        this.showID = this.isShowID()
        this.ProblemList = this.isProblemList()
        this.UncheckProblemList = this.isUncheckProblemList()
        this.EduProblemList = this.isEduProblemList()
        this.switchProblem = this.UncheckProblemList
      },
      handleDblclick (row) {
        row.isEditing = true
      },
      isProblemList () {
        return this.routeName === 'problem-list'
      },
      isEduProblemList () {
        return this.routeName === 'edu-problem-list'
      },
      isUncheckProblemList () {
        return this.routeName === 'uncheck-problem-list'
      },
      isShowID () {
        return this.routeName === 'contest-problem-list'
      },
      goEdit (problemId) {
        if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'edit-contest-problem', params: {problemId: problemId, contestId: this.contestId}})
        } else {
          this.$router.push({name: 'edit-problem', params: {problemId}})
        }
      },
      openViewProblem (problemId) {
        this.viewProblem = true
        this.viewProblemId = problemId
      },
      validate (problemId) {
        api.validateProblem(problemId).then(res => {
          if (res.data.error === null) {
            this.getProblemList()
          }
        }).catch(() => {})
      },
      goCreateProblem () {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'create-problem'})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'create-contest-problem', params: {contestId: this.contestId}})
        } else {
          this.$router.push({name: 'create-problem'})
        }
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getProblemList(page)
      },
      handleCollectionChange (value) {
        this.collectionID = value[ value.length - 1 ]
        this.getProblemList()
      },
      updateDisplay (problemID, visible) {
        api.changeProblemDisplay(problemID, visible).then(res => {
          this.InlineEditDialogVisible = false
          this.getProblemList(this.currentPage)
        }).catch(() => {
          this.InlineEditDialogVisible = false
        })
      },
      updateDisplayIDAndTitle (problemID, displayID, title) {
        api.changeProblemDisplayIDAndTitle(problemID, displayID, title).then(res => {
          this.InlineEditDialogVisible = false
          this.getProblemList(this.currentPage)
        }).catch(() => {
          this.InlineEditDialogVisible = false
        })
      },
      getCourse () {
        api.getCourse().then(res => {
          this.courseList = res.data.data.course
          this.changeChildren(this.courseList)
        }).catch(() => {})
      },
      getCollection () {
        api.getCollection().then(res => {
          this.collectionList = res.data.data.collection
          this.changeChildren(this.collectionList)
        }).catch(() => {})
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
      getProblemList (page = 1) {
        this.loading = true
        let params = {
          limit: this.pageSize,
          offset: (page - 1) * this.pageSize,
          keyword: this.keyword,
          contest_id: this.contestId,
          in_course: this.EduProblemList || (!this.switchProblem && this.UncheckProblemList),
          has_perm: true,
          is_valid: !this.UncheckProblemList
        }
        let funcName = this.$route.name === 'contest-problem-list' ? 'getContestProblemList' : 'getProblemList'
        if (this.routeName === 'contest-problem-list') {
          delete params.in_course
          delete params.is_valid
        } else {
          delete params.contest_id
        }
        if ((this.$route.name === 'problem-list' && this.collectionID !== 0) || ((this.$route.name === 'uncheck-problem-list' || this.switchProblem) && this.collectionID !== 0)) {
          params.collection_id = this.collectionID
        }
        // 普通用户所能查看的题目必须是未审核的题目，查看自身提交已审核题目是没有意义
        if (!this.$store.getters.isAdminRole) {
          delete params.is_valid
        }
        api[funcName](params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          for (let problem of res.data.data.results) {
            problem.isEditing = false
          }
          this.problemList = res.data.data.results
        }, res => {
          this.loading = false
        })
      },
      deleteProblem (id) {
        this.$confirm('你只能删除没有提交代码的题目，确定继续吗?', '删除题目', {
          type: 'warning'
        }).then(() => {
          api.deleteProblem(id).then(() => [
            this.getProblemList(this.currentPage - 1)
          ]).catch(() => {
          })
        }, () => {
        })
      },
      makeContestProblemPublic (problemID) {
        api.makeContestProblemPublic({id: problemID}).catch(() => {})
      },
      handleInlineEdit (row) {
        this.currentRow = row
        this.InlineEditDialogVisible = true
      },
      downloadTestCase (problemID) {
        let url = `/test_case?problem_id=${problemID}`
        utils.downloadFile(url)
      },
      getPublicProblem () {
        api.getProblemList()
      }
    },
    watch: {
      '$route' (newVal, oldVal) {
        this.contestId = newVal.params.contestId
        this.routeName = newVal.name
        this.init()
        this.getProblemList(this.currentPage)
      },
      'keyword' () {
        this.currentChange()
      }
    },
    computed: {
      ...mapGetters(['isAdminRole'])
    }
  }
</script>

<style scoped lang="less">
  .header-option{
    float: left;
    margin-top: 10px;
    margin-right: 20px;
  }
</style>
