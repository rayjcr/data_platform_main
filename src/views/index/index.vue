<template>
  <a-layout style="width: 100%;height: 100%;background: #f3f5f7;" class="home-container">
    <a-layout-header
      :style="{ width: '100%',padding: '0 30px',height: '70px',lineHeight: '70px','zIndex': '1000','position':'relative'}"
    >
      <div class="header-box">
        <div class="head-left alignCenter">
          <a-avatar
            class="head-left-img main_display_inline_block"
            :src="require('@/assets/logo.png')"
          />
          <h1 class="main_display_inline_block">{{common.mc}}</h1>
        </div>
        <!-- 导航 -->
        <div class="head-center">
          <div
            class="head-center-item"
            v-for="(item,index) in list"
            :key="index"
            :class="[activeIndex == index?'active':'']"
            @click="change(index)"
          >{{item}}</div>
        </div>
        <div class="head-right">
          <span class="info"></span>
          <span class="split"></span>
          <!-- <div class="userInfo">
            <div class="userInfo-img">
              <img src="../../assets/avatar/5997fedcc7bd4cffbd350b40d1b5b987.jpg" />
            </div>
            <label class="userInfo-name">{{username}}</label>
            <span class="drop-icon"></span>
          </div> -->
          <a-dropdown>
          <a class="ant-dropdown-link" style="display:inline-block;color: #fff;">
              <a-avatar :src="require('@/assets/avator.png')" style="width: 36px;height: 36px;border-radius: 50%;margin-right: 12px;" />
              <span class="username" :title="username">{{username}}</span>
              <a-icon type="down" style="margin-left: 5px;" />
          </a>
          <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
              <a-menu-item key="3" style="left: 1047px;width: 140px;">
                  <div @click="handleLogout">
                      <a-icon type="logout" />
                      <span>退出登录</span>
                  </div>
              </a-menu-item>
          </a-menu>
      </a-dropdown>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content>
      <div class="content">
        <!-- 全局公告 -->
        <div class="notice" v-if="isNotice">
          <span class="notice-icon"></span>
          <label class="notice-info">{{notice}}</label>
          <button class="btn-into">进入安全中心</button>
          <span class="close" @click="isNotice = false"></span>
        </div>
        <!-- 个人中心 -->
        <div class="yyzx" v-if="activeIndex == 0">
          <yyzx :roleType="currentUserRole && currentUserRole.roleType"></yyzx>
        </div>
        <!-- 应用接入 -->
        <div class="yyzx yyjr" v-if="(currentUserRole.roleType == 1 || currentUserRole.roleType == 2) && activeIndex == 1">
          <yyjr></yyjr>
        </div>
        <!-- 安全中心 -->
        <div class="yyzx" v-if="(currentUserRole.roleType == 1 || currentUserRole.roleType == 2) && activeIndex == 2">
          <aqzx></aqzx>
        </div>
        <div class="yyzx" v-if="currentUserRole.roleType != 1 && currentUserRole.roleType == 2 && activeIndex == 1">
          <aqzx></aqzx>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import * as API from '@/api/data'
import cookie from 'js-cookie'
import common from '@/api/common'
import yyjr from './yyjr.vue'
import yyzx from './yyzx.vue'
import aqzx from './aqzx.vue'
export default {
    components: {
        yyjr,
        yyzx,
        aqzx,
    },
    data() {
        return {
            user:null,
            username: '', //用户名
            headImg:'',
            list: ['个人中心', '应用接入', '安全中心', '控制台'],
            activeIndex: 0, //当前导航序号
            notice: '系统全局公告。放置于页面顶部。', //全局公告内容
            isNotice: false, //是否显示全局公告
            currentUserRole: {
                roleType: 5, // 没有角色统一默认学生
            }, // 当前角色信息 `role_type` int(1) DEFAULT '1' COMMENT '权限类型 1超管 2校管 3教师 4家长 5学生 6其他',  超管  校管  多 应用接入 控制台 标签     其他没有这个标签  
        }
    },
    name: 'Index',
    mounted() {
        this.user = JSON.parse(localStorage.getItem('login_user')) || null
        this.username = this.user.nickname || this.user.username
        this.headImg = '/api/' + this.user.pic
        this.getCurrentUserRole();
    },
    methods: {
        // 切换顶部导航
        change(index) {
            this.activeIndex = index
            if ((this.currentUserRole.roleType == 1 || this.currentUserRole.roleType == 2) && index == 3) {
                // 控制台
                this.$router.push({
                    path: '/system/menu',
                })
            }
        },
        // 获取当前用户角色
        getCurrentUserRole() {
            API.currentUserRole().then((res) => {
                if(res.resultCode == 200) {
                    this.list = [];
                    this.currentUserRole = res.value || {roleType: 5};
                    if(res.value && (res.value.roleType == 1 || res.value.roleType == 2)) { // 超管  校管
                        this.list = ['个人中心', '应用接入', '安全中心', '控制台']
                        this.activeIndex = 0
                    } else {
                        this.list = ['个人中心', '安全中心']
                        this.activeIndex = 1
                    }
                }
            })
        },
        // 退出
        handleLogout() {
            // localStorage.clear();
            // sessionStorage.clear()
            // // cookie.delete('JSESSIONID');
            // window.location.href = common.url+'/casLogout'
            this.$store.dispatch('casLogout') 
        }
    },
}
</script>

<style>
.home-container .header-box {
    width: 100%;
    height: 100%;
    color: #fff;
}

.home-container .header-box .head-left {
    float: left;
}

.home-container .header-box .head-left h1 {
    color: #fff;
    font-size: 20px;
    margin-left: 12px;
    font-weight: 600;
    margin-bottom: 0;
    vertical-align: top;
}

.home-container .header-box .head-right {
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
}

.home-container .header-box .head-right .info {
    width: 36px;
    height: 40px;
    display: inline-block;
    background: url(img/xxts.png) center center no-repeat;
    background-size: 80%;
}

.home-container .header-box .head-right .userInfo-img {
    width: 40px;
    height: 40px;
    display: inline-block;
}

.home-container .header-box .head-right .userInfo-img img {
    width: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.home-container .header-box .head-right .split {
    width: 2px;
    height: 30px;
    background: url(img/line.png) center center no-repeat;
    background-size: 100% 100%;
    margin: 0 20px;
}

.home-container .header-box .head-right .userInfo-name {
    padding: 0 10px;
    font-size: 16px;
}

.home-container .header-box .head-right .drop-icon {
    width: 15px;
    height: 15px;
    display: inline-block;
    background: url(img/arr-drop.png) center center no-repeat;
    background-size: 100%;
}

.home-container .header-box .head-center {
    position: absolute;
    min-width: 300px;
    height: 70px;
    left: 300px;
    text-align: center;
}

.home-container .header-box .head-center .head-center-item {
    display: inline-block;
    padding: 0 10px;
    font-size: 16px;
    position: relative;
    cursor: pointer;
    color: #8f9195;
}

.home-container .header-box .head-center .head-center-item.active {
    color: #fff;
}

/* // 正文 */
.home-container .content {
    padding: 30px;
    height: 100%;
    overflow-y: auto;
}

/* // 全局公告 */
.home-container .content .notice {
    background: #fff9e8;
    height: 50px;
    padding: 0 30px;
    position: fixed;
    left: 0;
    top: 70px;
    width: 100%;
    z-index: 10000;
}

.home-container .content .notice .notice-info {
    line-height: 50px;
    display: inline-block;
    vertical-align: top;
    color: #333;
    font-size: 15px;
}

.home-container .content .notice .btn-into {
    display: inline-block;
    border: 0;
    background: #1890ff;
    color: #fff;
    line-height: 35px;
    padding: 0 20px;
    border-radius: 20px;
    vertical-align: top;
    margin: 8px 20px;
    outline: 0;
    cursor: pointer;
}

.home-container .content .notice .notice-icon,
.home-container .content .notice .close {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(img/waring.png) center center no-repeat;
    background-size: 100%;
    margin: 15px 15px 15px 0;
}

.home-container .content .notice .close {
    background: url(img/exit.png) center center no-repeat;
    background-size: 70%;
    float: right;
    cursor: pointer;
}

/* // 最近使用 */
.home-container .content .zjsy {
    background: #fff;
    border-radius: 15px;
    padding: 10px 30px;
    margin-bottom: 30px;
}

.home-container .content .zjsy:last-child {
    margin: 0;
}

.home-container .content .yyzx .yyzx-item {
    cursor: pointer;
}

.home-container .content .yyzx .yyzx-item .title {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    line-height: 50px;
}

.home-container .content .yyzx .yyzx-item .list {
    padding-bottom: 15px;
}

.home-container .content .yyzx .yyzx-item .list-item {
    text-align: center;
    padding-top: 15px;
    color: #333;
    font-size: 15px;
}

.home-container .content .notice .btn-into {
    display: inline-block;
    border: 0;
    background: #1890ff;
    color: #fff;
    line-height: 35px;
    padding: 0 20px;
    border-radius: 20px;
    vertical-align: top;
    margin: 8px 20px;
    outline: 0;
    cursor: pointer;
}

.home-container .content .notice .notice-icon,
.home-container .content .notice .close {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(img/waring.png) center center no-repeat;
    background-size: 100%;
    margin: 15px 15px 15px 0;
}

.home-container .content .notice .close {
    background: url(img/exit.png) center center no-repeat;
    background-size: 70%;
    float: right;
    cursor: pointer;
}

/* // 最近使用 */
.home-container .content .zjsy {
    background: #fff;
    border-radius: 15px;
    padding: 10px 30px;
    margin-bottom: 30px;
}

.home-container .content .zjsy:last-child {
    margin: 0;
}

.home-container .content .yyzx .yyzx-item {
    cursor: pointer;
}

.home-container .content .yyzx .yyzx-item .title {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    line-height: 50px;
}

.home-container .content .yyzx .yyzx-item .list {
    padding-bottom: 15px;
}

.home-container .content .yyzx .yyzx-item .list-item {
    text-align: center;
    padding-top: 15px;
    color: #333;
    display: block;
}

.home-container .content .yyzx .yyzx-item .list-item:hover {
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    -o-transform: scale(1.2);
    box-shadow: 1px 1px 20px #f5f5f5;
    border-radius: 15px;
    font-size: 12px;
}

.home-container .content .yyzx .yyzx-item .list-item .list-item-icon {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    background: #ebeef2;
    display: block;
    margin: auto;
}

.home-container .content .yyzx .yyzx-item .list-item .list-item-title {
    display: block;
    line-height: 35px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* // 第三方接入资源 */
.home-container .content .yyzx .yyzx-item .list-doc {
    position: relative;
    height: 48px;
    margin-top: 15px;
}

.home-container .content .yyzx .yyzx-item .list-doc .list-doc-icon {
    width: 48px;
    height: 48px;
    display: inline-block;
    background: url(img/wps.png) center center no-repeat;
    background-size: 100%;
    vertical-align: middle;
    position: absolute;
}

.home-container .content .yyzx .yyzx-item .list-doc .list-doc-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    padding: 0 30px 0 60px;
}

.home-container .content .yyzx .yyzx-item .list-doc .list-doc-dwmc {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 48px;
    display: block;
}

/* // 我接入的新应用 */
.home-container .content .yyzx .yyzx-item .list-new-item {
    border-radius: 15px;
    background: rgba(249, 250, 251, 1);
    margin-top: 30px;
    height: 150px;
    text-align: center;
    padding-top: 15px;
    position: relative;
}

.home-container .content .yyzx .yyzx-item .list-new-item-icon {
    display: inline-block;
    width: 90px;
    height: 90px;
    background: #ebeef2;
    margin: auto;
    border-radius: 15px;
}

.home-container .content .yyzx .yyzx-item .list-new-item-title {
    display: block;
    line-height: 45px;
}

.home-container .content .yyzx .yyzx-item .list-new-item.zt:hover {
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    -o-transform: scale(1.2);
    box-shadow: 1px 1px 20px #f5f5f5;
    border-radius: 15px;
    font-size: 12px;
    background: #fff;
}

.home-container .content .yyzx .yyzx-item .list-new-item .iconfont {
    font-size: 50px;
    line-height: 90px;
    height: 75px;
    background: transparent;
}

.home-container .content .yyzx .yyzx-item .list-new-item .list-new-item-status {
    width: 70px;
    position: absolute;
    left: 0;
    top: 0;
}

.home-container .content .yyzx .yyzx-item .list-new-item.zt:hover .list-new-item-status {
    width: 60px;
}

.home-container .content .yyzx .yyzx-item .list-new-item .more {
    float: right;
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
}

/* // 应用接入 我接入的应用 */
.home-container .content .yyjr,
.home-container .content .yyjr .ant-row,
.home-container .content .yyjr .gutter-row,
.home-container .content .yyjr .zjsy {
    height: 100%;
}

.home-container .content .yyjr .zjsy .zjsy-item {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
}

.home-container .content .yyjr .zjsy .zjsy-item .zjsy-item-icon {
    width: 100px;
    height: 100px;
    background: #ebeef2;
    border-radius: 15px;
    min-width: 100px;
    margin-right: 15px;
}

.home-container .content .yyjr .zjsy .zjsy-item .title {
    color: rgba(51, 51, 51, 1);
    font-size: 18px;
    font-weight: 600;
    margin-right: 15px;
}

.home-container .content .yyjr .zjsy .zjsy-item .tip {
    display: inline-block;
    background: #e7f3ff;
    color: #168dff;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 25px;
    margin-right: 10px;
}

.home-container .content .yyjr .zjsy .zjsy-item .jrdz-item .bt {
    width: 50%;
    display: inline-block;
    vertical-align: top;
}

.home-container .content .yyjr .zjsy .zjsy-item .jrdz-item .bt span:nth-child(1) {
    color: #333;
    font-size: 15px;
    font-weight: 600;
}

.home-container .content .yyjr .zjsy .zjsy-item .jrdz-item .bt span:nth-child(2) {
    color: #666;
    font-size: 14px;
}

.home-container .content .yyjr .zjsy .zjsy-item .jrdz-item .bt span:nth-child(3) {
    color: #ccc;
    font-size: 14px;
}

.home-container .content .yyjr .zjsy .zjsy-item .shsj {
    margin-top: 10px;
}

.home-container .content .yyjr .zjsy .zjsy-item .shsj .icon {
    width: 20px;
    height: 20px;
}

.home-container .content .yyzx .yyzx-item.wyjjrdyy {
    overflow-y: auto;
}

.home-container .content .yyjr .zjsy .zjsy-item .shsj .yjsj {
    margin-left: 5px;
    color: #d0d0d0;
    vertical-align: middle;
}

.home-container .content .yyjr .zjsy .zjsy-item .shsj .shzt {
    font-size: 16px;
    font-weight: 600;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
}

.home-container .content .yyjr .zjsy .zjsy-item .yyms {
    margin-top: 10px;
}

.home-container .content .yyjr .zjsy .zjsy-item .yyms-mc {
    display: block;
    color: #333;
    font-weight: 600;
    font-size: 15px;
}

.home-container .content .yyjr .zjsy .zjsy-item .yyms-ms {
    color: #747474;
}

.home-container .ckmm {
    cursor: pointer;
    font-weight: 600;
}
</style>
