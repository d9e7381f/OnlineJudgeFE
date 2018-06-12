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
      api.dgutLogin(this.$route.query).then(_ => {
        this.getProfile()
        this.$router.push({path: '/'})
      }).catch(() => {
        this.$router.push({path: '/'})
      })
    }
  }
</script>
