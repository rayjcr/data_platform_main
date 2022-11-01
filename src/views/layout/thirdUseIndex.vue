<template>
    <a-layout>
        <a-layout-header class="flex centerBox">
            <!-- 2022-2-15修改
                第三方首页导航栏
                1.首页文档中心下载中心未登录可访问
                2.应用中心（已登录）跳转应用中心未登录跳转登录页
                3.安全中心移动到下拉框 与退出同一层级
                4.登录成功后返回index首页，显示登录用户信息
                5.不用logo组件，第三方与控制台logo文字显示不需一致
             -->
            <div class="logo flex alignCenter justifyCenter">
                <img class="logoImg" src="../../assets/logo.png" height="40"/>
                <div class="logoText ml10 flex alignCenter justifyCenter">
                    <label class="logoText-item">|</label>
                    <label class="logoText-item title ml16">开放平台</label>
                </div>
            </div>
            <div class="menu-box flex alignCenter">
                <menus :curr="curr" :menus="menus" @menuChange="menuChange"/>
            </div>
            <div class="account_box">
                <account v-if="user"/>
                <!-- 未登录 -->
                <div class="loginBox flex alignCenter justifyCenter" v-else>
                    <label class="loginBox-item login" @click="toLogin">登录</label>
                    <label class="loginBox-item reg" @click="$router.push('/register')">注册</label>
                </div>
            </div>
        </a-layout-header>
        <a-layout-content class="layout-content">
            <div class="box">
                <router-view />
            </div>
        </a-layout-content>
        
    </a-layout>
</template>
<script>
import account from '@/components/account/index.vue'
import menus from './components/menu.vue'
import RouteView from '@/layouts/RouteView.vue'
import menu from '@/router/thirdMenu.js'
export default {
    components:{ account,menus, RouteView },
    data(){
        return{
            menus:[],//第三方菜单
            curr:'',
            user: localStorage.getItem('login_user'),
        }
    },
    mounted(){
        // index 默认写死
        this.menus = menu
        // 默认跳应用接入
        let currMenu = localStorage.getItem('menuStatus')
        this.curr = currMenu&&currMenu!='null'?currMenu:'index'
        this.user = this.user ? JSON.parse(this.user):null
    },
    methods:{
        // 菜单切换
        menuChange(item){
            this.$router.push(`/center/${item}`)
        },
        // 登录
        toLogin(){
            window.location.href = this.common.url + "/casLogin";
        }
    }   
}
</script>
<style lang="less" scoped>
    .ant-layout,
    .layout-content,
    .box{
        width: 100%;
        height: 100%;
        flex: 1;
    }
    .ant-layout-header{
        position: relative;
        padding: 0 40px;
        border-bottom: 1px solid #00000005;
        height: 70px;
        line-height: 70px;
        background: #fff;
    }
    .menu-box{
        height: 70px;
        flex: 1;
    }
    .box{
        // padding: 20px;
        position: relative;
    }
    .logo{
        padding: 0 10px;
        .logoText{
            color: #fff;
            margin-left: 16px;
            .logoText-item{
                &.title{
                    font-size: 20px;
                    font-weight: bold;   
                }
            }
        }
    }
    
    .loginBox{
        color: #fff;
            height: 100%;
        .loginBox-item{
            padding: 0 35px;
            cursor: pointer;
            border-radius: 20px;
            height:36px;
            font-size: 16px;
            font-weight: bold;
        }
        .login{
            border: 2px solid #ebf1ff;
            color: #1a66ff;
            line-height: 32px;
        }
        .reg{
            background: #1a66ff;
            color: #fff;
            line-height: 36px;
            margin-left: 12px;
        }
    }
    .ml16{
        margin-left: 16px;
    }
    .centerBox{
        .logoText,
        /deep/.icon{
            color:#333;
        }
        /deep/.username,
        /deep/.line{
            color:#666;
        }
    }
     /deep/.ant-menu{
                color:#333;
            }
            /deep/.ant-menu-horizontal > .ant-menu-item:hover, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu:hover, 
            /deep/.ant-menu-horizontal > .ant-menu-item-active, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu-active, 
            /deep/.ant-menu-horizontal > .ant-menu-item-open, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu-open, 
            /deep/.ant-menu-horizontal > .ant-menu-item-selected, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu-selected{
                color: #333!important;
                
            }
    /deep/.ant-menu-horizontal > .ant-menu-item-selected, 
    /deep/.ant-menu-horizontal > .ant-menu-submenu-selected{
        position: relative;
        &::before{
            position: absolute;
            content: '';
            width: 32px;
            height: 5px;
            background: #1a66ff;
            border-radius: 5px;
            bottom: 0;
            left: 50%;
            margin-left: -16px;
        }
    }
    .ant-menu-horizontal{
        border: 0;
    }
   
</style>