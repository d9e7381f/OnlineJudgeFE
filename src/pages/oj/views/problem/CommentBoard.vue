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
        <div :key="comment.id">
          <p class="content" v-html=comment.content></p>
        </div>
      </template>
    </div>
    <template>
      <Simditor v-model="comment"></Simditor>
      <Row>
        <Col :span="24">
          <Button type="primary" icon="edit" @click="submit" class="fl-right">
            <span>发表</span>       
          </Button>
        </Col>
      </Row>
    </template>
  </Panel>
</template>
<script>
import api from '@oj/api'
import Simditor from '../../components/Simditor'
export default {
  name: 'CommentBoard',
  components: {
    Simditor
  },
  data () {
    return {
      total: 0,
      limit: 10,
      problemID: 0,
      comment: '',
      commentList: []
    }
  },
  methods: {
    init () {
      this.problemID = this.$route.params.problemID
      this.getComment()
    },
    getComment () {
      api.getProblemComments(this.problemID).then(res => {
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
  p.content {
    margin-left: 25px;
    margin-right: 20px;
    font-size: 15px
  }

  .fl-right {
    margin-top: 10px;
    float: right;
  }
</style>
