<template>
  <div>
    <error :status="status" :dec="dec"></error>
  </div>
</template>

<script>
  import error from './error.vue'
  export default{
    components:{
      error
    },
    data(){
      return{
        status:403,
        dec:'很抱歉,你访问的页面不存在！'
      }
    }
  }
</script>

<style scoped>
 
</style>
