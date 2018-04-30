<template>
  <Row type="flex" :gutter="18">
    <Col :span=19>
      <Panel shadow :padding="10">
        <div slot="title">
          {{title}}
        </div>
        <div slot="extra">
           <i-switch size="large" @on-change="handleOrderBy" v-model='mode'>
              <span slot="open">题目</span>
              <span slot="close">好评</span>
            </i-switch>
        </div>
        <div key="Math.random()">
          <Row :gutter="20">
            <Col :span="24">
              <Table
                :columns="tableColumns"
               :data="contributionList"
               :loading="loadings"
               size="large"
               disabled-hover></Table>
               <Pagination :total="total" :page-size="limit" :current.sync="page" @on-change="getContributionList(problemPage)"></Pagination>
            </Col>
          </Row>
        </div>
      
      </Panel>
    </Col>
    <Col :span="5">
      <Panel :padding="10" align="center">
        <div slot="title" >说明</div>
        <div align="left">
          <p>1.只要当提交的题目通过审核才会计入到贡献数目</p>
          <p>2.当提交的题目得到其他人的点赞将会为你积累点赞值</p>
        </div>
      </Panel>
    </Col>
  </Row>
</template>

<script>
  import Pagination from '@oj/components/Pagination'
  import api from '@oj/api'

  export default {
    name: 'Contribution',
    components: {
      Pagination
    },
    data () {
      return {
        title: '贡献榜',
        loadings: true,
        limit: 10,
        total: 10,
        page: 1,
        mode: true,
        contributionList: [],
        avatarColor: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'],
        tableColumns: [
          {
            title: '排名',
            width: '10%',
            render: (h, parms) => {
              let index = parms.index + this.limit * (this.page - 1)
              if (index < 4) {
                return h('Avatar', {
                  attrs: {
                    align: 'center'
                  },
                  shape: 'circle',
                  size: 'small',
                  style: {
                    background: this.avatarColor[parms.index]
                  }
                }, index + 1)
              } else {
                return h('p', {
                  style: {
                    padding: '10px'
                  }
                }, index + 1)
              }
            }
          },
          {
            title: '学号',
            width: '15%',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.goUser(params.row.username)
                  }
                },
                style: {
                  padding: '2px 0'
                }
              }, params.row.username)
            }
          },
          {
            title: '姓名',
            width: '10%',
            render: (h, params) => {
              return h('p', {}, params.row.profile.real_name)
            }
          },
          {
            title: '班级',
            width: '20%',
            key: 'group'
          },
          {
            title: '题目贡献量',
            width: '15%',
            key: 'problem_count'
          },
          {
            title: '题目好评量',
            width: '15%',
            key: 'vote_count'
          },
          {
            title: '心情',
            render: (h, params) => {
              return h('p', {}, params.row.profile.mood)
            }
          }
        ]
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        if (this.mode) {
          this.getVoteContributionList()
        } else {
          this.getProblemContributionList()
        }
      },
      getContributionList (page) {
        if (this.mode) {
          this.getVoteContributionList(page)
        } else {
          this.getProblemContributionList(page)
        }
      },
      handleOrderBy (value) {
        this.loadings = true
        this.page = 1
        if (value) {
          this.getVoteContributionList()
        } else {
          this.getProblemContributionList()
        }
        this.loadings = false
      },
      getProblemContributionList (page = 1) {
        let offset = (page - 1) * this.limit
        this.loadings = true
        api.getContributionList(offset, this.limit, false, true).then(res => {
          res.data.data.results.sort((b, a) => {
            return a.problem_count === b.problem_count ? a.id - b.id : a.problem_count - b.problem_count
          })
          this.contributionList = res.data.data.results
          this.total = res.data.data.total
        }, () => {}).catch(() => {
          this.loadings = false
        })
        this.loadings = false
      },
      getVoteContributionList (page = 1) {
        let offset = (page - 1) * this.limit
        this.loadings = true
        api.getContributionList(offset, this.limit, true, false).then(res => {
          res.data.data.results.sort((b, a) => {
            return a.vote_count === b.vote_count ? a.id - b.id : a.vote_count - b.vote_count
          })
          this.contributionList = res.data.data.results
          this.total = res.data.data.total
        }, () => {}).catch(() => {
          this.loadings = false
        })
        this.loadings = false
      },
      goUser (username) {
        this.$router.push({path: `/user-home?username=${username}`})
      }
    }
  }
</script>

<style scoped lang="less">
  .contribution-container {
    margin-top: 20px;
    margin-bottom: 10px;
    li {
      list-style: none;
      padding-top: 15px;
      padding-bottom: 15px;
      margin-left: 20px;
      font-size: 16px;
      border-bottom: 1px solid rgba(187, 187, 187, 0.5);
      &:last-child {
        border-bottom: none;
      }
      .flex-container {
        .title {
          flex: 1 1;
          text-align: left;
          padding-left: 10px;
          a.entry {
            color: #495060;
            &:hover {
              color: #2d8cf0;
              border-bottom: 1px solid #2d8cf0;
            }
          }
        }
        .creator {
          flex: none;
          width: 200px;
          text-align: center;
        }
        .date {
          flex: none;
          width: 200px;
          text-align: center;
        }
      }
    }
  }

  .content-container {
    padding: 0 20px 20px 20px;
  }

  .no-contribution {
    text-align: center;
    font-size: 16px;
  }

  .contribution-animate-enter-active {
    animation: fadeIn 1s;
  }

  .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        box-shadow: 0 1px 1px 0;
  }

  #userinfo-label{
    margin-top: 10px;
  }
</style>
