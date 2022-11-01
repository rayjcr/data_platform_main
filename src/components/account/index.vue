<template>
  <div class="head-right flex alignCenter justifyCenter">
    <label class="username" @click="toYYjr">应用中心</label>
        <label class="line">|</label>
    <a-dropdown>
      <a class="ant-dropdown-link flex alignCenter justifyCenter">
        <div class="logo_img">
          <img :src="headImg" alt="" width="36" @error="error">
        </div>
        <label class="username mr10" v-if="user">{{(user.nickname || user.username)}}</label>
        <a-icon type="caret-down" class="icon"/>
      </a>
      <a-menu slot="overlay" class="userMenu">
        <a-menu-item key="2" @click="$router.push('/center/aqzx')">
          <label class="set">安全中心</label>
        </a-menu-item>
        <a-menu-item key="3" @click="exit">
          <label class="set">退出</label>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import {getLoginAuthUser} from '@/api/data.js'

export default {
  data(){
	 return{
		  headImg:null,
      user:null,
      info:null
	 }
  },
  mounted() {
	  this.user = JSON.parse(localStorage.getItem('login_user')) || null
    let time = new Date().getTime()
    this.headImg = '/api/' + this.user.pic+'?v='+time
  },
  methods: {
    error(){
      this.headImg = require('@/assets/index/personDefault.png')
    },
    exit(){
      this.$store.dispatch('casLogout') 
    },
    async toYYjr(){
      let name = this.$route.name
      if(name != 'yyjr'){
        // 获取登录人应用接入是否认证通过
        // status 1 通过 2审核中 3拒绝
        await this.getLoginAuthUser()
        if(this.info && this.info.status == 1){
          // 通过
          this.$router.push('/center/yyjr')
        }else {
          
          // 审核中 拒绝 无信息
          this.$router.push('/center/authentication')
        }
      }else{
        // 当前在应用中心刷新页面
        location.reload()
      }
    },
    // 获取登录人信息
    async getLoginAuthUser(){
      let res = await getLoginAuthUser()
      this.info = res.value
    }
  },

}
</script>

<style lang="less">
.head-right {
  height: 100%;
  .ant-dropdown-link {
    color: #333 !important;
    font-size: 16px;
    cursor: pointer;
    line-height: 70px !important;
    margin: 0;
    border-radius: 0;
    position: relative;
  }
  .photo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .username {
    display: inline-block;
    // width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
    text-align: center;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }
  .icon{
    color: #fff;
  }
  .line {
    color: #fff;
    margin: 0 24px;
  }
  .logo_img{
    margin-right: 12px;
    img{
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .logout {
    cursor: pointer;
  }
}
</style>