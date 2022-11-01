import api from './index'
import { axios } from '@/utils/request'
// const base = '/xxbz'
// const base = '/standard'
const base = ''

/**
 * 
 *  数据源相关
 * 
 */




//查询用户信息分页
export function getUserPage(parameter) {
    return axios({
        url: `${base}/user`,
        method: 'get',
        params: parameter,
    })
}

//获取用户信息
export function getUserInfo(id) {
    return axios({
        url: `${base}/user/getUserInfo/` + id,
        method: 'get',
    })
}

// 获取未分配的用户列表
export function getUserNoRoleList(parameter) {
    return axios({
        url: `${base}/user/userNoRoleList`,
        method: 'get',
        params: parameter,
    })
}

//获取当前登录用户信息
export function currentUserInfo() {
    return axios({
        url: `${base}/user/currentUserInfo`,
        method: 'post',
    })
}

//新增用户信息
export function addUser(parameter) {
    return axios({
        url: `${base}/user`,
        method: 'post',
        data: parameter,
    })
}

//编辑用户信息
export function updateUser(parameter) {
    return axios({
        url: `${base}/user`,
        method: 'PUT',
        data: parameter,
    })
}

// 保存用户数据权限
export function saveUserDept(parameter) {
    return axios({
        url: `${base}/user/saveUserDept`,
        method: 'post',
        data: parameter,
    })
}

// 删除用户部门权限,逗号分隔
export function removeDept(parameter) {
    return axios({
        url: `${base}/user/removeDept`,
        method: 'DELETE',
        params: parameter,
    })
}

// 用户类型,逗号分隔
export function userType(parameter) {
    return axios({
        url: `${base}/user/type`,
        method: 'post',
        params: parameter,
    })
}

//根据用户id查询部门
export function getDeptInfo(id) {
    return axios({
        url: `${base}/user/dept/` + id,
        method: 'get',
    })
}

//删除用户信息
export function delUser(id) {
    return axios({
        url: `${base}/user/` + id,
        method: 'DELETE'
    })
}

// 密码初始化
export function reset(parameter) {
    return axios({
        url: `${base}/user/password/reset`,
        method: 'PUT',
        params: parameter,
    })
}

// 修改密码
export function changePassword(parameter) {
    return axios({
        url: `${base}/user/password`,
        method: 'PUT',
        params: parameter,
    })
}

// 修改用户状态
export function handleStatus(parameter) {
    return axios({
        url: `${base}/user/handleStatus`,
        method: 'PUT',
        params: parameter,
    })
}

//新增编辑用户 角色列表
export function getRoleList(parameter) {
    return axios({
        url: `${base}/role`,
        method: 'get',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

// 钉钉
export function jumpDing(params) {
    return axios({
        url: `${base}/bind/jumpDing`,
        method: 'get',
        params,
    })
}

// 绑定钉钉
export function dingBind(params) {
    return axios({
        url: `${base}/bind/dingBind`,
        method: 'get',
        params,
    })
}

// 解绑钉钉
export function removeDingBind(params) {
    return axios({
        url: `${base}/bind/remove`,
        method: 'POST',
        params,
    })
}

// 查询用户所有第三方绑定信息
export function userBindInfo(params) {
    return axios({
        url: `${base}/bind/userBindInfo`,
        method: 'get',
        params,
    })
}

//获取当前用户角色
export function currentUserRole() {
    return axios({
        url: `${base}/role/currentUserRole`,
        method: 'get',
    })
}

//根据角色id查询用户
export function getUserFromId(params) {
    return axios({
        url: `${base}/role/user`,
        method: 'get',
        params
    })
}

//保存角色用户
export function saveRoleUser(parameter) {
    return axios({
        url: `${base}/role/saveRoleUser`,
        method: 'post',
        params: parameter,
    })
}

//移除角色用户
export function removeRoleUser(parameter) {
    return axios({
        url: `${base}/role/removeRoleUser`,
        method: 'post',
        params: parameter,
    })
}

//获取部门列表
export function getDeptList(parameter) {
    return axios({
        url: `${base}/dept`,
        method: 'get',
        params: parameter,
    })
}


//新增部门
export function addDept(parameter) {
    return axios({
        url: `${base}/dept`,
        method: 'post',
        data: parameter,
    })
}

//修改部门
export function editDept(parameter) {
    return axios({
        url: `${base}/dept`,
        method: 'PUT',
        data: parameter,
    })
}

//查询部门详细信息
export function getDeptById(parameter) {
    return axios({
        url: `${base}/dept/getById`,
        method: 'get',
        params: parameter,
    })
}

// 角色
export function delRole(id) {
    return axios({
        url: `${base}/role/` + id,
        method: 'DELETE',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}
// 新增角色权限管理获取已选择的id
export function getRoleMenuId(id) {
    return axios({
        url: `${base}/role/menu/` + id,
        method: 'get'
    })
}
// 新增角色
export function addRole(parameter) {
    return axios({
        url: `${base}/role`,
        method: 'POST',
        data: parameter,
    })
}
// 编辑角色
export function updateRole(parameter) {
    return axios({
        url: `${base}/role`,
        method: 'PUT',
        data: parameter,
    })
}

// 保存角色菜单
export function saveRoleMenu(parameter) {
    return axios({
        url: `${base}/role/saveRoleMenu`,
        method: 'POST',
        data: parameter,
    })
}

// 查询客户端列表
export function getClientList(parameter) {
    return axios({
        url: `${base}/client/list`,
        method: 'POST',
        data: parameter,
    })
}

// 查询客户端列表（全部）
export function getClientListAll(parameter) {
    return axios({
        url: `${base}/client/listAll`,
        method: 'POST',
        data: parameter,
    })
}

// 客户端注册
export function registerClient(parameter) {
    return axios({
        url: `${base}/client/register`,
        method: 'POST',
        data: parameter,
    })
}

// 查询单个客户端信息
export function getClientInfo(id) {
    return axios({
        url: `${base}/client/clientInfo/` + id,
        method: 'POST',
    })
}

// 上下架客户端
export function jumpIndex(id) {
    return axios({
        url: `${base}/client/jumpIndex/`+ id,
        method: 'get',
    })
}

// 上下架客户端
export function handleClientStatus(parameter) {
    return axios({
        url: `${base}/client/handleStatus`,
        method: 'POST',
        params: parameter,
    })
}

// 申请上架
export function requestPublish(parameter) {
    return axios({
        url: `${base}/client/requestPublish`,
        method: 'POST',
        params: parameter,
    })
}

// 审核上架通过客户端
export function publishOk(parameter) {
    return axios({
        url: `${base}/client/publishOk`,
        method: 'POST',
        params: parameter,
    })
}

// 审核上架拒绝客户端
export function publishNo(parameter) {
    return axios({
        url: `${base}/client/publishNo`,
        method: 'POST',
        params: parameter,
    })
}

// 删除客户端
export function delClient(id) {
    return axios({
        url: `${base}/client/` + id,
        method: 'DELETE',
    })
}
// 个人中心我的应用
export function myClient() {
    return axios({
        url: `${base}/client/myClient`,
        method: 'get',
    })
}

// 审核客户端
export function auditClient(parameter) {
    return axios({
        url: `${base}/client/audit`,
        method: 'post',
        params: parameter,
    })
}

// 根据角色id查询服务
export function getClientFromId(id) {
    return axios({
        url: `${base}/role/client/` + id,
        method: 'get',
    })
}

// 保存角色服务
export function saveRoleClient(parameter) {
    return axios({
        url: `${base}/role/saveRoleClient`,
        method: 'POST',
        data: parameter,
    })
}

// 菜单

export function getUserMenuList(parameter) {
    return axios({
        url: `${base}/menu/getUserMenuList`,
        method: 'get',
        params: parameter,
    })
}

export function getMenuList(parameter) {
    return axios({
        url: `${base}/menu/getMenuList`,
        method: 'get',
        params: parameter,
    })
}
export function getMenuRouter(url) {
    return axios({
        url: `${base}/menu/` + url,
        method: 'get',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

// 数据字典
export function getDictList(parameter) {
    return axios({
        url: `${base}/dict`,
        method: 'get',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

// 新增数据字典

export function addDict(parameter) {
    return axios({
        url: `${base}/dict`,
        method: 'post',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

// 新增数据字典

export function editDict(parameter) {
    return axios({
        url: `${base}/dict`,
        method: 'PUT',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//删除数据字典
export function delDict(id) {
    return axios({
        url: `${base}/dict/` + id,
        method: 'DELETE',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//导出数据字典
export function exportDict(parameter) {
    return axios({
        url: `${base}/dict/excel`,
        method: 'POST',
        params: parameter,
        responseType: 'blob',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}


// 在线用户
export function onlineList(parameter) {
    return axios({
        url: `${base}/online`,
        method: 'get',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//踢用户

export function kickout(id) {
    return axios({
        url: `${base}/kickout/` + id,
        method: 'DELETE',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

// 日志列表

export function logList(parameter) {
    return axios({
        url: `${base}/log/logList`,
        method: 'get',
        params: parameter
    })
}

// 登录日志列表
export function loginLis(parameter) {
    return axios({
        url: `${base}/log/loginList`,
        method: 'get',
        params: parameter
    })
}

// 删除日志

export function delLog(id) {
    return axios({
        url: `${base}/log/` + id,
        method: 'DELETE',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//导出日志
export function exportLog(parameter) {
    return axios({
        url: `${base}/log/excel`,
        method: 'POST',
        params: parameter,
        responseType: 'blob',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//导出用户
export function exportUser(parameter) {
    return axios({
        url: `${base}/user/excel`,
        method: 'POST',
        params: parameter,
        responseType: 'blob',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//导出角色
export function exportRole(parameter) {
    return axios({
        url: `${base}/role/excel`,
        method: 'POST',
        params: parameter,
        responseType: 'blob',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}
//导出菜单
export function exportMenu(parameter) {
    return axios({
        url: `${base}/menu/excel`,
        method: 'POST',
        params: parameter,
        responseType: 'blob',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//新增菜单
export function addMenu(parameter) {
    return axios({
        url: `${base}/menu/add`,
        method: 'POST',
        data: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//编辑菜单
export function updateMenu(parameter) {
    return axios({
        url: `${base}/menu/update`,
        method: 'POST',
        data: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

// 删除菜单
export function delMenu(parameter) {
    return axios({
        url: `${base}/menu/deleteMenus`,
        method: 'get',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

//同步
export function deptList(parameter) {
    return axios({
        url: `${base}/dept`,
        method: 'get',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}


// 编辑保存
export function updateDept(parameter) {
    return axios({
        url: `${base}/dept`,
        method: 'PUT',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}
// 删除
export function delDept(id) {
    return axios({
        url: `${base}/dept/` + id,
        method: 'DELETE',
    })
}

// 导出

export function exportDept(parameter) {
    return axios({
        url: `${base}/dept/excel`,
        method: 'POST',
        params: parameter,
        responseType: 'blob',
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}


// 修改头像

export function uploadAvatar(parameter) {
    return axios({
        url: `${base}/user/avatar`,
        method: 'PUT',
        params: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

// 上传图片
export function fileUpload(parameter) {
    return axios({
        url: `${base}/client/fileUpload`,
        method: 'POST',
        data: parameter,
        headers: {
            "Authentication": localStorage.getItem('token')    //请求头携带的token
        }
    })
}

// 绑定邮箱
export function bindEmail(params) {
    return axios({
        url: `${base}/bind/bindEmail`,
        method: 'get',
        params
    })
}


// 获取第三方注册用户的信息（含应用是否认证成功信息）
export function getLoginAuthUser(params) {
    return axios({
        url: `${base}/getLoginAuthUser`,
        method: 'post',
        params
    })
}
// 用户认证信息审核列表
export function getAuthUserList(params) {
    return axios({
        url: `${base}/getAuthUserList`,
        method: 'post',
        params
    })
}
// 审核认证信息
export function auditUser(params) {
    return axios({
        url: `${base}/auditUser`,
        method: 'post',
        params
    })
}
// getAuthUser
export function getAuthUser(params) {
    return axios({
        url: `${base}/getAuthUser`,
        method: 'post',
        params
    })
}


// 查询机构类别
export function getOrganizationTypeList(params) {
    return axios({
        url: `${base}/dept/getTypeList`,
        method: 'get',
        params
    })
}

// 获取用户列表
export const getUserListAll = (params) => {
	return axios({
		url: `${base}/user/userListAll`,
		method: 'get',
		params
	})
}

// 查询机构下的子部门树，集团的子部门
export const getChildDept = (params) => {
	return axios({
		url: `${base}/dept/childDept`,
		method: 'get',
		params
	})
}

// 获取教育局在内的学校
export const getOrgList = (params) => {
	return axios({
		url: `${base}/client/orgList`,
		method: 'get',
		params
	})
}