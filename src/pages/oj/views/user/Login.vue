<template>
  <div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import api from '@oj/api'

  export default {
    methods: {
      ...mapActions(['getProfile'])
    },
    mounted () {
      let token = this.$route.query
      api.dgutLogin(token).then(_ => {
        this.getProfile()
        this.$router.push({path: '/'})
      }).catch(() => {
        this.$router.push({path: '/'})
      })
    }
  }
</script>
