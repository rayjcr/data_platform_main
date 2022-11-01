import data from './index'
import { axios } from '@/utils/request'
const base = ''
/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
//登录接口
export function login (parameter) {
  return axios({
    url: `${base}/login`,
    method: 'post',
    params: parameter
  })
}

export function loginout () {
  return axios({
    url: `${base}/logout`,
    method: 'get'
  })
}


// 退出统一身份认证
export function casLogout () {
  return axios({
    url: `${base}/casLogout`,
    method: 'get'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
// export function register (parameter) {
//   return axios({
//     url: `${base}/auth/register`,
//     method: 'post',
//     params: parameter
//   })
// }

// 创建第三方用户注册
export function creatUser (parameter) {
  return axios({
    url: `${base}/auth/creatUser`,
    method: 'post',
    params: parameter
  })
}

export function sentEmailCode (parameter) {
  return axios({
    url: `${base}/auth/sendEmail`,
    method: 'get',
    params: parameter
  })
}
export function forgetPassword (parameter) {
  return axios({
    url: `${base}/auth/forgetPassword`,
    method: 'get',
    params: parameter
  })
}
export function sendUserEmail (parameter) {
  return axios({
    url: `${base}/auth/sendUserEmail`,
    method: 'get',
    params: parameter
  })
}
export function sendUserMobile (parameter) {
  return axios({
    url: `${base}/auth/sendUserMobile`,
    method: 'get',
    params: parameter
  })
}
export function resetPassword (parameter) {
  return axios({
    url: `${base}/auth/resetPassword`,
    method: 'post',
    params: parameter
  })
}
// 注册第三方用户登录创建应用时
export function registerUser (parameter) {
  return axios({
    url: `${base}/registerUser`,
    method: 'post',
    params: parameter
  })
}
// 用户注册信息修改
export function registerUserUpdate (parameter) {
  return axios({
    url: `${base}/registerUserUpdate`,
    method: 'post',
    params: parameter
  })
}

// 注册上传图片
export function uploadPic (parameter) {
  return axios({
    url: `${base}/file/uploadPic`,
    method: 'post',
    data: parameter
  })
}
