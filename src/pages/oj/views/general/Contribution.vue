<template>
  <Row type="flex" :gutter="18">
    <Col :span=19>
      <Panel shadow :padding="10">
        <div slot="title">
          {{title}}
        </div>
        <div slot="extra">
        </div>
        
        <div class="no-contribution" v-if="!contributions.length" key="no-contribution">
          <p>暂无数据</p>
        </div>
        <div v-else key="has-contribution">
          <p>have data</p>
        </div>
      
      </Panel>
    </Col>

    <Col :span="5">
      <Panel :padding="10" align="center">
        <div slot="title" >用户信息</div>
        <img class="avatar" :src="user.avatar"/>
      </Panel>
    </Col>
  </Row>
</template>

<script>
  import api from '@oj/api'

  export default {
    name: 'Contribution',
    data () {
      return {
        title: '贡献榜',
        limit: 10,
        total: 10,
        page: 1,
        btnLoading: false,
        user: {},
        contributions: []
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getContributionList()
      },
      getContributionList (page = 1) {
        let offset = (page - 1) * this.limit
        this.btnLoading = true
        api.getContributionList(offset, this.limit, false, false).then(res => {
          this.btnLoading = false
          this.contributions = res.data.data.results
          this.total = res.data.data.total
        }, () => {
          this.btnLoading = false
        })
      },
      goUser (username) {
        console.log('visit username:' + username)
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
