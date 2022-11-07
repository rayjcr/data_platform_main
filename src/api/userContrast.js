import { axios } from '@/utils/request'
const base = '/api'

/**
 * 用户对照
 */
// 客户端对照用户列表分页
export function contrastList (parameter) {
    return axios({
        url: `${base}/clientUser/clientlist`,
        method: 'post',
        params: parameter
    })
}
// 保存
export function contrastSave (parameter) {
    return axios({
        url: `${base}/clientUser/save`,
        method: 'post',
        data: parameter
    })
}
// 删除
export function contrastDel (parameter) {
    return axios({
        url: `${base}/clientUser/${parameter}`,
        method: 'delete',
    })
}
// 客户端对照用户列表导出
export function contrastDownload (parameter) {
    return axios({
        url: `${base}/clientUser/download`,
        method: 'post',
        data: parameter,
        responseType: 'blob'
    })
}
// 导出模板
export function contrastTemp (parameter) {
    return axios({
        url: `${base}/clientUser/temp`,
        method: 'post',
        data: parameter,
        responseType: 'blob'
    })
}
// 导入
export function contrastUpload (parameter) {
    return axios({
        url: `${base}/clientUser/upload`,
        method: 'post',
        data: parameter,
        responseType: 'blob'
    })
}