<template>
  <div class="logo">
    <!-- <router-link :to="{path:'/'}"> -->
      <!-- <LogoSvg alt="logo" /> -->
      <a-avatar :src="require('@/assets/logo.png')" width="40"/>
      <h1 >{{ common.mc}}</h1>
    <!-- </router-link> -->
  </div>
</template>

<script>
import LogoSvg from '@/assets/TYLOGO.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data(){
    return{
      user:null
    }
  },
  mounted(){
    this.user = JSON.parse(localStorage.getItem('login_user')) || null
  }
}
</script>
<style lang="less" scoped>
.sider .logo{
  padding-left: 5px !important;
}
.ant-avatar{
	overflow: inherit!important;
}
.sider .logo h1 {
    margin: 0 0 0 5px;
}
/deep/.ant-avatar > img,
/deep/.ant-avatar{
  width: 40px!important;
  height: 40px!important;
}
</style>