<template>
  <Panel title="课程与分类">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item of breadcrumb" :key="item.id" ><a @click="goTag(item.id)">{{item.name}}</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin-top: 15px;margin-right: 5px;cursor:pointer">
      <span v-for="item in options" :key="item.id">
        <el-tag closable @close="deleteTag(item.name, item.id)" size="medium"><a @click="goforward(item.id)">{{item.name}}</a></el-tag>
        <icon-btn name="编辑" icon="edit" @click.native="goEdit(item.id)" style="margin-left: 2px;margin-right: 10px;"></icon-btn>
      </span>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新节点</el-button>
    </div>
  </Panel>
</template>
<script>
import Vue from 'vue'
import api from '../../api.js'
export default {
  name: 'course',
  data () {
    return {
      currentID: 0,
      isCourse: true,
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
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      console.log('id: ' + this.currentID)
      let inputValue = this.inputValue
      if (inputValue) {
        let params = {name: inputValue}
        if (this.currentID !== 0 || this.currentID !== -1) {
          let parent = this.getItemById(this.selectList, this.currentID)
          params.parent = parent.url
        }
        let funcName = this.isCourse === true ? 'addCourse' : 'addCollection'
        api[funcName](params).then(res => {
          if (!res.data.error) {
            console.log('done')
          }
        })
        this.options.push({name: inputValue})
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getCollectionList () {
      api.getCollection().then(res => {
        this.collectionList = res.data.data.collection
        this.changeList(this.collectionList)
      }).catch(() => {})
    },
    getCourseList () {
      api.getCourse().then(res => {
        this.courseList = res.data.data.course
        this.changeList(this.courseList)
      }).catch(() => {})
    },
    getItemById (list, id) {
      for (let item of list) {
        if (item.id === id) {
          return item
        }
        let res = this.getItemById(item.children, id)
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
        this.options = this.getItemById(this.selectList, id).children
      }
    },
    deleteTag (name, id) {
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
    changeList (list) {
      for (let item of list) {
        delete item.url
        delete item.problem
        this.changeList(item.children)
      }
    },
    goforward (id) {
      this.currentID = id
      if (id === 0) {
        this.selectList = this.courseList
        this.options = this.selectList
        this.breadcrumb = []
        this.isCourse = true
        this.breadcrumb.push({name: '课程', id: 0})
      } else if (id === -1) {
        this.selectList = this.collectionList
        this.options = this.selectList
        this.breadcrumb = []
        this.isCourse = false
        this.breadcrumb.push({name: '分类', id: 0})
      } else {
        let selectItem = this.getItemById(this.selectList, id)
        console.log(selectItem)
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
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

