<template>
</template>

<script>
  import api from '../../api.js'

  export default {
    mounted () {
      api.logoutEntry().then(res => {
        window.location.href = res.data.data
      })
      api.logout().then(res => {
        this.$store.dispatch('clearProfile')
        this.$router.replace({
          path: '/'
        })
      })
    }
  }
</script>
