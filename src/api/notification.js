import { axios } from '@/utils/request'
const base = ''

/**
 * 通知公告
 */
// 列表
export function getNotificationlist (params) {
    return axios({
        url: `${base}/notice/pageList`,
        method: 'get',
        params
    })
}
// 保存
export function saveNotification (data) {
    return axios({
        url: `${base}/notice/save`,
        method: 'post',
        data
    })
}

// 上传
export function fileUpload (data) {
    return axios({
        url: `${base}/notice/fileUpload`,
        method: 'post',
        data
    })
}

// 删除公告
export function delNotification (params) {
    return axios({
        url: `${base}/notice/delete`,
        method: 'post',
        params
    })
}

// 发布取消发布通知
export function updateStatus (params) {
    return axios({
        url: `${base}/notice/updateStatus`,
        method: 'get',
        params
    })
}

// 首页查询公告列表
export function getById (params) {
    return axios({
        url: `${base}/auth/notice/getById`,
        method: 'get',
        params
    })
}

// 首页 查询公告列表
export function myNotice (params) {
    return axios({
        url: `${base}/auth/notice/myNotice`,
        method: 'get',
        params
    })
}
// 首页 开放能力
export function openAbility (params) {
    return axios({
        url: `${base}/auth/notice/openAbility`,
        method: 'get',
        params
    })
}