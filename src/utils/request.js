import Vue from 'vue'
import axios from 'axios'
import router from '@/router/index'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import common from '@/api/common'
// 配置cookie
import cookie from 'js-cookie'

// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
    timeout: 18000,// 请求超时时间
    withCredentials: true,
})

const err = (error) => {
    if (error.response) {
        const data = error.response.data
        if (error.response.status === 403) {
        }
        // if (error.response.status === 401) {
        //     // window.location.href = error.response.data.value;
            
        // }

        if (error.response.status === 500) {
            notification.error({
				message: '错误',
				description: error.response.data.resultMessage
			})
        }
    }
    return Promise.reject(error)
}
// request interceptor
service.interceptors.request.use(config => {
    // const token = cookie.get('JSESSIONID');
    // if (token) {
    //     config.headers['Cookies'] = 'JSESSIONID=' + token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    // } 
    return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
    if(response.data.resultCode == 401){
        if(response.data.value){
            // 是否开启统一身份认证
            if(common.isCertified){
                let url = response.data.value.split('?')
                // 统一身份认证账户退出后，请求接口返回401，跳转登录页
                // 2020/1/6 账户退出后再登录进入首页index
                // 接口报401，清空缓存
                // ------------------------------------------------------
                // 后续功能：账户退出后再登录进入退出前的页面
                // 返回value值：http://sso.hzgsedu.cn/login?service=http%3A%2F%2Fopen.hzgsedu.cn%3A8882%2Fbackend%2Fclient%2FmyClient
                // client%2FmyClient 退出前页面接口名称

                localStorage.clear();
                sessionStorage.clear()
                window.location.href = url[0] + '?service=' + common.url + '/casLogin';
            }
            
        }
        
    }
    return response.data
}, err)

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, service)
    }
}

export {
    installer as VueAxios,
    service as axios
}
