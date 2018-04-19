<template>
  <div class="view">
    <Panel title="分类管理">
      <div>
       <el-row type="flex">
          <el-col :span="8">
            <el-cascader :options="collectionList" 
              :props="cascaderprops"
              :change-on-select="true"
              @change="handleCollectionChange"
              size="small"
              placeholder="选择题目分类">
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input v-model="newCollectionName" placeholder="重命名分类" size="small"></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="info"  round :disabled="disabledCollectionRenameAndDelete" @click="renCollection" size="small">提交</el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input placeholder="新建子分类" v-model="addCollectionName" size="small"></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="primary" round @click="addCollection" size="small">提交</el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" round :disabled="disabledCollectionRenameAndDelete" @click="deleteCollection" size="small">删除</el-button>
          </el-col>
        </el-row>
      </div>
    </Panel>

    <Panel>
      <span slot="title">课程管理</span>
      <div>
       <el-row type="flex">
          <el-col :span="8">
            <el-cascader :options="courseList" 
              :props="cascaderprops"
              :change-on-select="true"
              @change="handleCourseChange"
              size="small"
              placeholder="请选择操作课程">
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input v-model="newCourseName" placeholder="重命名课程" size="small"></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="info" round :disabled="disabledCourseRenameAndDelete" @click="renCourse" size="small">提交</el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input placeholder="新建子分类" v-model="addCourseName" size="small"></el-input>
              </el-col>
             <el-col :span="8">
              <el-button size="small" type="primary" @click="addCourse" round :disabled="disabledCourseRenameAndDelete">提交</el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" round :disabled="disabledCourseRenameAndDelete" @click="deleteCourse" size="small">删除</el-button>
          </el-col>
        </el-row>
      </div>

        <el-table
        v-loading="courseLoadingTable"
        element-loading-text="loading"
        @selection-change="handleSelectionChange"
        ref="table"
        :data="courseProblemList"
        style="width: 100%;margin-top: 20px;">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="id" label="ID"></el-table-column>

        <el-table-column prop="title" label="标题"></el-table-column>

        <el-table-column prop="create_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.create_time | localtime }}
          </template>
        </el-table-column>

        <el-table-column label="课程">
            <template slot-scope="scope">
              <el-tag v-for="(course,index) in scope.row.courses" :key="course.name" style="margin-left: 5px;">
                 {{course.name}}
              </el-tag>
          </template>
        </el-table-column>

      </el-table>
      <div class="panel-options">
        <el-button size="small" type="primary" round v-show="selectCourseProblemList.length" @click="addProblemCourse">题目新增该课程</el-button>
        <el-button size="small" type="info" round v-show="selectCourseProblemList.length" @click="removeProblemCourse">题目移除该课程</el-button>
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="coursePageSize"
          :total="courseTotal">
        </el-pagination>
        </div>

    </Panel>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api.js'

  export default {
    name: 'CourseCollection',
    data () {
      return {
        cascaderprops: {
          value: 'id',
          label: 'name'
        },
        collectionList: [],
        collectionId: [],
        addCollectionName: '',
        newCollectionName: '',
        disabledCollectionRenameAndDelete: true,
        courseList: [],
        courseId: [],
        addCourseName: '',
        newCourseName: '',
        disabledCourseRenameAndDelete: true,
        coursePageSize: 10,
        courseTotal: 0,
        courseLoading: false,
        courseCurrentPage: 1,
        courseLoadingTable: false,
        selectCourseProblemList: [],
        courseProblemList: []
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getCollectionList()
        this.getCourseList()
        this.getCourseProblemList(this.courseCurrentPage)
      },
      addProblemCourse () {
        let problem = []
        for (let item of this.selectCourseProblemList) {
          problem.push(item.id)
        }
        let data = {
          'problems': problem
        }
        api.addProblemCourse(this.courseId[0], data)
        this.getCourseProblemList(this.courseCurrentPage)
      },
      removeProblemCourse () {
        let problem = []
        for (let item of this.selectCourseProblemList) {
          problem.push(item.id)
        }
        let data = {
          'problems': problem
        }
        api.removeProblemCourse(this.courseId[0], data)
        this.getCourseProblemList(this.courseCurrentPage)
      },
      getCourseProblemList (coursePage = 1) {
        let params = {
          limit: this.coursePageSize,
          offset: (coursePage - 1) * this.coursePageSize,
          in_course: true,
          has_perm: true,
          is_valid: true
        }
        api.getProblemList(params).then(res => {
          this.courseLoading = false
          this.courseTotal = res.data.data.total
          for (let problem of res.data.data.results) {
            problem.isEditing = false
            let courses = []
            for (let item of problem.courses) {
              courses.push(item[item.length - 1])
            }
            problem.courses = courses
          }
          this.courseProblemList = res.data.data.results
        }, res => {
          this.courseLoading = false
        })
      },
      handleSelectionChange (val) {
        this.selectCourseProblemList = val
      },
      currentChange (page) {
        this.currentPage = page
        this.getCollectionProblemList(page)
      },
      getCollectionList () {
        api.getCollection().then(res => {
          this.collectionList[0] = {
            id: ['-1', ''],
            name: '顶层分类',
            children: []
          }
          this.collectionList[0][ 'children' ] = res.data.data.collection
          this.changeChildren(this.collectionList)
        }).catch(() => {})
      },
      renCollection () {
        if (this.collectionId[0] === '') {
          Vue.prototype.$error('请先选择要操作的分类')
        } else if (this.newCollectionName === '') {
          Vue.prototype.$error('分类名称不能为空')
        } else {
          let collectionoptions = {
            name: this.newCollectionName
          }
          api.renCollection(this.collectionId[0], collectionoptions).then(res => {
            if (res.data.error === null) {
              this.getCollectionList()
            }
          }).catch(() => {})
        }
      },
      addCollection () {
        if (this.collectionId[0] === '') {
          Vue.prototype.$error('请先选择要操作的分类')
        } else if (this.addCollectionName === '') {
          Vue.prototype.$error('分类名称不能为空')
        } else {
          let courseoptions = {
            parent: this.collectionId[1],
            name: this.addCollectionName
          }
          api.addCollection(courseoptions).then(res => {
            if (res.data.error === null) {
              this.getCollectionList()
            }
          }).catch(() => {})
        }
      },
      deleteCollection () {
        if (this.collectionId[0] === '') {
          Vue.prototype.$error('请先选择要操作的分类')
        } else {
          api.deleteCollection(this.collectionId[0]).then(res => {
            if (res.data.error === null) {
              this.getCollectionList()
            }
          }).catch(() => {})
        }
      },
      changeCollectionRenameAndDelete () {
        this.disabledCollectionRenameAndDelete = (this.collectionId[0] === '' || this.collectionId[0] === -1)
      },
      getCourseList () {
        api.getCourse().then(res => {
          this.courseList[0] = {
            id: ['-1', ''],
            name: '顶层课程',
            children: []
          }
          this.courseList[0][ 'children' ] = res.data.data.course
          this.changeChildren(this.courseList)
        }).catch(() => {})
      },
      renCourse () {
        if (this.courseId === '') {
          Vue.prototype.$error('请先选择要操作的课程')
        } else if (this.newCourseName === '') {
          Vue.prototype.$error('课程名称不能为空')
        } else {
          let courseoptions = {
            name: this.newCourseName
          }
          api.renCourse(this.courseId[0], courseoptions).then(res => {
            if (res.data.error === null) {
              this.getCourseList()
            }
          }).catch(() => {})
        }
      },
      addCourse () {
        if (this.courseId === '') {
          Vue.prototype.$error('请先选择要操作的课程')
        } else if (this.addCourseName === '') {
          Vue.prototype.$error('课程名称不能为空')
        } else {
          let courseoptions = {
            parent: this.courseId[1],
            name: this.addCourseName
          }
          api.addCourse(courseoptions).then(res => {
            if (res.data.error === null) {
              this.getCourseList()
            }
          }).catch(() => {})
        }
      },
      deleteCourse () {
        if (this.courseId === '') {
          Vue.prototype.$error('请先选择要操作的分类')
        } else {
          api.deleteCourse(this.courseId[0]).then(res => {
            if (res.data.error === null) {
              this.getCourseList()
            }
          }).catch(() => {})
        }
      },
      changeCourseRenameAndDelete () {
        this.disabledCourseRenameAndDelete = (this.courseId === '' || this.courseId === -1)
      },
      changeChildren (list) {
        for (var listitem of list) {
          listitem['id'] = [listitem['id'], listitem['url']]
          if (listitem[ 'children' ].length === 0) {
            delete listitem[ 'children' ]
          } else {
            this.changeChildren(listitem[ 'children' ])
          }
        }
      },
      handleCourseChange (value) {
        this.courseId = value[ value.length - 1 ]
        this.changeCourseRenameAndDelete()
      },
      handleCollectionChange (value) {
        this.collectionId = value[ value.length - 1 ]
        this.changeCollectionRenameAndDelete()
      }
    },
    computed: {
    },
    watch: {
    }
  }
</script>

<style scoped lang="less">
  #options-panel {
    float: right;
  }
  .import-user-icon {
    color: #555555;
    margin-left: 4px;
  }

  .userPreview {
    padding-left: 10px;
  }

  .notification {
    p {
      margin: 0;
      text-align: left;
    }
  }
</style>
