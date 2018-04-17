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
                <el-input v-model="newCourseName" placeholder="重命名课程"></el-input>
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
        collectionId: [],
        addCollectionName: '',
        newCollectionName: '',
        disabledCollectionRenameAndDelete: true,
        courseList: [],
        courseId: [],
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
