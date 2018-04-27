<template>
  <div class="view">
    <Panel :title="title">
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标题" required>
              <el-input v-model="contest.title" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" required>
              <Simditor v-model="contest.description"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间" required>
              <el-date-picker
                v-model="contest.start_time"
                type="datetime"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停止时间" required>
              <el-date-picker
                v-model="contest.end_time"
                type="datetime"
                placeholder="请输入停止时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="口令">
              <el-input v-model="contest.password" placeholder="请设置比赛口令"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="比赛得分规则">
              <el-radio class="radio" v-model="contest.rule_type" label="ACM" :disabled="disableRuleType">ACM</el-radio>
              <el-radio class="radio" v-model="contest.rule_type" label="OI" :disabled="disableRuleType">OI</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实时排名">
              <el-switch
                v-model="contest.real_time_rank"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可见">
              <el-switch
                v-model="contest.visible"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="允许班级">
                <el-row :gutter="5" style="margin-bottom: 15px">
                  <el-col :span="6">
                    <el-cascader
                      v-model="cascaderClassID"
                      :options="groupList" 
                      :props="cascaderprops"
                      placeholder="选择班级">
                      </el-cascader>
                  </el-col>
                  <el-col :span="10">
                    <el-button plain icon="el-icon-fa-plus" @click="addGroupTag"></el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top: 15px;margin-left: 5px;">
                <el-tag v-for="tag in groupTag"
                  :key="tag.name"
                  style="margin-right:5px"
                  closable
                  @close="closeGroupTag(tag.id)">
                  {{tag.name}}
                </el-tag>
              </el-row>              
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="允许IP">
              <div v-for="(range, index) in contest.allowed_ip_ranges" :key="index">
                <el-row :gutter="20" style="margin-bottom: 15px">
                  <el-col :span="8">
                    <el-input v-model="range.value" placeholder="请输入支持的IP"></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-button plain icon="el-icon-fa-plus" @click="addIPRange"></el-button>
                    <el-button plain icon="el-icon-fa-trash" @click="removeIPRange(range)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <save @click.native="saveContest"></save>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Vue from 'vue'
  import Simditor from '../../components/Simditor.vue'

  export default {
    name: 'CreateContest',
    components: {
      Simditor
    },
    data () {
      return {
        title: '创建比赛',
        disableRuleType: false,
        groupList: [],
        groupTag: [],
        classSet: [],
        cascaderClassID: [],
        cascaderprops: {
          value: 'id',
          label: 'name'
        },
        contest: {
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          rule_type: 'ACM',
          password: '',
          real_time_rank: true,
          groups: [],
          visible: true,
          allowed_ip_ranges: [{
            value: ''
          }]
        }
      }
    },
    methods: {
      saveContest () {
        let funcName = this.$route.name === 'edit-contest' ? 'editContest' : 'createContest'
        let data = Object.assign({}, this.contest)
        data['groups'] = []
        for (let group of this.groupTag) {
          data['groups'].push(group.id)
        }
        let ranges = []
        for (let v of data.allowed_ip_ranges) {
          if (v.value !== '') {
            ranges.push(v.value)
          }
        }
        data.allowed_ip_ranges = ranges
        api[funcName](data).then(res => {
          this.$router.push({name: 'contest-list', query: {refresh: 'true'}})
        }).catch(() => {
        })
      },
      addIPRange () {
        this.contest.allowed_ip_ranges.push({value: ''})
      },
      getGroupList () {
        api.getUserGroupList().then(res => {
          let yearKeys = Object.keys(res.data.data)
          for (let yearKeysName of yearKeys) {
            let yearObject = {
              id: -1,
              name: yearKeysName,
              children: []
            }
            let majorKeys = Object.keys(res.data.data[yearKeysName])
            for (let majorKeysName of majorKeys) {
              let majorObject = {
                id: -1,
                name: majorKeysName,
                children: []
              }
              let classSet = res.data.data[yearKeysName][majorKeysName]
              for (let classItemObject of classSet) {
                let classItem = {
                  name: classItemObject.name,
                  id: classItemObject.id
                }
                this.classSet.push(classItem)
                majorObject.children.push(classItem)
              }
              yearObject.children.push(majorObject)
            }
            this.groupList.push(yearObject)
          }
        })
      },
      findClassByClassID (classID) {
        let classItem = this.classSet.find((value, index, arr) => {
          return value.id === classID
        })
        return classItem
      },
      addGroupTag () {
        let classID = this.cascaderClassID[this.cascaderClassID.length - 1]
        if (this.groupTag.findIndex(item => item.id === classID) !== -1) {
          Vue.prototype.$error('已经选择了该课程')
          return
        }
        let classItem = this.findClassByClassID(classID)
        this.groupTag.push({
          name: classItem.name,
          id: classItem.id
        })
      },
      closeGroupTag (tagID) {
        this.groupTag.splice(this.groupTag.findIndex(item => item.id === tagID), 1)
      },
      removeIPRange (range) {
        let index = this.contest.allowed_ip_ranges.indexOf(range)
        if (index !== -1) {
          this.contest.allowed_ip_ranges.splice(index, 1)
        }
      }
    },
    mounted () {
      this.getGroupList()
      if (this.$route.name === 'edit-contest') {
        this.title = 'Edit Contest'
        this.disableRuleType = true
        api.getContest(this.$route.params.contestId).then(res => {
          let data = res.data.data
          let ranges = []
          for (let v of data.allowed_ip_ranges) {
            ranges.push({value: v})
          }
          if (ranges.length === 0) {
            ranges.push({value: ''})
          }
          data.allowed_ip_ranges = ranges
          this.contest = data
        }).catch(() => {
        })
      }
    }
  }
</script>
