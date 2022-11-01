<template>
    <div class="homePage ">
        <div class="homePage-head flex" :class="{'scroll':isScroll}">
            <div class="logo flex alignCenter justifyCenter">
                <img class="logoImg" src="../../assets/logo.png" height="40"/>
                <div class="logoText ml10 flex alignCenter justifyCenter">
                    <label class="logoText-item">|</label>
                    <label class="logoText-item title ml16">开放平台</label>
                </div>
            </div>
            <div class="menu flex alignCenter">
                <menus class="menuBox" :curr="curr" :menus="menus" @menuChange="menuChange"/>
            </div>
            <div class="account">
                <account v-if="user"/>
                <!-- 未登录 -->
                <div class="loginBox flex alignCenter justifyCenter" v-else>
                    <label class="loginBox-item login" @click="toLogin">登录</label>
                    <label class="loginBox-item reg" @click="$router.push('/register')">注册</label>
                </div>
            </div>
        </div>
        <div class="homePage-content">
            <!-- 轮播 -->
            <a-carousel class="banner">
                <div class="carousel-item">
                    <img src="../../assets/index/index_bg.png" width="100%"/>
                </div>
            </a-carousel>
            <!-- 通知公告 -->
            <div class="noticeBox">
                <div class="noticeBox-item flex alignCenter">
                    <div class="noticeBox-item-head">
                        <label class="title orange">平台</label>
                        <label class="title">公告</label>
                    </div>
                    <div class="noticeBox-item-content flex alignCenter" >
                        <!-- 三条新闻上下循环滚动 -->
                        <div class="noticeList " :class="{'animate-up': animateUp}" @mouseenter="stopFn" @mouseleave="startFn">
                            <div class="noticeList-item" @click="toDetail(item)" v-for="(item,index) in notice" :key="index">{{item.title}}</div>
                        </div>
                    </div>
                    <div class="noticeBox-item-foot" @click="$router.push('/center/notice')">
                        <label class="title">更多公告</label>
                        <span class="icon"></span>
                    </div>
                </div>
            </div>
            <!-- 开放能力 -->
            <div class="openBox flex flex-column alignCenter justifyCenter">
                <div class="openBox-list">
                    <div class="openbox-list-head">
                        <label class="title">开放能力</label>
                        <label class="tip">将核心能力以API形式对外输出，赋能到多领域、多场景的应用程序中</label>
                    </div>
                    <div class="openbox-list-content">
                        <!-- 应用认证集成 -->
                        <div class="application-box audit">
                            <label class="title">单点认证集成</label>
                            <label class="tip">助力开发者统一认证，提供单点服务能力</label>
                            <div class="application-list">
                                <div class="application-item  flex alignCenter justifyCenter" v-for="(item,index) in audit" :key="index">{{item.name}}</div>
                            </div>
                        </div>
                        <!-- 应用开发者集成 -->
                        <div class="application-box develop">
                            <label class="title">开发者集成</label>
                            <label class="tip">助力开发者提高生产效率，加快工作进程</label>
                            <div class="application-list">
                                <div class="application-item  flex alignCenter justifyCenter" v-for="(item,index) in develop" :key="index" @click="toDoc(item)">{{item.name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 接入流程 -->
            <div class="process  flex flex-column alignCenter justifyCenter">
                <div class="openBox-list process-box">
                   <div class="openbox-list-head">
                        <label class="title">接入流程</label>
                        <label class="tip">完善的服务体系为用户提供安全稳定  • 便捷高效的非凡体验</label>
                    </div>
                    <div class="process-content flex alignCenter justifyCenter">
                        <div class="process-item flex">
                            <div class="xh icon01"></div>
                            <div class="textBox">
                                <label class="title">注册与认证</label>
                                <label class="tip">注册并完成企业认证</label>
                            </div>
                        </div>
                        <div class="icon"></div>
                        <div class="process-item flex">
                            <div class="xh icon02"></div>
                            <div class="textBox">
                                <label class="title">应用与API</label>
                                <label class="tip">应用申请接入，API申请授权</label>
                            </div>
                        </div>
                        <div class="icon"></div>
                        <div class="process-item flex">
                            <div class="xh icon03"></div>
                            <div class="textBox">
                                <label class="title">测试联调</label>
                                <label class="tip">测试环境进行开发联调</label>
                            </div>
                        </div>
                        <div class="icon"></div>
                        <div class="process-item flex">
                            <div class="xh icon04"></div>
                            <div class="textBox">
                                <label class="title">正式上线</label>
                                <label class="tip">线上环境正式调用API</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="homePage-foot flex flex-column alignCenter justifyCenter">杭州天音计算机系统工程有限公司</div>
    </div>
</template>
<script>
import account from '@/components/account/index.vue'
import menus from '../layout/components/menu.vue'
import menu from '@/router/thirdMenu.js'
import {myNotice,openAbility} from '@/api/notification.js'
export default {
    components:{
        account,menus
    },
    data(){
        return{
            user: localStorage.getItem('login_user'),
            menus:[],//第三方菜单
            curr:'',
            notice:null,
            audit:[],
            develop:[],
            isScroll:false,
            animateUp: false,
        }
    },
    mounted(){
        // index 默认写死
        this.menus = menu
        // 默认跳应用接入
        let currMenu = localStorage.getItem('menuStatus')
        this.curr = currMenu&&currMenu!='null'?currMenu:'index'
        this.user = this.user ? JSON.parse(this.user):null
        this.init()
        // 其他页面滚动页面触发该事件
        window.addEventListener('scroll',this.scroll,true)
        this.timer = setInterval(this.scrollAnimate, 2500);
    },
    destroyed () {
        
        window.removeEventListener('scroll',this.scroll,true)
        if(this.timer) clearInterval(this.timer)
    },
    methods:{
        // 新闻上下滚动
        scrollAnimate() {
            this.animateUp = true
            if(this.notice&&this.notice.length > 0){
                let timer = setTimeout(() => {
                    this.notice.push(this.notice[0])
                    // 移除数组第一个
                    this.notice.shift()
                    this.animateUp = false
                    clearTimeout(timer)
                }, 1500)
            }else{
                clearInterval(this.timer)
            }
        },
        // 鼠标经过暂停
        stopFn(){
            clearInterval(this.timer)
        },
        // 鼠标离开继续
        startFn(){
            this.timer = setInterval(this.scrollAnimate, 2500);
        },
        // 滚动条下滑切换导航栏样式
        scroll(){
            this.$nextTick(()=>{
                let scrollTop = document.documentElement.scrollTop ||
                   document.body.scrollTop ||
                   document.querySelector('.homePage').scrollTop;
                 this.isScroll = scrollTop >= 50 ? true : false;
            })
        },
        // 跳转文档中心
        toDoc(item){
            window.open('/center/documentCenter?name='+item.name, '_blank');
        },
        init(){
            this.myNotice()
            this.openAbility()
        },
        // 菜单切换
        menuChange(item){
            this.$router.push(`/center/${item}`)
        },
        // 登录
        toLogin(){
            window.location.href = this.common.url + "/casLogin";
        },
        // 查询公告
        async myNotice(){
            let res = await myNotice({pageNum:1})
            // 取前三条数据轮播上下滚动
            if(res.value.records && res.value.records.length > 0){
                let data = []
                res.value.records.forEach((item,index)=>{
                    if(index < 3){
                        data.push(item)
                    }
                })
                this.notice = data
            }
            
        },
        toDetail(data){
            this.$router.push('/center/noticeDetail?id='+data.id)
        },
        async openAbility(){
            let res = await openAbility()
            // 取六条
            
            let data = []
            let develop = []
            if(res.value.apiListOne){
                res.value.apiListOne.forEach((item,index)=>{
                    if(index < 6) data.push(item)
                })
            }
            this.audit = data
            // 取四条
            if(res.value.apiListTwo){
                res.value.apiListTwo.forEach((item,index)=>{
                    if(index < 4) develop.push(item)
                })
            }
            
            this.develop = develop
        }
    }
}
</script>
<style lang="less" scoped>
.homePage{
    width: 100%;
    height: 100%;
    // background: url(../../assets/index/index_bg.png) no-repeat;
    // background-size: 100%;
    font-family: Microsoft YaHei;
    overflow-y: auto;
    .banner{
        min-height: 5.8rem;
    }
    .animate-up {
        transition: all 0.5s ease-in-out;
        transform: translateY(-.64rem);
    }
    .homePage-head{
        height: 70px;
        width: 100%;
        padding: 0 40px;
        justify-content: space-between;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10;
        
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
        // .account_box{
        //     min-width: 255px;
        // }
        .menu{
            flex:1;
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
                border: 2px solid #fff;
                line-height: 32px;
            }
            .reg{
                background: #fff;
                color: #1a66ff;
                line-height: 36px;
                margin-left: 12px;
            }
        }
      
            /deep/.ant-menu{
                color:#fff;
            }
            /deep/.ant-menu-horizontal > .ant-menu-item:hover, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu:hover, 
            /deep/.ant-menu-horizontal > .ant-menu-item-active, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu-active, 
            /deep/.ant-menu-horizontal > .ant-menu-item-open, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu-open, 
            /deep/.ant-menu-horizontal > .ant-menu-item-selected, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu-selected{
                color: #fff!important;
                
            }
            /deep/.ant-menu-horizontal > .ant-menu-item-selected, 
            /deep/.ant-menu-horizontal > .ant-menu-submenu-selected{
                position: relative;
                &::before{
                    position: absolute;
                    content: '';
                    width: 32px;
                    height: 5px;
                    background: #fff;
                    border-radius: 5px;
                    bottom: 0;
                    left: 50%;
                    margin-left: -16px;
                }
            }
        
    }
    .homePage-content{
        flex:1;
        .noticeBox{
            width: 100%;
            background: #fff;
            height: .64rem;
            .noticeBox-item{
                max-width: 14.18rem;
                width: 100%;
                height: 100%;
                margin: auto;
                .noticeBox-item-head{
                    position: relative;
                    margin-right: .5rem;
                    .title{
                        font-size: .22rem;
                        font-weight: bold;
                        color: #333;
                    }
                    .orange{
                        color: #ff7b12;
                    }
                    &::before{
                        position: absolute;
                        content: '';
                        width: .02rem;
                        height: .2rem;
                        background: url(../../assets/index/index_notice_point.png) no-repeat;
                        background-size: 100%;
                        right: -.26rem;
                        top: .08rem;
                    }
                }
                .noticeBox-item-content{
                    flex: 1;
                    width:100%;
                    height: 100%;
                    overflow: hidden;
                    cursor: pointer;
                    .noticeList{
                        height: 100%;
                        cursor: pointer;
                    }
                    .noticeList-item{
                        font-size: .18rem;
                        color: #333;
                        cursor: pointer;
                        height: 100%;
                        line-height: .64rem;
                        &:hover{
                            color: #1a66ff;
                        }
                    }
                }
                .noticeBox-item-foot{
                    background: #f1f2f5;
                    padding: 0 .38rem 0 .18rem;
                    border-radius: .2rem;
                    position: relative;
                    cursor: pointer;
                    .title{
                        line-height: .32rem;
                        display: block;
                        font-size: .16rem;
                        color:#97a3b7;
                        cursor: pointer;
                        
                    }
                    .icon{
                        position: absolute;
                        width: .24rem;
                        height: .24rem;
                        background: url(../../assets/index/index_notice_more_icon.png) no-repeat;
                        background-size: 100% 100%;
                        right: .05rem;
                        top: .04rem;
                        cursor: pointer;
                    }
                    &:hover{
                        .title{
                            color: #1a66ff;
                        }
                        .icon{
                            background: url(../../assets/index/index_notice_more_hover.png) no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                }
            }
        }
        .openBox{
            width: 100%;
            height: 6.6rem;
            background: #f5f9ff;
            .openBox-list{
                max-width: 14.18rem;
                width: 100%;
                margin: auto;
                
                .openbox-list-content{
                    margin-top: .62rem;
                    display: flex;
                    .application-box{
                        width:6.97rem;
                        height: 2.64rem;
                        border: 1px solid #fff;
                        border-radius: .1rem;
                        box-shadow: 0px 0px .15rem rgba(59,100,168,18%);
                        padding: .48rem .48rem .37rem .48rem;
                        &:hover{
                            box-shadow: 0px 0px .15rem rgba(59,100,168,36%);
                        }
                        .title{
                            font-size:.24rem;
                            color:#333;
                            display: block;
                            height: .25rem;
                            line-height: .25rem;
                            margin-bottom: .19rem;
                        }
                        .tip{
                            font-size: .16rem;
                            color: #666;
                            display: block;
                        }
                        .application-item{
                           &:hover{
                                background: #1a66ff;
                                color: #fff;
                            }  
                            height: .4rem;
                            float: left;
                            border-radius: .04rem;
                            background: #fff;
                            margin-bottom: .16rem;
                            font-size: .16rem;
                            color: #666;
                            cursor: pointer;
                            box-shadow: 0px 0px .1rem rgba(59,100,168,18%);
                        }
                    }
                    .audit{
                        background: url(../../assets/index/index_open_left_bg.png) no-repeat;
                        background-size: 100% 100%;
                        margin-right: .12rem;
                        .application-item{
                             width: 1.9rem;
                            &:nth-child(3n+2){
                                margin: 0 .1rem;
                            }    
                        }
                    }
                    .develop{
                        background: url(../../assets/index/index_open_right_bg.png) no-repeat;
                        background-size: 100% 100%;
                        margin-right: .12rem;
                        .application-item{
                             width: 2.9rem;
                            &:nth-child(2n+1){
                                margin: 0 0.08rem .16rem 0;
                            }
                            &:nth-child(2n+2){
                                margin: 0 0 .16rem 0.08rem;
                            }
                              
                        }
                    }
                    .application-list{
                        margin-top: .2rem;
                    }
                }
            }
        }
        .openbox-list-head{
            text-align: center;
            .title{
                font-size: .4rem;
                font-weight: bold;
                color:#333;
                display: block;
                height: .45rem;
                line-height: .45rem;
            }
            .tip{
                margin-top: .26rem;
                font-size: .16rem;
                color: #666;
                display: block;
            }
        }
        .process{
            width: 100%;
            height: 6rem;
            background: url(../../assets/index/index_process_bg.png) no-repeat;
            background-size: cover;
            .process-box{
                max-width: 14.18rem;
                width: 100%;
                margin: auto;
                .process-content{
                    margin-top: .6rem;
                    width: 100%;
                    height: 2.64rem;
                    background: #1a66ff;
                    border-radius: .1rem;
                    position: relative;
                    padding: 0 .6rem;
                    &::before{
                        position: absolute;
                        content:'';
                        width: .96rem;
                        height: .78rem;
                        background: url(../../assets/index/index_process_icon.png) no-repeat;
                        background-size: 100%;
                        top: -.35rem;
                        left: .4rem;
                    }
                    .process-item{
                        .xh{
                            width: .65rem;
                            height: .63rem;
                            margin-right: .16rem;
                        }
                        .icon01{
                            background: url(../../assets/index/01.png) no-repeat;
                            background-size: 100%;
                        }
                        .icon02{
                            background: url(../../assets/index/02.png) no-repeat;
                            background-size: 100%;
                        }
                        .icon03{
                            background: url(../../assets/index/03.png) no-repeat;
                            background-size: 100%;
                        }
                        .icon04{
                            background: url(../../assets/index/04.png) no-repeat;
                            background-size: 100%;
                        }

                        .textBox{
                            color:#fff;
                            .title{
                                font-size: .24rem;
                                font-weight: bold;
                                display: block;
                                height: .24rem;
                                margin-bottom: .12rem;
                            }
                            .tip{
                                font-size: .15rem;
                            }
                        }
                    }
                    .icon{
                        width:.51rem;
                        height: .25rem;
                        background: url(../../assets/index/index_process_arrow_icon.png) no-repeat;
                        background-size: 100%;
                        margin:0 .3rem;
                    }
                }
            }
        }
    }
    .homePage-foot{
        width: 100%;
        height: 1em;
        min-height: 1rem;
        background: #242a37;
        font-size: .14rem;
        color: rgba(255, 255, 255, 0.5);
    }
    .ml16{
        margin-left: .16rem;
    }
    .scroll{
        background: #fff;
        border-bottom: 1px solid #00000005;
        transition: all .2s;
        .logoText-item{
            color: #333;
        }
        /deep/.ant-menu{
            color: #333;
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
                    
                   background: #1a66ff;
                    
                }
            }
        /deep/.username,
        /deep/.line{
            color: #666;
        }
        /deep/.head-right .icon{
            color: #333;
        }
        .loginBox{
            .login{
                border: 2px solid #ebf1ff;
                color: #1a66ff;
            }
            .reg{
                background: #1a66ff;
                color: #fff;
            }
        }
        
    }
}
</style>