<template>
  <Panel title="课程与分类">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item of breadcrumb" :key="item.id" ><a @click="goTag(item.id)">{{item.name}}</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="cursor:pointer">
      <div v-for="item in options" :key="item.id" style="margin-top:5px;">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-tag @close="deleteTag(item.id)" size="medium"><a @click="goForward(item.id)">{{item.name}}</a></el-tag>
          </el-col>
          <el-col :span="1.5">
            <icon-btn v-if="isCourse || isCollection" name="编辑" icon="edit" @click.native="goEdit(item.id)" style="margin-left: 2px;margin-right: 10px;"></icon-btn>
          </el-col>
          <el-col :span="1.5">
            <el-popover
              style="margin-right: 15px;"
              v-if="isCourse && !item.children.length"
              placement="top">
              <p>确定删除该节点并选择对相关题目操作？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="primary" size="mini" @click="handleSetCollectionByOrder(item.id)">依次分配分类</el-button>
                <el-button type="primary" size="mini" @click="handleSetDefaultCollection(item.id)">设置默认分类</el-button>
                <el-button type="danger" size="mini" @click="forceDeleteCourse(item.id)">强制删除题目</el-button>
              </div>
              <icon-btn slot="reference" name="删除" icon="delete"></icon-btn>
            </el-popover>
          </el-col>
          <el-col :span="1.5">
            <icon-btn v-if="isCollection" name="删除" icon="delete" @click.native="deleteCollection(item.id)"></icon-btn>
          </el-col>
        </el-row>

      </div>
      <div style="margin-top:5px;">
        <el-input
          class="input-new-tag"
          v-if="inputVisible && (isCourse || isCollection)"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleAddCourseInputConfirm"
          @blur="handleAddCourseInputConfirm"
        >
        </el-input>
        <el-button v-else-if="!inputValue && (isCourse || isCollection)"  class="button-new-tag" size="small" @click="showAddCourseInput">添加新节点</el-button>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="deleteCourseAndSetDefaultCollectionView"
      width="30%">
      <span>选择默认的分类</span>
      <div>
        <el-cascader :options="collectionList"
              :props="cascaderprops"
              v-model="cascaderID"
              filterable
              clearable
              change-on-select
              size="small"
              placeholder="请选择分类">
            </el-cascader>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteCourseAndSetDefaultCollection()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="deleteCourseAndSetCollectionByOrderView">
      <div v-if="problemList.length && problem">
        <div>分别为下列题目设置分类</div>
        <span>
          <p>题目:{{problem.title}}</p>
          <p v-html="problem.description"></p>
          <el-cascader :options="collectionList"
            :props="cascaderprops"
            v-model="cascaderID"
            filterable
            clearable
            change-on-select
            size="small"
            placeholder="请选择分类">
          </el-cascader>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAndGoNextProbelm()">下一道题目</el-button>
        </span>
      </div>
      <div v-else>
        <p>已经为该课程题目分配分类，请点击以下按钮以完成操作</p>
        <el-button type="primary" @click="finshDelete()">完成</el-button>
      </div>
    </el-dialog>
  </Panel>
</template>
<script>
import Vue from 'vue'
import api from '../../api.js'
import utils from '@/utils/utils'
export default {
  name: 'course',
  data () {
    return {
      total: 0,
      limit: 10,
      offset: 0,
      cascaderID: [],
      problemList: [],
      problem: {},
      cascaderprops: {
        value: 'id',
        label: 'name'
      },
      deleteCourseAndSetDefaultCollectionView: false,
      deleteCourseAndSetCollectionByOrderView: false,
      currentID: 0,
      isCourse: false,
      isCollection: false,
      courseList: [],
      collectionList: [],
      selectList: [],
      breadcrumb: [],
      inputVisible: false,
      inputValue: '',
      options: [
        {
          name: '课程',
          id: 0
        },
        {
          name: '分类',
          id: -1
        }
      ]
    }
  },
  methods: {
    finshDelete () {
      this.deleteCourseAndSetCollectionByOrderView = false
      this.deleteCourse(this.currentID)
    },
    showAddCourseInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleAddCourseInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        let params = {name: inputValue}
        console.log(this.currentID)
        if (this.currentID !== 0 && this.currentID !== -1) {
          let parent = this.getItem(this.selectList, this.currentID)
          if (parent) {
            params.parent = parent.url
          }
        }
        let funcName = this.isCourse === true ? 'addCourse' : 'addCollection'
        api[funcName](params).then(res => {
          if (!res.data.error) {
            let problem = res.data.data
            problem.children = []
            this.options.push(problem)
            if (this.isCourse) {
              this.getCourseList()
            } else {
              this.getCollectionList()
            }
          }
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleSetCollectionByOrder (id) {
      this.offset = 0
      this.currentID = id
      this.deleteCourseAndSetCollectionByOrderView = true
      api.getProblemList({'course_id': id, limit: this.limit, offset: this.offset}).then(res => {
        this.problemList = res.data.data.results
        this.problem = this.problemList.pop()
        this.total = res.data.data.total
        this.problemList.unshift({title: ''})
        this.offset += this.limit
      })
    },
    handleSetDefaultCollection (id) {
      this.deleteCourseAndSetDefaultCollectionView = true
      this.currentID = id
    },
    handleAndGoNextProbelm () {
      let collectionID = this.cascaderID[this.cascaderID.length - 1]
      this.cascaderID = []
      api.makePublicProblem(this.problem.id, collectionID).then(res => {
        this.problem = this.problemList.pop()
        if (this.offset <= this.total && this.problemList.length === 1) {
          api.getProblemByFilter({'course_id': this.current, limit: this.limit, offset: this.offset}).then(res => {
            this.problemList = res.data.data.results
            this.total = res.data.data.total
            this.offset += this.limit
            this.problemList.unshift({title: ''})
          })
        }
      }).catch(() => {
        Vue.prototype.$error('设置分类失败')
      })
    },
    getCollectionList () {
      api.getCollection().then(res => {
        this.collectionList = res.data.data.collection
        utils.deleteEmptyChildren(this.collectionList)
      }).catch(() => {})
    },
    deleteCourse (courseID) {
      api.deleteCourse(courseID, {force_delete: false}).then(res => {
        if (!res.data.error) {
          this.options.splice(this.options.findIndex(item => item.id === courseID), 1)
        }
      }).catch(() => {})
    },
    getCourseList () {
      api.getCourse().then(res => {
        this.courseList = res.data.data.course
      }).catch(() => {})
    },
    getItem (list, id) {
      for (let item of list) {
        if (item.id === id) {
          return item
        }
        let res = this.getItem(item.children, id)
        if (res) {
          return res
        }
      }
    },
    goEdit (id) {
      this.$prompt('输入节点的新名称', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        let funcName = this.isCourse === true ? 'renCourse' : 'renCollection'
        api[funcName](id, {name: value}).then(res => {
          if (!res.data.error) {
            this.options[this.options.findIndex(item => item.id === id)].name = value
          }
        })
      })
    },
    goTag (id) {
      this.currentID = id
      let index = this.breadcrumb.findIndex(item => item.id === id)
      this.breadcrumb.splice(index + 1, this.breadcrumb.length - index + 1)
      if (id === 0) {
        this.isCourse = false
        this.isCollection = false
        this.options = [
          {
            name: '课程',
            id: 0
          },
          {
            name: '分类',
            id: -1
          }
        ]
      } else {
        this.options = this.getItem(this.selectList, id).children
      }
    },
    deleteCollection (collectionID) {
      this.$confirm('确认删除吗?').then(_ => {
        api.deleteCollection(collectionID).then(res => {
          if (!res.data.error) {
            this.options.splice(this.options.findIndex(item => item.id === collectionID), 1)
          }
        })
      })
    },
    deleteTag (id) {
      if (id === 0 || id === -1) {
        Vue.prototype.$error('该标签无法删除')
      } else {
        this.$confirm('确认删除吗？').then(_ => {
          let funcName = this.isCourse === true ? 'deleteCourse' : 'deleteCollection'
          api[funcName](id).then(res => {
            if (!res.data.error) {
              this.options.splice(this.options.findIndex(item => item.id === id), 1)
            }
          })
        })
      }
    },
    deleteCourseAndSetDefaultCollection () {
      this.deleteCourseAndSetDefaultCollectionView = true
      let collectionID = this.cascaderID[this.cascaderID.length - 1]
      api.makeBatchContestProblemPublic(this.currentID, collectionID).then(res => {
        if (!res.data.error) {
          this.deleteCourse(this.currentID)
          this.cascaderID = []
          this.deleteCourseAndSetDefaultCollectionView = false
        }
      })
    },
    forceDeleteCourse (id) {
      this.$confirm('该操作将会删除该课程下所有的题目，是否继续?').then(_ => {
        api.deleteCourse(id, {force_delete: true}).then(res => {
          if (!res.data.error) {
            this.options.splice(this.options.findIndex(item => item.id === id), 1)
          }
        })
      }).catch(() => {})
    },
    goForward (id) {
      this.currentID = id
      if (id === 0) {
        this.selectList = this.courseList
        this.options = this.selectList
        this.breadcrumb = []
        this.isCourse = true
        this.isCollection = false
        this.breadcrumb.push({name: '课程', id: 0})
      } else if (id === -1) {
        this.selectList = this.collectionList
        this.options = this.selectList
        this.breadcrumb = []
        this.isCourse = false
        this.isCollection = true
        this.breadcrumb.push({name: '分类', id: 0})
      } else {
        let selectItem = this.getItem(this.selectList, id)
        this.options = selectItem.children
        this.breadcrumb.push({name: selectItem.name, id: selectItem.id})
      }
    }
  },
  mounted () {
    this.getCollectionList()
    this.getCourseList()
  }

}
</script>
<style lang="less">
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }
</style>

