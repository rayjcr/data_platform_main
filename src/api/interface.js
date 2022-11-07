import { axios } from '@/utils/request'
const base = '/api'

/**
 * 接口管理
 */
// 列表
export function interfaceList (parameter) {
    return axios({
        url: `${base}/api/pageList`,
        method: 'post',
        params: parameter
    })
}
// 查询
export function getInterfaceById (parameter) {
    return axios({
        url: `${base}/api/getById`,
        method: 'post',
        params: parameter
    })
}
// 保存
export function interfaceSave (parameter) {
    return axios({
        url: `${base}/api/save`,
        method: 'post',
        data: parameter
    })
}
// 类型
export function interfaceType (parameter) {
    return axios({
        url: `${base}/api/type`,
        method: 'get',
        params: parameter
    })
}
// 删除
export function interfaceDel (parameter) {
    return axios({
        url: `${base}/api/${parameter}`,
        method: 'delete',
    })
}
// 上线
export function interfaceOnline (parameter) {
    return axios({
        url: `${base}/api/online`,
        method: 'post',
        params: parameter
    })
}
// 下线
export function interfaceOffline (parameter) {
    return axios({
        url: `${base}/api/offline`,
        method: 'post',
        params: parameter
    })
}
// 上传文件
export function fileUpload (parameter) {
    return axios({
        url: `${base}/file/upload`,
        method: 'post',
        data: parameter,
    })
}

// 应用接口已申请列表
export function getClentApiShowList(params) {
    return axios({
        url: `${base}/api/clentApiShowList`,
        method: 'POST',
        params,
    })
}

// 调试接口，返回结果
export function getRequestApi(params) {
    return axios({
        url: `${base}/api/requestApi`,
        method: 'POST',
        data: params,
    })
}

/**
 *  客户端接口管理
 */ 
// 审核页面客户端接口获取
export function clientApiList (parameter) {
    return axios({
        url: `${base}/clientApi/apilist`,
        method: 'post',
        params: parameter,
    })
}
// 审核页面客户端获取
export function clientList (parameter) {
    return axios({
        url: `${base}/clientApi/clientlist`,
        method: 'post',
        params: parameter,
    })
}
// 保存
export function clientApiSave (parameter) {
    return axios({
        url: `${base}/clientApi/save`,
        method: 'post',
        data: parameter,
    })
}
// 审核通过
export function clientApiAuditOk (parameter) {
    return axios({
        url: `${base}/clientApi/auditOk`,
        method: 'post',
        params: parameter,
    })
}
// 审核拒绝
export function clientApiAuditNo (parameter) {
    return axios({
        url: `${base}/clientApi/auditNo`,
        method: 'post',
        params: parameter,
    })
}
// 获取客户端绑定部门
export function getDeptByClientId (parameter) {
    return axios({
        url: `${base}/clientApi/getDeptByClientId`,
        method: 'post',
        params: parameter,
    })
}
// 重新审核
export function reClient (parameter) {
    return axios({
        url: `${base}/clientApi/reClient`,
        method: 'post',
        params: parameter,
    })
}


// 应用接口可申请列表
export function clentApiApplyList (params) {
    return axios({
        url: `${base}/api/clentApiApplyList`,
        method: 'post',
        params,
    })
}
// 应用审核通过
export function auditOk (params) {
    return axios({
        url: `${base}/client/auditOk`,
        method: 'post',
        params
    })
}
// 应用审核拒绝
export function auditNo (params) {
    return axios({
        url: `${base}/client/auditNo`,
        method: 'post',
        params
    })
}
// 查询应用历史日志
export function clientAuditLog (params) {
    return axios({
        url: `${base}/client/clientAuditLog`,
        method: 'get',
        params
    })
}
// api审核日志
export function apiAuditLog (params) {
    return axios({
        url: `${base}/clientApi/apiAuditLog`,
        method: 'get',
        params
    })
}
// 开发商审核日志

export function getClientApiLogByclientApiId (params) {
    return axios({
        url: `${base}/clientApi/getClientApiLogByclientApiId`,
        method: 'get',
        params
    })
}