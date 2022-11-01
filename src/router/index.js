import Vue from 'vue'
import Router from 'vue-router'
// import LoginView from '@/views/user/Login'
import * as API from '@/api/data'
import BasicLayout from '@/layouts/BasicLayout'//首页模板
import PageView from '@/layouts/PageView'//子页面模板
import BlankLayout from '@/layouts/BlankLayout'//空模板
// import { UserLayout } from '@/layouts'

import HomePage from '@/views/index/homePage.vue'
import documentCenter from '@/views/index/documentCenter.vue'
import downloadCenter from '@/views/index/downloadCenter.vue'
import authentication from '@/views/authentication/index.vue'
import noticeDetail from '@/views/index/components/detail.vue'
import interfaceInfo from '@/views/index/components/interfaceInfo.vue'
import debug from '@/views/index/components/debug.vue'
import notice from '@/views/index/components/notice.vue'
import IndexNew from '@/views/index/index_new'
import Register from '@/views/account/register'
import ForgotPassword from '@/views/account/forgotPassword'
import thirdUseIndex from '@/views/layout/thirdUseIndex'
import Yyjr from '@/views/index/yyjr'
import Detail from '@/views/index/components/yyxq.vue'
import Aqzx from '@/views/index/aqzx'
import common from '@/api/common'
import store from '../store/'


Vue.use(Router)

// 配置cookie
import cookie from 'js-cookie'

let constRouter = [
    // 设置根路由为index
    {
        path: "/",
        redirect:'/index', 
    },
    {
        path: '/index',
        name: 'index',
        component: IndexNew,
    },
    
    {
        path: '/forgotPassword',
        name: 'forgotPassword',
        component: ForgotPassword
    },
    // 第三方中心
    {
        path: '/center/index',
        name: 'homePage',
        component: HomePage,
    },
    
    {
        path: '/center',
        name: 'center',
        component: thirdUseIndex,
        children:[
            // 第三方首页
            // 看是否可以动态插入以下的数据？？？？？
            
            // 文档中心
            {
                path: '/center/documentCenter',
                name: 'documentCenter',
                component: documentCenter
            },
            {
                path: '/center/noticeDetail',
                name: 'noticeDetail',
                component: noticeDetail
            },
            {
                path: '/center/notice',
                name: 'notice',
                component: notice
            },
            // 下载中心
            {
                path: '/center/downloadCenter',
                name: 'downloadCenter',
                component: downloadCenter
            },
            // 第三方认证
            {
                path: '/center/authentication',
                name: 'authentication',
                component: authentication
            },
            // 应用中心
            {
                path: '/center/yyjr',
                name: 'yyjr',
                component: Yyjr
            },
            //安全中心
            {
                path: '/center/aqzx',
                name: 'aqzx',
                component: Aqzx
            },
            {
                path: '/center/detail',
                name: 'detail',
                component: Detail
            },
            {
                path: '/register',
                name: 'register',
                component: Register
            },
            // 接口详情
            {
                path: '/center/interfaceInfo',
                name: 'interfaceInfo',
                component: interfaceInfo
            },
            // 接口调试
            {
                path: '/center/interfaceInfo/debug',
                name: 'debug',
                component: debug
            },
        ]
    },
]

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constRouter
    // routes: constantRouterMap.concat(asyncRouterMap)
})
let asyncRouter = null
const whiteList = ['/register', '/forgotPassword','/center/index','/center/documentCenter','/center/downloadCenter','/center/noticeDetail','/center/notice']
router.beforeEach((to, from, next) => {
    if (whiteList.indexOf(to.path) !== -1) {
        next()
        return
    }

    let token = localStorage.getItem('JSESSIONID');
    if (!token || token == 'undefined' || token == undefined) {
        cookie.set('JSESSIONID',to.query.jsessionid,{path:'/'});
        // JSESSIONID 缓存在cookie里 HTTPOnly只读 导致数据取不出来
        // 修改为localStorage缓存JSESSIONID
        
        localStorage.setItem('JSESSIONID',to.query.jsessionid)
        token = to.query.jsessionid
    }
    // JSESSIONID过期,localStorage缓存未清除
    // 导致下一个登录用户信息使用之前的数据
    // 接口401 清缓存
    let user = localStorage.getItem('login_user');
    let userRouter = JSON.parse(localStorage.getItem('router'))
    if(token) {
        store.dispatch('getUserInfo').then(res=>{
            if (!asyncRouter) {
                if (!userRouter) {
                    // 2022-1-21
                    // 超级管理员钉钉扫码登录后，菜单取值为空
                    // 第三方用户钉钉扫码登录菜单有值
                    getUserMenuList(to, from, next,user);
                } else {
                    asyncRouter = userRouter
                    go(to, next)
                }
            } else {
                next()
            }
        })
        
    }else {
        // 跳转登录页
        // window.location.href = common.url + "/casLogin";
        
        //未登录先跳第三方首页从首页点击在进入登录页 
        // 第三方 + 控制台都跳转首页
        next('/center/index')
    }
})

// 获取用户菜单列表
function getUserMenuList(to, from, next,user) {
    API.getUserMenuList().then((res) => {
        // 本项目采用的模板是 1.BasicLayout 2.PageView 3.BlankLayout 等,
        if (res) {
            if (res[0].children) {
                res[0].children.splice(0, 1)
                // if (res[0].children[0].children) {
                //     res[0].redirect = res[0].children[0].children[0].path
                // } else {
                //     res[0].redirect = res[0].children[0].path
                // }
            }
            // 普通用户 设置为菜单第一个
            // 第三方设置为 center
            // if(user.type == '1') res[0].redirect = '/center/yyjr'

            res[1].path = '/error/404'
            var data = res[0]
            const main = data.children[0]
            main.component = 'PageView'
            main.meta.title = main.name
            data.component = 'BasicLayout'

            // res[0].redirect = ''
            // side-menu 显示菜单文字+图标需在meta里添加title
            data.children.forEach((e, index) => {
                e.meta.title = e.name
                e.meta.icon = e.icon
                if (e.children) {
                    e.children.forEach(r => {
                        r.meta.title = r.name
                        if (r.children) {
                            r.children.forEach(res => {
                                res.meta.title = res.name
                            })
                        }
                    })
                }

            })
            asyncRouter = res
            localStorage.setItem('router', JSON.stringify(asyncRouter))
        }
        // asyncRouter 从后台获取的菜单目录
        go(to, next)
    }).catch(err => { console.log(err) })
}

// 获取当前登录用户信息
function getCurrentUserInfo(next) {
    API.currentUserInfo().then((res) => {
        if (res.resultCode == 200) {
            localStorage.setItem('login_user', JSON.stringify(res.value));
            store.commit('SET_INFO',localStorage.getItem('login_user'))
            // next()
        }
    }).catch(err => { console.log(err) })
}

function go(to, next) {
    asyncRouter = filterAsyncRouter(asyncRouter)
    //   router.options.routes = asyncRouter;
    router.addRoutes(asyncRouter)
    store.commit('setPermission', asyncRouter)
    next({
        ...to,
        replace: true
    })
}

// 根据后台返回的数据来选用对应的模板
function filterAsyncRouter(routes) {
    return routes.filter((route) => {
        let component = route.component
        if (component) {
            switch (route.component) {
                case 'BasicLayout':
                    route.component = BasicLayout
                    break
                case 'PageView':
                    route.component = PageView
                    break
                case 'BlankLayout':
                    route.component = BlankLayout
                    break
                default:
                    route.component = view(component)
            }
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children)
            }
            return true
        }
    })
}

function view(path) {
    return function (resolve) {
        import('@/views/' + path + '.vue').then(mod => {
            resolve(mod)
        })
    }
}


export default router

