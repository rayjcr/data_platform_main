// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

import standard_svg from '@/assets/icons/icon_standard.svg?inline'
import data_svg from '@/assets/icons/icon_data.svg?inline'
import change_svg from '@/assets/icons/icon_change.svg?inline'
import manage_svg from '@/assets/icons/icon_manage.svg?inline'
import search_svg from '@/assets/icons/icon_search.svg?inline'
import systom_svg from '@/assets/icons/icon_systom.svg?inline'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/UserManagement',
    children: [ 
      //标准制定
      {
        path: '/systemManagement',
        name: 'systemManagement',
        component: PageView,
        meta: { title: '系统管理',icon: systom_svg },
        redirect: '/systemManagement/page',
        children: [
          {
            path: '/UserManagement',
            name: 'UserManagement',
            component: () => import('@/views/systemManagement/UserManage'),
            meta: {  title: '用户管理' }
          },
          {
            path: '/RoleManagement',
            name: 'RoleManagement',
            component: () => import('@/views/systemManagement/RoleManage'),
            meta: {  title: '角色管理' }
          },
          {
            path: '/DataDictionary',
            name: 'DataDictionary',
            component: () => import('@/views/systemManagement/DataDictionary'),
            meta: {  title: '数据字典', keepAlive: true }
          },
         {
           path: '/menuManage',
           name: 'menuManage',
           component: () => import('@/views/systemManagement/menuManage'),
           meta: {  title: '菜单管理', keepAlive: true }
         },
         {
            path: '/SystemLog',
            name: 'SystemLog',
              component: () => import('@/views/systemManagement/SystemLog'),
            meta: {  title: '系统日志', keepAlive: true }
         },
        ]
      },
      {
        path: '/systemMonitor',
        name: 'systemMonitor',
        component: PageView,
        meta: { title: '系统管理',icon: systom_svg },
        redirect: '/systemMonitor/page',
        children: [
          {
            path: '/onlineUser',
            name: 'onlineUser',
            component: () => import('@/views/systemMonitor/onlineUser'),
            meta: {  title: '在线用户' }
          },
        ]
      },
    ]
    
     
   
  },
  
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },



 

]
