<template>
  <Panel title="课程与分类">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item of breadcrumb" :key="item.id" ><a @click="goTag(item.id)">{{item.name}}</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-select v-model="selectID" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="goforward()" round>进入</el-button>
    </div>
  </Panel>
</template>
<script>
import api from '../../api.js'
export default {
  name: 'course',
  data () {
    return {
      selectID: '',
      courseList: [],
      collectionList: [],
      selectList: [],
      breadcrumb: [
        {
          name: '课程与分类',
          id: 21
        }
      ],
      options: [
        {
          label: '课程',
          value: 0
        },
        {
          label: '分类',
          value: -1
        }
      ]
    }
  },
  methods: {
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
        this.getItemById(item.children, id)
      }
    },
    goTag (id) {
      console.log('go:' + id)
    },
    changeList (list) {
      for (let item of list) {
        item.label = item.name
        item.value = item.id
        delete item.name
        delete item.id
        delete item.problem
        this.changeList(item.children)
      }
    },
    goforward () {
      if (this.selectID === 0) {
        this.selectList = this.courseList
        console.log(this.selectList)
        this.options = this.selectList
      } else if (this.selectID === -1) {
        this.selectList = this.collectionList
        this.options = this.selectList
        console.log(this.selectList)
      } else {
        let selectItem = this.getItemById(this.selectList, this.value)
        this.options = selectItem.children
        this.breadcrumb.push({name: selectItem.label, id: selectItem.value})
      }
      console.log('goforward:' + this.selectID)
    }
  },
  mounted () {
    this.getCollectionList()
    this.getCourseList()
  }

}
</script>
