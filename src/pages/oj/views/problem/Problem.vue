<template>
  <div class="flex-container">
    <div id="problem-main" onselectstart="return false;">
      <!--problem main-->
      <Panel :padding="40" shadow>
        <div slot="title">{{problem.title}}</div>
        <div id="problem-content" class="markdown-body">
          <p class="title">问题描述</p>
          <p class="content" v-html=problem.description></p>

          <p class="title">输入</p>
          <p class="content" v-html=problem.input_description></p>

          <p class="title">输出</p>
          <p class="content" v-html=problem.output_description></p>

          <div v-for="sample, index in problem.samples">
            <div class="flex-container sample">
              <div class="sample-input">
                <p class="title">输出例子 {{index + 1}}
                  <a class="copy"
                     v-clipboard:copy="sample.input"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onCopyError">
                    <Icon type="clipboard"></Icon>
                  </a>
                </p>
                <pre>{{sample.input}}</pre>
              </div>
              <div class="sample-output">
                <p class="title">输出例子 {{index + 1}}</p>
                <pre>{{sample.output}}</pre>
              </div>
            </div>
          </div>

          <div v-if="problem.hint">
            <p class="title">提示</p>
            <Card dis-hover>
              <div class="content" v-html=problem.hint></div>
            </Card>
          </div>

          <div v-if="problem.source">
            <p class="title">来源</p>
            <p class="content">{{problem.source}}</p>
          </div>

          <!--测试文件下载 -->
          <div v-if="!contestID">
            <p class="title">测试数据下载</p>
            <Button type="primary" @click="downloadTestCase(problem.id)" shape="circle">下载</Button>
          </div>
        </div>
      </Panel>
      <!--problem main end-->
      <Card :padding="20" id="submit-code" dis-hover>
        <CodeMirror :value.sync="code" @changeLang="onChangeLang" :languages="problem.languages"
                    :language="language"></CodeMirror>
        <Row type="flex" justify="space-between">
          <Col :span="10">
          <div class="status" v-if="statusVisible">
            <template v-if="!this.contestID || (this.contestID && OIContestRealTimePermission)">
              <span>状态:</span>
              <Tag type="dot" :color="submissionStatus.color" @click.native="handleRoute('/status/'+submissionId)">
                {{submissionStatus.text}}
              </Tag>
            </template>
            <template v-else-if="this.contestID && !OIContestRealTimePermission">
              <Alert type="success" show-icon>提交成功</Alert>
            </template>
          </div>
          <div v-else-if="problem.my_status === 0">
            <Alert type="success" show-icon>你已经解决了该问题</Alert>
          </div>
          <div v-else-if="this.contestID && !OIContestRealTimePermission && submissionExists">
            <Alert type="success" show-icon>你已经提交了一个解决方案</Alert>
          </div>
          <div v-if="contestEnded">
            <Alert type="warning" show-icon>比赛结束</Alert>
          </div>
          </Col>

          <Col :span="12">
          <template v-if="captchaRequired">
            <div class="captcha-container">
              <Tooltip v-if="captchaRequired" content="点击刷新" placement="top">
                <img :src="captchaSrc" @click="getCaptchaSrc"/>
              </Tooltip>
              <Input v-model="captchaCode" class="captcha-code"/>
            </div>
          </template>
          <Button type="warning" icon="edit" :loading="submitting" @click="submitCode" :disabled="problemSubmitDisabled"
                  class="fl-right">
            <span v-if="!submitting">提交</span>
            <span v-else>提交中</span>
          </Button>
          </Col>
        </Row>
      </Card>
    </div>

    <div id="right-column">
      <VerticalMenu @on-click="handleRoute">
        <template v-if="this.contestID">
          <VerticalMenu-item :route="{name: 'contest-problem-list', params: {contestID: contestID}}">
            <Icon type="ios-photos"></Icon>
            题目
          </VerticalMenu-item>

          <VerticalMenu-item :route="{name: 'contest-announcement-list', params: {contestID: contestID}}">
            <Icon type="chatbubble-working"></Icon>
            公告
          </VerticalMenu-item>
        </template>

        <VerticalMenu-item v-if="!this.contestID || OIContestRealTimePermission" :route="submissionRoute">
          <Icon type="navicon-round"></Icon>
          提交
        </VerticalMenu-item>

        <VerticalMenu-item v-if="!this.contestID" :route="{path: `/comments/${this.problem.id}`}">
          <Icon type="chatbubble-working"></Icon>
          讨论
        </VerticalMenu-item>

        <template v-if="this.contestID">
          <VerticalMenu-item v-if="!this.contestID || OIContestRealTimePermission"
                             :route="{name: 'contest-rank', params: {contestID: contestID}}">
            <Icon type="stats-bars"></Icon>
            竞赛
          </VerticalMenu-item>
          <VerticalMenu-item :route="{name: 'contest-details', params: {contestID: contestID}}">
            <Icon type="home"></Icon>
            查看竞赛
          </VerticalMenu-item>
        </template>
      </VerticalMenu>

      <Card id="info" v-if="!this.contestID">
        <div slot="title" class="header">
          <Icon type="star"></Icon>
          <span class="card-title">评价</span>
        </div>
        <div>
          <Badge :count="this.problem.vote.up" overflow-count="99">
            <Button :type="thumbsupType" shape="circle" @click="thumbsupProblem" icon="thumbsup" size="large"></Button>
          </Badge>
          <Badge :count="this.problem.vote.down" overflow-count="99">
            <Button :type="thumbsdownType" shape="circle" @click="thumbsdownProblem" icon="thumbsdown" size="large"></Button>
          </Badge>
        </div>
      </Card>

      <Card id="info">
        <div slot="title" class="header">
          <Icon type="information-circled"></Icon>
          <span class="card-title">信息</span>
        </div>
        <ul>
          <li><p>ID</p>
            <p>{{problem._id}}</p></li>
          <li>
            <p>限制时间</p>
            <p>{{problem.time_limit}}MS</p></li>
          <li>
            <p>限制内存</p>
            <p>{{problem.memory_limit}}MB</p></li>
          <li>
            <p>创建者</p>
            <p>{{real_name}}</p></li>
          <li v-if="problem.difficulty">
            <p>难度</p>
            <p>{{problem.difficulty}}</p></li>
          <li v-if="problem.total_score">
            <p>得分</p>
            <p>{{problem.total_score}}</p>
          </li>
          <li>
            <p>标签</p>
            <p>
              <Poptip trigger="hover" placement="left-end">
                <a>显示</a>
                <div slot="content">
                  <Tag v-for="tag in problem.tags" :key="tag">{{tag}}</Tag>
                </div>
              </Poptip>
            </p>
          </li>
          <li>
            <p v-if="collection">类别</p>
            <p>{{collection}}</p>
          </li>
          <li>
            <p>状态</p>
            <p>{{problem.is_valid === true? '已审核':'未审核'}}</p>
          </li>
        </ul>
      </Card>

      <Card id="pieChart" :padding="0" v-if="!this.contestID || OIContestRealTimePermission">
        <div slot="title">
          <Icon type="ios-analytics"></Icon>
          <span class="card-title">统计</span>
          <Button type="ghost" size="small" id="detail" @click="graphVisible = !graphVisible">详细</Button>
        </div>
        <div class="echarts">
          <ECharts :options="pie"></ECharts>
        </div>
      </Card>
    </div>

    <Modal v-model="graphVisible">
      <div id="pieChart-detail">
        <ECharts :options="largePie" :initOptions="largePieInitOpts"></ECharts>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="graphVisible=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import utils from '@/utils/utils'
  import { types } from '../../../../store'
  import CodeMirror from '@oj/components/CodeMirror.vue'
  import storage from '@/utils/storage'
  import { FormMixin } from '@oj/components/mixins'
  import { JUDGE_STATUS, CONTEST_STATUS, buildProblemCodeKey } from '@/utils/constants'
  import api from '@oj/api'
  import { pie, largePie } from './chartData'

  // 只显示这些状态的图形占用
  const filtedStatus = ['-1', '-2', '0', '1', '2', '3', '4', '8']

  export default {
    name: 'Problem',
    components: {
      CodeMirror
    },
    mixins: [FormMixin],
    data () {
      return {
        statusVisible: false,
        captchaRequired: false,
        graphVisible: false,
        submissionExists: false,
        captchaCode: '',
        captchaSrc: '',
        contestID: '',
        problemID: '',
        submitting: false,
        displayID: '',
        collection: '',
        code: '',
        real_name: '',
        language: 'C++',
        submissionId: '',
        thumbsupType: 'ghost',
        thumbsdownType: 'ghost',
        result: {
          result: 9
        },
        thumbsupOption: {
          is_up: true
        },
        thumbsdownOption: {
          is_up: false
        },
        problem: {
          title: '',
          description: '',
          hint: '',
          my_status: '',
          template: {},
          vote: {
            up: 0,
            down: 0
          },
          languages: [],
          created_by: {
            username: ''
          },
          tags: []
        },
        pie: pie,
        largePie: largePie,
        // echarts 无法获取隐藏dom的大小，需手动指定
        largePieInitOpts: {
          width: '500',
          height: '480'
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      let problemCode = storage.get(buildProblemCodeKey(to.params.problemID, to.params.contestID))
      if (problemCode) {
        next(vm => {
          vm.language = problemCode.language
          vm.code = problemCode.code
        })
      } else {
        next()
      }
    },
    mounted () {
      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: false})
      this.init()
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init () {
        this.$Loading.start()
        this.contestID = this.$route.params.contestID
        this.problemID = this.$route.params.problemID
        let func = this.$route.name === 'problem-details' ? 'getProblem' : 'getContestProblem'
        api[func](this.problemID, this.contestID).then(res => {
          this.$Loading.finish()
          this.$nextTick(() => {
            if (window.MathJax) {
              window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, 'problem-content'])
            }
          })
          let problem = res.data.data
          this.real_name = problem.userprofile.real_name
          this.displayID = problem._id
          if (problem.vote_status === 1) {
            this.thumbsupType = 'primary'
          } else if (problem.vote_status === 2) {
            this.thumbsdownType = 'primary'
          }
          this.changeDomTitle({title: problem.title})
          api.submissionExists(problem.id).then(res => {
            this.submissionExists = res.data.data
          })
          problem.languages = problem.languages.sort()
          this.problem = problem
          // 处理题目描述中的图片显示
          this.addImageWidth()
          if (problem.collections !== null && problem.collections.length !== 0) {
            this.collection = problem.collections[problem.collections.length - 1].name
          }
          this.changePie(problem)
          // 在beforeRouteEnter中修改了, 说明本地有code， 无需加载template
          if (this.language !== 'C++' || this.code !== '' || this.problem.languages.indexOf(this.language) !== -1) {
            return
          }
          this.language = this.problem.languages[0]
          let template = this.problem.template
          if (template && template[this.language]) {
            this.code = template[this.language]
          }
        }, () => {
          this.$Loading.error()
        })
      },
      // 为img标签添加宽度 防止撑开div
      addImageWidth () {
        this.problem.description = this.problem.description.replace(/<img/g, '<img style="width:100%" ')
      },
      downloadTestCase (problemID) {
        let url = `/test_case/?problem_id=${problemID}`
        utils.downloadFile(url)
      },
      thumbsupProblem () {
        api.evaluateProblem(this.problem.id, this.thumbsupOption).then(res => {
          if (res.data.error === null) {
            this.problem.vote.up++
            this.thumbsupType = 'primary'
          }
        }).catch(() => {})
      },
      thumbsdownProblem () {
        api.evaluateProblem(this.problem.id, this.thumbsdownOption).then(res => {
          if (res.data.error === null) {
            this.problem.vote.down++
            this.thumbsdownType = 'primary'
          }
        }).catch(() => {})
      },
      changePie (problemData) {
        // 只显示特定的一些状态
        for (let k in problemData.statistic_info) {
          if (filtedStatus.indexOf(k) === -1) {
            delete problemData.statistic_info[k]
          }
        }
        let acNum = problemData.accepted_number
        let data = [
          {name: '错误', value: problemData.submission_number - acNum},
          {name: '正确', value: acNum}
        ]
        this.pie.series[0].data = data
        // 只把大图的AC selected下，这里需要做一下deepcopy
        let data2 = JSON.parse(JSON.stringify(data))
        data2[1].selected = true
        this.largePie.series[1].data = data2

        // 根据结果设置legend,没有提交过的legend不显示
        let legend = Object.keys(problemData.statistic_info).map(ele => JUDGE_STATUS[ele].name)
        if (legend.length === 0) {
          legend.push('正确', '错误')
        }
        this.largePie.legend.data = legend

        // 把ac的数据提取出来放在最后
        let acCount = problemData.statistic_info['0']
        delete problemData.statistic_info['0']

        let largePieData = []
        Object.keys(problemData.statistic_info).forEach(ele => {
          largePieData.push({name: JUDGE_STATUS[ele].name, value: problemData.statistic_info[ele]})
        })
        largePieData.push({name: '正确', value: acCount})
        this.largePie.series[0].data = largePieData
      },
      handleRoute (route) {
        this.$router.push(route)
      },
      onChangeLang (newLang) {
        if (this.problem.template[newLang]) {
          if (this.code.trim() === '') {
            this.code = this.problem.template[newLang]
          } else {
            this.$Modal.confirm({
              content: `这道题目拥有 ${newLang} 的代码模板, 你希望模板代码替换你的代码吗?`,
              onOk: () => {
                this.code = this.problem.template[newLang]
              }
            })
          }
        }
        this.language = newLang
      },
      checkSubmissionStatus () {
        // 使用setTimeout避免一些问题
        if (this.refreshStatus) {
          // 如果之前的提交状态检查还没有停止,则停止,否则将会失去timeout的引用造成无限请求
          clearTimeout(this.refreshStatus)
        }
        const checkStatus = () => {
          let id = this.submissionId
          api.getSubmission(id).then(res => {
            this.result = res.data.data
            if (Object.keys(res.data.data.statistic_info).length !== 0) {
              this.submitting = false
              clearTimeout(this.refreshStatus)
              this.init()
            } else {
              this.refreshStatus = setTimeout(checkStatus, 2000)
            }
          }, res => {
            this.submitting = false
            clearTimeout(this.refreshStatus)
          })
        }
        this.refreshStatus = setTimeout(checkStatus, 2000)
      },
      submitCode () {
        if (this.code.trim() === '') {
          this.$error('代码不能为空')
          return
        }
        this.submissionId = ''
        this.result = {result: 9}
        this.submitting = true
        let data = {
          problem_id: this.problem.id,
          language: this.language,
          code: this.code,
          contest_id: this.contestID
        }
        if (this.captchaRequired) {
          data.captcha = this.captchaCode
        }
        const submitFunc = (data, detailsVisible) => {
          this.statusVisible = true
          api.submitCode(data).then(res => {
            this.submissionId = res.data.data && res.data.data.submission_id
            // 定时检查状态
            this.submitting = false
            this.submissionExists = true
            if (!detailsVisible) {
              this.$Modal.success({
                title: '操作成功',
                content: '代码上传成功'
              })
              return
            }
            this.checkSubmissionStatus()
          }, res => {
            this.getCaptchaSrc()
            if (res.data.data.startsWith('Captcha is required')) {
              this.captchaRequired = true
            }
            this.submitting = false
            this.statusVisible = false
          })
        }

        if (this.contestRuleType === 'OI' && !this.OIContestRealTimePermission) {
          if (this.submissionExists) {
            this.$Modal.confirm({
              title: '',
              content: '<h3>你对这道题目已经有提交记录了，是否选择覆盖先前记录?<h3>',
              onOk: () => {
                // 暂时解决对话框与后面提示对话框冲突的问题(否则一闪而过）
                setTimeout(() => {
                  submitFunc(data, false)
                }, 1000)
              },
              onCancel: () => {
                this.submitting = false
              }
            })
          } else {
            submitFunc(data, false)
          }
        } else {
          submitFunc(data, true)
        }
      },
      onCopy (event) {
        this.$success('复制成功')
      },
      onCopyError (e) {
        this.$error('复制失败')
      }
    },
    computed: {
      ...mapGetters(['problemSubmitDisabled', 'contestRuleType', 'OIContestRealTimePermission', 'contestStatus']),
      contest () {
        return this.$store.state.contest.contest
      },
      contestEnded () {
        return this.contestStatus === CONTEST_STATUS.ENDED
      },
      submissionStatus () {
        return {
          text: JUDGE_STATUS[this.result.result]['name'],
          color: JUDGE_STATUS[this.result.result]['color']
        }
      },
      submissionRoute () {
        if (this.contestID) {
          return {name: 'contest-submission-list', query: {problemID: this.displayID}}
        } else {
          return {name: 'submission-list', query: {problemID: this.problemID}}
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      // 防止切换组件后仍然不断请求
      clearInterval(this.refreshStatus)

      this.$store.commit(types.CHANGE_CONTEST_ITEM_VISIBLE, {menu: true})
      storage.set(buildProblemCodeKey(this.problem._id, from.params.contestID), {
        code: this.code,
        language: this.language
      })
      next()
    },
    watch: {
      '$route' () {
        this.init()
      }
    }
  }
</script>

<style lang="less" scoped>
  .card-title {
    margin-left: 8px;
  }

  .flex-container {
    #problem-main {
      flex: auto;
      margin-right: 18px;
    }
    #right-column {
      flex: none;
      width: 220px;
    }
  }

  #problem-content {
    margin-top: -50px;
    .title {
      font-size: 20px;
      font-weight: 400;
      margin: 25px 0 8px 0;
      color: #3091f2;
      .copy {
        padding-left: 8px;
      }
    }
    p.content {
      margin-left: 25px;
      margin-right: 20px;
      font-size: 15px
    }
    .sample {
      align-items: stretch;
      &-input, &-output {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        margin-right: 5%;
      }
      pre {
        flex: 1 1 auto;
        align-self: stretch;
        border-style: solid;
        background: transparent;
      }
    }
  }

  #submit-code {
    margin-top: 20px;
    margin-bottom: 20px;
    .status {
      float: left;
      span {
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    .captcha-container {
      display: inline-block;
      .captcha-code {
        width: auto;
        margin-top: -20px;
        margin-left: 20px;
      }
    }
  }

  #info {
    margin-bottom: 20px;
    margin-top: 20px;
    ul {
      list-style-type: none;
      li {
        border-bottom: 1px dotted #e9eaec;
        margin-bottom: 10px;
        p {
          display: inline-block;
        }
        p:first-child {
          width: 90px;
        }
        p:last-child {
          float: right;
        }
      }
    }
  }

  .fl-right {
    float: right;
  }

  #pieChart {
    .echarts {
      height: 250px;
      width: 210px;
    }
    #detail {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  #pieChart-detail {
    margin-top: 20px;
    width: 500px;
    height: 480px;
  }
</style>
