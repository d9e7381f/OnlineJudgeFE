<template>
  <Panel shadow :padding="10">
    <div slot="title">
      留言板
    </div>
     <div slot="extra">
      <Button icon="ios-undo" @click="goBack">返回</Button>
    </div>
    <div>
      <template v-for="comment in commentList" >
        <div :key="comment.id" class="comment-main">
          <div class="comment-author">
            {{comment.user}}
          </div>
          <div class="comment-content">
            <p class="content" v-html=comment.content></p>
          </div>
          <div class="comment-time">
            <div class="date">{{comment.create_time | localtime }}</div>
          </div>
          
        </div>
      </template>
    </div>
    <div>
    <Row>
      <Col :span="24">
        <Pagination class="fl-right" 
                  key="page"
                  :total="total"
                  :page-size="limit"
                  :current.sync="page"
                  @on-change="getComment">
        </Pagination>
      </Col>
    </Row>
    </div>
    <Simditor v-model="comment"></Simditor>
      <Row>
        <Col :span="24">
          <Button type="primary" icon="edit" @click="submit" class="fl-right">
            <span>发表</span>       
          </Button>
        </Col>
      </Row>
  </Panel>
</template>
<script>
import api from '@oj/api'
import Simditor from '../../components/Simditor'
import Pagination from '@oj/components/Pagination'
export default {
  name: 'CommentBoard',
  components: {
    Simditor,
    Pagination
  },
  data () {
    return {
      total: 10,
      limit: 10,
      problemID: 0,
      comment: '',
      page: 1,
      commentList: []
    }
  },
  methods: {
    init () {
      this.problemID = this.$route.params.problemID
      this.getComment()
    },
    getComment () {
      api.getProblemComments(this.problemID, {page: this.page, limit: this.limit, offset: this.limit * (this.page - 1)}).then(res => {
        this.commentList = res.data.data.results
        this.total = res.data.data.total
        this.addImageWidth()
        console.log(this.commentList)
      }).catch(() => {})
    },
    goBack () {
      console.log('goback')
      this.$router.push({path: `/problem/${this.problemID}`})
    },
    // 为img标签添加宽度 防止撑开div
    addImageWidth () {
      for (let comment of this.commentList) {
        comment.content = comment.content.replace(/<img /g, '<img style="width:100%" ')
      }
    },
    submit () {
      api.postProblemComment(this.problemID, { 'content': this.comment }).catch(() => {})
    }
  },
  mounted () {
    this.init()
  }

}
</script>

<style lang="less" scoped>
  .comment-main {
    margin-left: 5px;
    .comment-author{
      font-size: 2em;
    }
  }
  p.content {
    margin-left: 25px;
    margin-right: 20px;
    font-size: 15px
  }

  .date {
    flex: none;
    width: 200px;
    text-align: center;
  }

  .fl-right {
    margin-top: 10px;
    float: right;
  }
</style>
