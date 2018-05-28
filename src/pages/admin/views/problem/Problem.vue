<template>
  <div class="problem">

    <Panel :title="title">
      <el-form ref="form" :model="problem" :rules="rules" label-position="top" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="6" v-if="mode == 'edit-contest' ">
            <el-form-item prop="_id" label="展示ID" >
              <el-input placeholder="用于题目展示" v-model="problem._id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="title" label="标题">
              <el-input placeholder="请输入标题" v-model="problem.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="description" label="描述" required>
              <Simditor v-model="problem.description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="input_description" label="输入数据描述" required>
              <Simditor v-model="problem.input_description"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="output_description" label="输出文件描述" required>
              <Simditor v-model="problem.output_description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="时间限制" required>
              <el-input type="Number" placeholder="程序运行使用最大时间" v-model="problem.time_limit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内存限制" required>
              <el-input type="Number" placeholder="程序运行所占用最大内存空间" v-model="problem.memory_limit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="难度">
              <el-select class="difficulty-select" size="small" placeholder="Difficulty" v-model="problem.difficulty">
                <el-option label="简单" value="Low"></el-option>
                <el-option label="中等" value="Mid"></el-option>
                <el-option label="困难" value="High"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="可见">
              <el-switch
                v-model="problem.visible"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标签" :error="error.tags">
              <span class="tags">
                <el-tag
                  v-for="tag in problem.tags"
                  :closable="true"
                  :close-transition="false"
                  :key="tag"
                  type="success"
                  @close="closeTag(tag)"
                >{{tag}}</el-tag>
              </span>
              <el-autocomplete
                v-if="inputVisible"
                size="mini"
                class="input-new-tag"
                v-model="tagInput"
                :trigger-on-focus="false"
                @keyup.enter.native="addTag"
                @select="addTag"
                :fetch-suggestions="querySearch">
              </el-autocomplete>
              <el-button class="button-new-tag" v-else size="small" @click="inputVisible = true">+ 新标签</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支持语言" :error="error.languages" required>
              <el-checkbox-group v-model="problem.languages">
                <el-tooltip class="spj-radio" v-for="lang in allLanguage.languages" :key="'spj'+lang.name" effect="dark"
                            :content="lang.description" placement="top-start">
                  <el-checkbox :label="lang.name"></el-checkbox>
                </el-tooltip>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-form-item v-for="(sample, index) in problem.samples" :key="'sample'+index">
            <Accordion :title="'样本' + (index + 1)">
              <el-button type="warning" size="small" icon="el-icon-delete" slot="header" @click="deleteSample(index)">
                删除
              </el-button>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="输入数据" required>
                    <el-input
                      :rows="5"
                      type="textarea"
                      placeholder="请输入模拟输入的数据"
                      v-model="sample.input">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="输出数据" required>
                    <el-input
                      :rows="5"
                      type="textarea"
                      placeholder="请输入模拟输入的数据"
                      v-model="sample.output">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </Accordion>
          </el-form-item>
        </div>
        <div class="add-sample-btn">
          <button type="button" class="add-samples" @click="addSample()"><i class="el-icon-plus"></i>新增样本
          </button>
        </div>
        <el-form-item label="代码模板">
          <el-row>
            <el-col :span="24" v-for="(v, k) in template" :key="'template'+k">
              <el-form-item>
                <el-checkbox v-model="v.checked">{{ k }}</el-checkbox>
                <div v-if="v.checked">
                  <code-mirror v-model="v.code" :mode="v.mode"></code-mirror>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="特殊的判断机制" :error="error.spj">
          <el-col :span="24">
            <el-checkbox v-model="problem.spj" @click.native.prevent="switchSpj()">使用特殊的判断机制</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item v-if="problem.spj">
          <Accordion title="特殊判断机制的代码">
            <template slot="header">
              <span>SPJ language</span>
              <el-radio-group v-model="problem.spj_language">
                <el-tooltip class="spj-radio" v-for="lang in allLanguage.spj_languages" :key="lang.name" effect="dark"
                            :content="lang.description" placement="top-start">
                  <el-radio :label="lang.name">{{ lang.name }}</el-radio>
                </el-tooltip>
              </el-radio-group>
              <el-button type="primary" size="small" icon="el-icon-fa-random" @click="compileSPJ"
                         :loading="loadingCompile">
                编译
              </el-button>
            </template>
            <code-mirror v-model="problem.spj_code" :mode="spjMode"></code-mirror>
          </Accordion>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="测试实例" :error="error.testcase">
              <el-upload
                action="/api/test_case/"
                name="file"
                :data="{spj: problem.spj}"
                :show-file-list="false"
                :on-success="uploadSucceeded"
                :on-error="uploadFailed">
                <el-button size="small" type="primary" icon="el-icon-fa-upload">选择zip压缩包</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计分类型">
              <el-radio-group v-model="problem.rule_type" :disabled="disableRuleType">
                <el-radio label="ACM">ACM</el-radio>
                <el-radio label="OI">OI</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table
              :data="problem.test_case_score"
              style="width: 100%">
              <el-table-column
                prop="input_name"
                label="输入文件文件名">
              </el-table-column>
              <el-table-column
                prop="output_name"
                label="输出文件文件名">
              </el-table-column>
              <el-table-column
                prop="score"
                label="得分">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    placeholder="Score"
                    v-model="scope.row.score"
                    :disabled="problem.rule_type !== 'OI'">
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-form-item style="margin-top: 20px" label="提示">
          <Simditor v-model="problem.hint" placeholder=""></Simditor>
        </el-form-item>


        <el-form-item label="分类" v-if="showCollection ">
          <el-cascader :options="collectionList"
              :props="cascaderprops"
              v-model="collection"
              filterable
              clearable
              @change="handleCollectionChange"
              placeholder="选择题目分类">
        </el-cascader>
        </el-form-item>

        <el-form-item v-if="showCourse" label="课程">
          <el-row :gutter="5" style="margin-bottom: 15px">
              <el-col :span="6">
                <el-cascader :options="courseList"
                  :props="cascaderprops"
                  v-model="cascaderCourseID"
                  filterable
                  clearable
                  placeholder="选择题目所属课程">
                </el-cascader>
              </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="来源">
          <el-input placeholder="输入题目来源" v-model="problem.source"></el-input>
        </el-form-item>
        <save @click.native="submit()">保存</save>
      </el-form>
    </Panel>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor'
  import Accordion from '../../components/Accordion'
  import CodeMirror from '../../components/CodeMirror'
  import api from '../../api'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Problem',
    components: {
      Simditor,
      Accordion,
      CodeMirror
    },
    data () {
      return {
        rules: {
          _id: {required: true, message: '显示id未设置', trigger: 'blur'},
          title: {required: true, message: '题目未设置', trigger: 'blur'},
          input_description: {required: true, message: '输入数据描述未设置', trigger: 'blur'},
          output_description: {required: true, message: '输出数据描述未设置', trigger: 'blur'}
        },
        loadingCompile: false,
        mode: '',
        cascaderCourseID: [],
        contest: {},
        problem: {
          languages: []
        },
        reProblem: {
          languages: []
        },
        testCaseUploaded: false,
        showCollection: false,
        showCourse: false,
        allLanguage: {},
        inputVisible: false,
        tagInput: '',
        collectionList: [],
        collection: [],
        courseList: [],
        template: {},
        isEduProblem: false,
        title: '',
        cascaderprops: {
          value: 'id',
          label: 'name'
        },
        spjMode: '',
        disableRuleType: false,
        routeName: '',
        error: {
          tags: '',
          spj: '',
          languages: '',
          collection: '',
          testCase: ''
        }
      }
    },
    mounted () {
      let problemType = this.$route.params.problem
      if (problemType === 'edu') {
        this.showCollection = false
        this.showCourse = true
      } else if (problemType === 'ord') {
        this.showCollection = true
        this.showCourse = false
      }
      // 当学生题目配额已满是会抛出错误
      api.canCreateProblem().catch(() => {
        this.$router.push({path: '/problems'})
      })
      this.init()
      this.routeName = this.$route.name
      if (this.routeName === 'edit-problem') {
        this.mode = 'edit'
      } else if (this.routeName === 'edit-contest-problem') {
        this.mode = 'edit-contest'
      } else {
        this.mode = 'add'
      }
      api.getLanguages().then(res => {
        this.problem = this.reProblem = {
          _id: '',
          title: '',
          description: '',
          input_description: '',
          output_description: '',
          time_limit: 1000,
          memory_limit: 256,
          difficulty: 'Low',
          visible: true,
          tags: [],
          languages: [],
          template: {},
          samples: [{input: '', output: ''}],
          spj: false,
          spj_language: '',
          spj_code: '',
          spj_compile_ok: false,
          test_case_id: '',
          test_case_score: [],
          rule_type: 'ACM',
          hint: '',
          collection: '',
          course: [],
          source: ''
        }
        let contestID = this.$route.params.contestId
        if (contestID) {
          this.problem.contest = this.reProblem.contest = contestID
          this.disableRuleType = true
          api.getContest(contestID).then(res => {
            this.problem.rule_type = this.reProblem.rule_type = res.data.data.rule_type
            this.contest = res.data.data
          })
        }

        this.problem.spj_language = 'C'

        let allLanguage = res.data.data
        this.allLanguage = allLanguage

        // get problem after getting languages list to avoid find undefined value in `watch problem.languages`
        if (this.mode === 'edit' || this.mode === 'edit-contest') {
          this.title = '题目编辑'
          let funcName = {'edit-problem': 'getProblem', 'edit-contest-problem': 'getContestProblem'}[this.routeName]
          api[funcName](this.$route.params.problemId).then(problemRes => {
            let data = problemRes.data.data
            if (!data.spj_code) {
              data.spj_code = ''
            }
            data.spj_language = data.spj_language || 'C'
            this.problem = data
            this.testCaseUploaded = true
            let item
            if (this.problem.courses !== undefined && this.problem.courses.length > 0) {
              this.behoofvalue = 1
              // 数据回显
            } else {
              this.behoofvalue = 0
            }
            if (this.problem.collections !== undefined && this.problem.collections.length > 0) {
              for (item of this.problem.collections) {
                this.collection.push(item['id'])
              }
            }
            delete this.problem.courses
            delete this.problem.collections
            this.problem.collection = this.collection[this.collection.length - 1]
          })
        } else {
          this.title = '创建题目'
          for (let item of allLanguage.languages) {
            this.problem.languages.push(item.name)
          }
        }
      })
    },
    watch: {
      '$route' (newVal, oldVal) {
        this.$refs.form.resetFields()
        this.problem = this.reProblem
        this.init()
        if (newVal.name === 'create-problem') {
          this.mode = 'add'
        }
      },
      'problem.languages' (newVal) {
        let data = {}
        // use deep copy to avoid infinite loop
        let languages = JSON.parse(JSON.stringify(newVal)).sort()
        for (let item of languages) {
          if (this.template[item] === undefined) {
            let langConfig = this.allLanguage.languages.find(lang => {
              return lang.name === item
            })
            if (this.problem.template[item] === undefined) {
              data[item] = {checked: false, code: langConfig.config.template, mode: langConfig.content_type}
            } else {
              data[item] = {checked: true, code: this.problem.template[item], mode: langConfig.content_type}
            }
          } else {
            data[item] = this.template[item]
          }
        }
        this.template = data
      },
      'problem.spj_language' (newVal) {
        this.spjMode = this.allLanguage.spj_languages.find(item => {
          return item.name === this.problem.spj_language
        }).content_type
      }
    },
    methods: {
      findCourseByID (courseID, courseList = this.courseList) {
        for (let course of courseList) {
          if (course.id === courseID) {
            return course
          } else if (course.children !== undefined && course.children.length !== 0) {
            let courseObj = this.findCourseByID(courseID, course.children)
            if (courseObj) {
              return courseObj
            }
          }
        }
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
        this.problem.collection = value[ value.length - 1 ]
      },
      init () {
        this.routeName = this.$route.name
        if (this.showCollection) {
          this.getCollection()
        }
        if (this.showCourse) {
          this.getCourse()
        }
      },
      getCollection () {
        api.getCollection().then(res => {
          this.collectionList = res.data.data.collection
          this.changeChildren(this.collectionList)
        }).catch(() => {})
      },
      getCourse () {
        api.getCourse().then(res => {
          if (!this.$store.getters.isAdminRole) {
            api.getCourseChoice().then(choiceRes => {
              this.filterCourse(res.data.data.course, choiceRes.data.data.course_choice)
            }).catch(() => {})
          }
          this.courseList = res.data.data.course
          this.changeChildren(this.courseList)
        }).catch(() => {})
      },
      filterCourse (list, idlist) {
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (item.children) {
            this.filterCourse(item.children, idlist)
          }
          if (!this.itemhasCourseID(item, idlist)) {
            list.splice(list.findIndex(citem => citem.id === item.id), 1)
            i--
          }
        }
      },
      itemhasCourseID (item, idlist) {
        if (idlist.find((n) => n === item.id)) {
          return true
        }
        return this.childrenhasCourseID(item.children, idlist)
      },
      childrenhasCourseID (children, idlist) {
        if (!children) {
          return false
        }
        if (!children.length) {
          return false
        }

        for (let item of children) {
          if (idlist.find((n) => n === item.id)) {
            return true
          }
        }

        for (let item2 of children) {
          return this.childrenhasCourseID(item2.children, idlist)
        }
        return false
      },
      switchSpj () {
        if (this.testCaseUploaded) {
          this.$confirm('如果你更改题目的判题方式（例如：ACM改为IO），你需要重新上传测试实例', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.problem.spj = !this.problem.spj
            this.resetTestCase()
          }).catch(() => {
          })
        } else {
          this.problem.spj = !this.problem.spj
        }
      },
      querySearch (queryString, cb) {
        api.getProblemTagList().then(res => {
          let tagList = []
          for (let tag of res.data.data) {
            tagList.push({value: tag.name})
          }
          cb(tagList)
        }).catch(() => {
        })
      },
      resetTestCase () {
        this.testCaseUploaded = false
        this.problem.test_case_score = []
        this.problem.test_case_id = ''
      },
      addTag () {
        let inputValue = this.tagInput
        if (inputValue) {
          this.problem.tags.push(inputValue)
        }
        this.inputVisible = false
        this.tagInput = ''
      },
      closeTag (tag) {
        this.problem.tags.splice(this.problem.tags.indexOf(tag), 1)
      },
      addSample () {
        this.problem.samples.push({input: '', output: ''})
      },
      deleteSample (index) {
        this.problem.samples.splice(index, 1)
      },
      uploadSucceeded (response) {
        if (response.error) {
          this.$error(response.data)
          return
        }
        let fileList = response.data.info
        for (let file of fileList) {
          file.score = (100 / fileList.length).toFixed(0)
          if (this.problem.spj) {
            file.output_name = '-'
          }
        }
        this.problem.test_case_score = fileList
        this.testCaseUploaded = true
        this.problem.test_case_id = response.data.id
      },
      uploadFailed () {
        this.$error('文件上传出错')
      },
      compileSPJ () {
        let data = {
          id: this.problem.id,
          spj_code: this.problem.spj_code,
          spj_language: this.problem.spj_language
        }
        this.loadingCompile = true
        api.compileSPJ(data).then(res => {
          this.loadingCompile = false
          this.problem.spj_compile_ok = true
          this.error.spj = ''
        }, err => {
          this.loadingCompile = false
          this.problem.spj_compile_ok = false
          const h = this.$createElement
          this.$msgbox({
            title: '编译错误',
            type: 'error',
            message: h('pre', err.data.data),
            showCancelButton: false,
            closeOnClickModal: false,
            customClass: 'dialog-compile-error'
          })
        })
      },
      submit () {
        if (!this.problem.samples.length) {
          this.$error('样本未设置')
          return
        }
        for (let sample of this.problem.samples) {
          if (!sample.input || !sample.output) {
            this.$error('样本的输出和输入为设置')
            return
          }
        }
        if (this.problem.spj) {
          if (!this.problem.spj_code) {
            this.error.spj = 'Spj 代码未输入'
            this.$error(this.error.spj)
          } else if (!this.problem.spj_compile_ok) {
            this.error.spj = 'SPJ 代码没有编译通过'
          }
          if (this.error.spj) {
            this.$error(this.error.spj)
            return
          }
        }
        if (!this.problem.languages.length) {
          this.error.languages = '请为这个题目设置支持语言'
          this.$error(this.error.languages)
          return
        }
        if (!this.testCaseUploaded) {
          this.error.testCase = '测试实例还没有上传'
          this.$error(this.error.testCase)
          return
        }
        if (this.problem.rule_type === 'OI') {
          for (let item of this.problem.test_case_score) {
            try {
              if (parseInt(item.score) <= 0) {
                this.$error('无效的测试实例得分')
                return
              }
            } catch (e) {
              this.$error('测试实例的得分必须是一个整形数字')
              return
            }
          }
        }
        let difficulty = {
          '简单': 'Low',
          '中等': 'Mid',
          '困难': 'High',
          'Low': 'Low',
          'Mid': 'Mid',
          'High': 'High'
        }
        this.problem.difficulty = difficulty[this.problem.difficulty]
        if ((this.routeName !== 'create-contest-problem' || this.routeName !== 'edit-contest-problem') && this.problem.collection === '' && !this.behoofvalue) {
          this.$error('未设置题目分类')
          return
        }
        if ((this.routeName !== 'create-contest-problem' || this.routeName !== 'edit-contest-problem') && this.problem.course.length === 0 && this.behoofvalue === 1) {
          this.$error('请至少设置一个课程')
          return
        } else {
          this.problem.course = this.cascaderCourseID[this.cascaderCourseID.length - 1]
        }
        this.problem.languages = this.problem.languages.sort()
        this.problem.template = {}
        for (let k in this.template) {
          if (this.template[k].checked) {
            this.problem.template[k] = this.template[k].code
          }
        }
        let funcName = {
          'create-problem': 'createProblem',
          'edit-problem': 'editProblem',
          'create-contest-problem': 'createProblem',
          'edit-contest-problem': 'editContestProblem'
        }[this.routeName]
        // edit contest problem 时, contest_id会被后来的请求覆盖掉
        if (funcName === 'editContestProblem') {
          this.problem.contest = this.contest.id
        }
        api[funcName](this.problem).then(res => {
          if (this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem') {
            this.$router.push({name: 'contest-problem-list', params: {contestId: this.$route.params.contestId}})
          } else {
            this.$router.push({name: 'problem-list'})
          }
        }).catch(() => {
        })
      }
    },
    computed: {
      ...mapGetters(['isAdminRole'])
    }
  }
</script>

<style lang="less" scoped>
  .problem {
    .difficulty-select {
      width: 120px;
    }
    .spj-radio {
      margin-left: 10px;
      &:last-child {
        margin-right: 20px;
      }
    }
    .input-new-tag {
      width: 78px;
    }
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .tags {
      .el-tag {
        margin-right: 10px;
      }
    }
    .accordion {
      margin-bottom: 10px;
    }
    .add-samples {
      width: 100%;
      background-color: #fff;
      border: 1px dashed #aaa;
      outline: none;
      cursor: pointer;
      color: #666;
      height: 35px;
      font-size: 14px;
      &:hover {
        background-color: #f9fafc;
      }
      i {
        margin-right: 10px;
      }
    }
    .add-sample-btn {
      margin-bottom: 10px;
    }

  }
</style>

<style>
  .dialog-compile-error {
    width: auto;
    max-width: 80%;
    overflow-x: scroll;
  }
</style>
