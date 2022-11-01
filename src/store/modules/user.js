import Vue from 'vue'
import { login, getInfo, logout,casLogout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import {currentUserInfo} from '@/api/data'
const user = {
  state: {
    info: '',
    token:''
  },

  mutations: {
    SET_INFO: (state, info) => {
      state.info = JSON.parse(info)
    },
    SET_TOKEN: (state, info) => {
      state.token = info
    },
    
  },

  actions: {
    async getUserInfo({commit}){
      let res = await currentUserInfo()
      return new Promise((resolve, reject) =>{
          // 保存用户信息
          if (res.resultCode == 200) {
            localStorage.setItem('login_user', JSON.stringify(res.value));
            commit('SET_INFO',localStorage.getItem('login_user'))
          }
          resolve(res)
      })
    },
    // 统一身份认证退出
    casLogout({ commit }, params){
      return new Promise((resolve, reject) => {
        casLogout().then(res => {
          localStorage.clear();
          sessionStorage.clear()
          window.location.href = res;
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
    // 登录
    // Login ({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     // login(userInfo).then(response => {
    //       // const result = response.result
    //       // Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
    //       // commit('SET_TOKEN', result.token)
    //       console.log('userjs')
    //       Vue.ls.set(ACCESS_TOKEN, '1', 7 * 24 * 60 * 60 * 1000)
    //       commit('SET_TOKEN', '1')
    //       resolve()
    //     // }).catch(error => {
    //     //   reject(error)
    //     // })
    //   })
    // },

    // // 获取用户信息
    // GetInfo ({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(response => {
    //       const result = response.result

    //       if (result.role && result.role.permissions.length > 0) {
    //         const role = result.role
    //         role.permissions = result.role.permissions
    //         role.permissions.map(per => {
    //           if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
    //             const action = per.actionEntitySet.map(action => { return action.action })
    //             per.actionList = action
    //           }
    //         })
    //         role.permissionList = role.permissions.map(permission => { return permission.permissionId })
    //         commit('SET_ROLES', result.role)
    //         commit('SET_INFO', result)
    //       } else {
    //         reject(new Error('getInfo: roles must be a non-null array !'))
    //       }

    //       commit('SET_NAME', { name: result.name, welcome: welcome() })
    //       commit('SET_AVATAR', result.avatar)

    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // // 登出
    // Logout ({ commit, state }) {
    //   return new Promise((resolve) => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     Vue.ls.remove(ACCESS_TOKEN)

    //     logout(state.token).then(() => {
    //       resolve()
    //     }).catch(() => {
    //       resolve()
    //     })
    //   })
    // }

  }
}

export default user
