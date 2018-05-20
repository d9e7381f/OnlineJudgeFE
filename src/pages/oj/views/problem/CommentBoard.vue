<template>
  <Panel shadow :padding="10">
    <div slot="title">
      留言板
    </div>
     <div slot="extra">
      <Button icon="ios-undo" @click="goBack">返回</Button>
    </div>
    <div>
      <template v-if="commentList.length">
        <template v-for="comment in commentList" >
          <Card style="margin-top:10px;" :key="comment.id">
            <div slot="title">
              <img :src="comment.user.avatar" class="avatar">
              <div class="extra">
                <p class="comment-author">{{comment.user.real_name}}</p>
                <p class="comment-time">{{comment.create_time | localtime }}</p>
              </div>
            </div>
            <div>
              <p class="content" v-html=comment.content></p>
            </div>
          </Card>
        
        </template>
       </template>
       <template v-else>
         <Card>
           <p class="content">暂无评论</p>
         </Card>
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
      }).catch(() => {})
    },
    goBack () {
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
  .extra {
    margin-left: 10px;
    display: inline-block;
  }

  p.content {
    margin-right: 20px;
    font-size: 25px;
  }

  .avatar {
    width: 50px;
    border-radius:25px;
    -moz-border-radius:25px; /* Old Firefox */
  }

  .fl-right {
    margin-top: 10px;
    float: right;
  }
</style>
