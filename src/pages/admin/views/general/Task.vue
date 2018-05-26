<template>
  <div class="view">
    <Panel title="任务委派">
      <el-row>
        <el-col :span="6">
          <el-cascader
            :options="courseList"
            :props="cascaderprops"
            filterable
            clearable
            @change="courseChange"
            placeholder="选择课程">
          </el-cascader>
        </el-col>
        <el-col :span="6">
          <el-cascader
            :options="groupList"
            :props="cascaderprops"
            filterable
            clearable
            @change="groupChange"
            placeholder="选择班级">
          </el-cascader>
        </el-col>
      </el-row>
      <el-table
        v-loading="loadingTable"
        element-loading-text="loading"
        ref="table"
        :data="userList"
        style="width: 100%;margin-top: 20px;">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="id" label="ID"></el-table-column>

        <el-table-column prop="username" label="学号"></el-table-column>

        <el-table-column prop="real_name" label="姓名"></el-table-column>

        <el-table-column prop="group" label="班级"></el-table-column>
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
<<script>
  import api from '../../api'
  export default {
    name: 'task',
    data () {
      return {
        loadingTable: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        courseList: [],
        groupList: [],
        userList: [],
        courseID: -1,
        active: 1,
        page: {
          limit: 0,
          offset: 0,
          userprofile__group__grade: '',
          userprofile__group__major: '',
          userprofile__group__class_num: ''
        },
        cascaderprops: {
          value: 'id',
          label: 'name'
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getCourse()
        this.getGroupList()
      },
      courseChange (value) {
        this.courseID = value[value.length - 1]
        console.log(this.courseID)
      },
      groupChange (value) {
        if (value.length === 3) {
          this.page.userprofile__group__grade = value[0]
          this.page.userprofile__group__major = value[1]
          this.page.userprofile__group__class_num = value[2].replace(/[^0-9]/ig, '')
          this.getUserList(this.currentPage)
        }
      },
      currentChange (page) {
        this.currentPage = page
        this.getUserList(this.currentPage)
      },
      getUserList (page = 1) {
        this.page.limit = this.pageSize
        this.page.offset = (page - 1) * this.pageSize
        api.getUserListByClass(this.page).then(res => {
          this.currentPage = 1
          this.total = res.data.data.total
          this.userList = res.data.data.results
        }).catch(() => {})
      },
      getCourse () {
        api.getCourse().then(res => {
          this.courseList = res.data.data.course
          this.changeChildren(this.courseList)
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
      getUser (value) {

      },
      getGroupList () {
        let groupList = []
        api.getUserGroupList().then(res => {
          let yearKeys = Object.keys(res.data.data)
          for (let yearKeysName of yearKeys) {
            let yearObject = {
              id: yearKeysName,
              name: yearKeysName,
              children: []
            }
            let majorKeys = Object.keys(res.data.data[yearKeysName])
            for (let majorKeysName of majorKeys) {
              let majorObject = {
                id: majorKeysName,
                name: majorKeysName,
                children: []
              }
              let classSet = res.data.data[yearKeysName][majorKeysName]
              for (let classItemObject of classSet) {
                let classItem = {
                  fullName: classItemObject.name,
                  name: classItemObject.class_num,
                  id: classItemObject.class_num
                }
                majorObject.children.push(classItem)
              }
              yearObject.children.push(majorObject)
            }
            groupList.unshift(yearObject)
          }
        })
        this.groupList = groupList
      }
    }

  }
</script>
