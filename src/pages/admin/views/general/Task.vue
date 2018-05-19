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
        pageSize: 10,
        total: 0,
        courseList: [],
        groupList: [],
        userList: [],
        courseID: -1,
        active: 1,
        groupID: -1,
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
        this.groupID = value[value.length - 1]
        console.log(this.groupID)
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
      getGroupList () {
        let i = 0
        let groupList = []
        api.getUserGroupList().then(res => {
          let yearKeys = Object.keys(res.data.data)
          for (let yearKeysName of yearKeys) {
            let yearObject = {
              id: i++,
              name: yearKeysName,
              children: []
            }
            let majorKeys = Object.keys(res.data.data[yearKeysName])
            for (let majorKeysName of majorKeys) {
              let majorObject = {
                id: i++,
                name: majorKeysName,
                children: []
              }
              let classSet = res.data.data[yearKeysName][majorKeysName]
              for (let classItemObject of classSet) {
                let classItem = {
                  fullName: classItemObject.name,
                  name: classItemObject.class_num,
                  id: classItemObject.id
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