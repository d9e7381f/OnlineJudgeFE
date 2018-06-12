<template>
  <div>
  </div>
</template>

<script>
  import api from '@oj/api'

  export default {
    data () {
    },
    methods: {
    },
    mounted () {
      console.log(this.$route)
      api.dgutLogin(this.$route.query).then(_ => {
        this.getProfile()
        this.$router.push({path: '/'})
      })
    }
  }
</script>
