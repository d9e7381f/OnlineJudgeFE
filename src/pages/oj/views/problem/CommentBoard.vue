<template>
  <Panel shadow :padding="10">
    <div slot="title">
      留言板
    </div>
    
  </Panel>
</template>
<script>
import api from '@oj/api'
export default {
  name: 'CommentBoard',
  data () {
    return {
      total: 0,
      limit: 10,
      problemID: 0,
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
        this.commentList = res
      }).catch(() => {})
    }
  },
  mounted () {
    this.init()
  }

}
</script>
