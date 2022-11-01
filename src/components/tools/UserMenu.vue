<template>
  <div class="user-wrapper">

    <div class="content-box main_float_right">
      <!-- <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a> -->
      <!-- <notice-icon class="action"/> -->
      <!-- <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" icon="user" style="color: #fff;" />
          <span style="color: #fff;">欢迎回来, {{nickname}}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown> -->
      <a-dropdown>
          <a class="ant-dropdown-link flex alignCenter justifyCenter">
              <!-- <a-avatar :src="headImg" @error="error" style="width: 36px;height: 36px;border-radius: 50%;margin-right: 12px;" />
              <span class="username" :title="user.nickname || user.username">{{user.nickname || user.username}}</span>
              <a-icon type="down" style="margin-left: 5px;" /> -->
              <img class="photo" :src="headImg" @error="error"/>
              <label class="username" v-if="user">{{(user.nickname || user.username)}}</label>
          </a>
          <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
              <a-menu-item key="3">
                <!-- 
                  火狐浏览器点击a标签会跳转页面 只有0的空白页
                  点击退出登录退不出去
                  需把a标签改为div
                 -->
                 <div  @click="handleLogout">
                      <a-icon type="logout" />
                      <span>退出登录</span>
                  </div>
              </a-menu-item>
          </a-menu>
      </a-dropdown>
    </div>
    <!-- <div class="main_float_right main_theme">
      <a-dropdown>
        <span class="iconfont color_white">&#xe654;</span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">

          <a-menu-item key="1">
            <a href="javascript:;" @click="change('1')">
              <span class="add main_theme_box"></span>
              <span class="main_theme_text">蓝色</span>
            </a>
          </a-menu-item>
          <a-menu-item key="2">
            <a href="javascript:;" @click="change('2')">
              <span class="edit main_theme_box"></span>
              <span class="main_theme_text">绿色</span>
            </a>
          </a-menu-item>
         
        </a-menu>
      </a-dropdown>
    </div> -->
  </div>
</template>

<script>
  import * as API from '@/api/login'
  import common from '@/api/common'
  import cookie from 'js-cookie'
  export default {
    name: 'UserMenu',
    data() {
      return {
         user:null,
          username: '', //用户名
          headImg:'',
      }
    },
    mounted(){
      this.user = JSON.parse(localStorage.getItem('login_user')) || null
      this.username = this.user.nickname || this.user.username
      let time = new Date().getTime()
      this.headImg = '/api/' + this.user.pic+'?v='+time
    },
    methods: {
      error(){
        this.headImg = require('@/assets/default.png')
      },
      handleLogout() {
        this.$store.dispatch('casLogout') 
      },
      change(obj){
        //设置缓存，切换APPclass
        localStorage.setItem('theme',obj)
      }
    }
  }
</script>
<style lang="less" scoped>
  .main_theme {
    width: 50px;
    display: block;
    text-align: center;
    cursor: pointer;
  }

  .main_theme .iconfont {
    font-size: 20px;
    display: block;
    line-height: 68px;
  }
  .main_theme_box{
    width: 15px;
    height: 15px;
    display: inline-block;
    border-radius: 2px;
    border: 1px solid #eee;
    margin-right: 10px;
  }
  .main_theme_text{
    display: inline-block;
    vertical-align: text-bottom;
  }

  .content-box {
    :global(.ant-input) {
        background: rgba(68,110,255,.8);
        border-radius: 20px;
        color: #ffffff;
        border: none;
    }
    :global(.ant-input:focus) {
        box-shadow: none;
    }
    :global(.ant-input-search-icon) {
        color: #ffffff;
        font-size: 18px;
    }
    :global(.ant-dropdown-trigger) {
        color: #ffffff;
        font-size: 16px;
        width: 210px;
        height: 64px;
        // line-height: 40px;
        // background-color: rgba(255,255,255,0.15);
        // border-radius: 20px;
        
    }
    /deep/.ant-dropdown{
      margin-top: 10px;
    }
    .username {
        display: inline-block;
        width: 60px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
    }
  }
  .photo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .username {
    display: inline-block;
    width: 100px!important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
    text-align: center;
    color: #fff;
  }
  
</style>
