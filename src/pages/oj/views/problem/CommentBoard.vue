<template>
  <Panel shadow :padding="10">
    <div slot="title">
      留言板
    </div>
    
  </Panel>
</template>
<script>
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
    },
    getComment () {
      
    }
  }

}
</script>
