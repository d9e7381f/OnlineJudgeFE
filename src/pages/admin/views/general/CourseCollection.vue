<template>
  <div class="view">
    <Panel title="课程管理">
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
                <el-input placeholder="重命名分类" ></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="primary" icon="el-icon-edit" circle :disabled="rename"></el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-row  type="flex" justify="space-between">
              <el-col :span="14">
                <el-input placeholder="新建分类"></el-input>
              </el-col>
             <el-col :span="8">
               <el-button type="success" icon="el-icon-check" circle></el-button>
             </el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-col>
        </el-row>
      </div>
    </Panel>

    <Panel>
      <span slot="title">分类管理</span>
    </Panel>

  </div>
</template>

<script>
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
        rename: true,
        courseList: []
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getCollectionList()
      },
      getCollectionList () {
        api.getCollection().then(res => {
          this.collectionList.push({
            id: -1,
            name: 'root',
            children: []
          })
          for (var item of res.data.data.collection) {
            this.collectionList.push(item)
          }
          this.changeChildren(this.collectionList)
        }).catch(() => {
        })
      },
      renameAble () {
        this.rename = (this.collectionID === '' || this.collectionID === -1)
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
      handleCollectionChange (value) {
        this.collectionID = value[ value.length - 1 ]
        this.renameAble()
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
