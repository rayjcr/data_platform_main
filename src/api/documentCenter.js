import { axios } from '@/utils/request'
const base = ''

/**
 * 文档中心
 */

// 列表
export function getDocumentCenterlist (params) {
    return axios({
        url: `${base}/documentCenter/pageList`,
        method: 'get',
        params
    })
}

// 上传附件
export function fileUpload (data) {
    return axios({
        url: `${base}/documentCenter/fileUpload`,
        method: 'post',
        data
    })
}
// 根据父Id查询为使用过的文档分类
export function getDocTypeList (params) {
    return axios({
        url: `${base}/documentCenter/getDocTypeList`,
        method: 'get',
        params
    })
}
// 保存
export function saveDocumentCenter (data) {
    return axios({
        url: `${base}/documentCenter/save`,
        method: 'post',
        data
    })
}
// 删除
export function delDocumentCenter (params) {
    return axios({
        url: `${base}/documentCenter/delete`,
        method: 'post',
        params
    })
}
// 发布取消发布
export function updateStatus (params) {
    return axios({
        url: `${base}/documentCenter/updateStatus`,
        method: 'get',
        params
    })
}

// 首页文档列表树
export function getDocumentCenterTypeList (params) {
    return axios({
        url: `${base}/auth/documentCenter/typeList`,
        method: 'get',
        params
    })
}
// 查询文档详情
export function getDocumentCenterTypeId (params) {
    return axios({
        url: `${base}/auth/documentCenter/typeId`,
        method: 'get',
        params
    })
}