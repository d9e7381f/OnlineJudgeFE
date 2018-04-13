<template>
  <Row type="flex" :gutter="18">
    <Col :span=19>
      <Panel shadow :padding="10">
        <div slot="title">
          {{title}}
        </div>
        <transition-group mode="in-out">
          <div class="no-contribution" v-if="!contributions.length" key="no-contributiont">
            <p>暂无数据</p>
          </div>
          <template>
            <ul class="contribution-container" key="list">
              <li v-for="contribution in contributions">
                <div class="flex-container">
                  <div class="title"><a class="entry" @click="goUser(contribution.name)">
                    {{contribution.name}}</a></div>
                  <div class="date">班级:{{contribution.classes }}</div>
                  <div class="creator"> 贡献值 {{contribution.contribution}}</div>
                </div>
              </li>
            </ul>
          </template>
        </transition-group>
      </Panel>
    </Col>

    <Col :span="5">
      <Panel :padding="10">
        <div slot="title" >用户信息</div>
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
        btnLoading: false,
        contributions: [
          {
            name: 'root',
            contribution: 100,
            classes: '2016级软件1班'
          },
          {
            name: 'teacher',
            contribution: 100,
            classes: '2016级软件1班'
          }
        ]
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {

      },
      getContributionList (page = 1) {
        let params = {
          limit: this.limit,
          offset: (page - 1) * this.limit
        }
        this.btnLoading = true
        api.getAnnouncementList(params).then(res => {
          this.btnLoading = false
          this.announcements = res.data.data.results
          this.total = res.data.data.total
        }, () => {
          this.btnLoading = false
        })
      },
      goUser (username) {
        console.log('visit username:' + username)
        this.$router.push({path: '/user-home?username=' + username})
      }
    }
  }
</script>

<style scoped lang="less">
  .contribution-container {
    margin-top: -10px;
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
</style>
