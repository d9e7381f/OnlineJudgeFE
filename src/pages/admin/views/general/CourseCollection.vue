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
              placeholder="选择题目分类">
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input v-model="newCollectionName" placeholder="重命名分类"></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="primary" icon="el-icon-edit" circle :disabled="disabledCollectionRenameAndDelete" @click="renCollection"></el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input placeholder="新建子分类" v-model="addCollectionName"></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="success" icon="el-icon-check" circle @click="addCollection"></el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" icon="el-icon-delete" circle :disabled="disabledCollectionRenameAndDelete" @click="deleteCollection"></el-button>
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
              placeholder="请选择操作课程">
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input v-model="newCourseName" placeholder="重命名分类"></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="primary" icon="el-icon-edit" circle :disabled="disabledCourseRenameAndDelete" @click="renCourse"></el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input placeholder="新建子分类" v-model="addCourseName"></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="success" icon="el-icon-check" circle @click="addCourse"></el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" icon="el-icon-delete" circle :disabled="disabledCourseRenameAndDelete" @click="deleteCourse"></el-button>
          </el-col>
        </el-row>
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
        collectionID: '',
        addCollectionName: '',
        newCollectionName: '',
        disabledCollectionRenameAndDelete: true,
        courseList: [],
        courseID: '',
        addCourseName: '',
        newCourseName: '',
        disabledCourseRenameAndDelete: true
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getCollectionList()
        this.getCourseList()
      },
      getCollectionList () {
        api.getCollection().then(res => {
          this.collectionList.push({
            id: -1,
            name: 'root',
            children: []
          })
          this.collectionList[0][ 'children' ] = res.data.data.collection
          this.changeChildren(this.collectionList)
        }).catch(() => {
        })
      },
      renCollection () {
        if (this.collectionID === '') {
          Vue.prototype.$error('请先选择要操作的分类')
        } else if (this.newCollectionName === '') {
          Vue.prototype.$error('分类名称不能为空')
        } else {
          console.log('id:' + this.collectionID + ' newCollectionName:' + this.newCollectionName)
        }
      },
      addCollection () {
        if (this.collectionID === '') {
          Vue.prototype.$error('请先选择要操作的分类')
        } else if (this.addCollectionName === '') {
          Vue.prototype.$error('分类名称不能为空')
        } else {
          console.log('id' + this.collectionID + ' addCollectionName:' + this.addCollectionName)
        }
      },
      deleteCollection () {
        if (this.collectionID === '') {
          Vue.prototype.$error('请先选择要操作的分类')
        } else {
          console.log('id' + this.collectionID + ' deleteCollection')
        }
      },
      changeCollectionRenameAndDelete () {
        this.disabledCollectionRenameAndDelete = (this.collectionID === '' || this.collectionID === -1)
      },
      getCourseList () {
        api.getCollection().then(res => {
          this.courseList.push({
            id: -1,
            name: 'root',
            children: []
          })
          this.courseList[0][ 'children' ] = res.data.data.collection
          this.changeChildren(this.courseList)
        }).catch(() => {
        })
      },
      renCourse () {
        if (this.courseID === '') {
          Vue.prototype.$error('请先选择要操作的课程')
        } else if (this.newCourseName === '') {
          Vue.prototype.$error('课程名称不能为空')
        } else {
          console.log('id:' + this.courseID + ' newCollectionName:' + this.newCourseName)
        }
      },
      addCourse () {
        if (this.courseID === '') {
          Vue.prototype.$error('请先选择要操作的课程')
        } else if (this.addCourseName === '') {
          Vue.prototype.$error('课程名称不能为空')
        } else {
          console.log('id' + this.courseID + ' addCollectionName:' + this.addCourseName)
        }
      },
      deleteCourse () {
        if (this.courseID === '') {
          Vue.prototype.$error('请先选择要操作的分类')
        } else {
          console.log('id' + this.courseID + ' deleteCollection')
        }
      },
      changeCourseRenameAndDelete () {
        this.disabledCourseRenameAndDelete = (this.courseID === '' || this.courseID === -1)
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
      handleCourseChange (value) {
        this.courseID = value[ value.length - 1 ]
        this.changeCourseRenameAndDelete()
      },
      handleCollectionChange (value) {
        this.collectionID = value[ value.length - 1 ]
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
