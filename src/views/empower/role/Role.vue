<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <a-card
          style="border-radius:2px;"
          :bodyStyle="{padding:'24px 24px 5px 24px'}"
          :bordered="false"
        >
          <a-form class="searchform">
            <a-form-item :colon="false" class="main_margin_bottom_15">
              <a-input style="width:250px; margin-right: 10px" v-model="roleName" placeholder="请输入角色" />
              <a-button type="primary" style="vertical-align: baseline;" @click="getList">
                <span class="iconfont">&#xe607;</span>
                <label class="btn_text">查询</label>
              </a-button>
            </a-form-item>
          </a-form>
          <div class="optionBtns main_margin_bottom_10">
            <a-button class="add" style="margin-right:20px" @click="add('add')" type="primary">
              <span class="iconfont">&#xe61a;</span>
              <label class="btn_text">添加</label>
            </a-button>
            <a-button class="edit" style="margin-right:20px" @click="add('edit',selectedRow)" :disabled="disabled" type="primary" >
              <span class="iconfont font_size_20">&#xe632;</span>
              <label class="btn_text">编辑</label>
            </a-button>
            <a-button style="margin-right:20px" @click="del(selectedRow)" :disabled="disabled" class="del" type="primary" >
              <span class="iconfont">&#xe619;</span>
              <label class="btn_text">删除</label>
            </a-button>
            <a-button class="add" style="margin-right:20px" :disabled="disabled" type="primary" @click="gnsq(selectedRow)">
              <span class="iconfont font_size_20">&#xe60f;</span>
              <label class="btn_text" style="margin-left: 0;">功能授权</label>
            </a-button>
            <a-button class="add" style="margin-right:20px" :disabled="disabled" type="primary" @click="fp('user',selectedRow)">
              <span class="iconfont font_size_20">&#xe60f;</span>
              <label class="btn_text" style="margin-left: 0;">分配用户</label>
            </a-button>
          </div>
          <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false" :pagination="pagination" @change="change" :rowSelection="rowSelection" >
            <div slot="xh" slot-scope="text,record,index">
                <span>{{index+1}}</span>
            </div>
          </a-table>
        </a-card>

        <!-- 功能授权 -->
        <role-tree ref="roleTree" :roleInfoData="roleInfo.data" :title="roleTree.title" @close="close" @success="saveRoleMenu" :roleEditVisiable="roleTree.visiable" ></role-tree>
      </div>
    </div>

    <!-- 新增修改 -->
    <a-modal :title="modal_title" :visible="visiable" width="50%" style="min-width:500px" @cancel="exit('visiable')" destroyOnClose :maskClosable="false" :keyboard="false" centered >
      <a-form :form="form" @submit="saveRole">
        <a-form-item label="角色名称" style="display: none;" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="type == 'edit'" >
          <a-input v-decorator="['roleId']" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input
            v-decorator="['roleName',{rules: [{ required: true, message: '请输入角色名称！' }]}]"
            placeholder="请输入角色名称"
          />
        </a-form-item>
        <a-form-item label="角色描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-textarea
            v-decorator="['remark',{rules: [{ required: true, message: '请输入角色描述！' }]}]"
            placeholder="请输入角色描述"
          />
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="exit('visiable')">关闭</a-button>
        <a-button type="primary" @click="saveRole">保存</a-button>
      </div>
    </a-modal>

    <!-- 分配用户&分配应用 -->
    <a-modal :title="modal_title" :visible="fp_visiable" width="65%" style="min-width:500px" @cancel="exit('fp_visiable')" destroyOnClose :maskClosable="false" :keyboard="false" centered :bodyStyle="{height: '550px', 'overflow-y': 'auto'}" >
        <div class="modal-box">
            <div class="table-box">
                <div class="left">
                    <div class="btn_group">
                        <a-input style="width:200px; margin-right: 10px" v-model="unJoinName" placeholder="请输入姓名" />
                        <a-select show-search option-filter-prop="children" :filter-option="filterOption" style="width:200px; margin-right: 10px" v-model="unJoinDeptId" placeholder="请选择组织机构" allowClear>
                            <a-select-option v-for="(item, index) in bmList" :key="index" :value="item.value">{{item.title}}</a-select-option>
                        </a-select>
                        <a-button type="primary" style="vertical-align: baseline;"  @click="search('unJoin')">
                            <span class="iconfont">&#xe607;</span>
                            <label class="btn_text">查询</label>
                        </a-button>
                    </div>
                    <a-table  ref="table"  size="middle"  :columns="fp_columns"  :dataSource="fp_tableData"  :alert="false"  :showSizeChanger="false"  :pagination="nPagination" @change="e => this.onChange(e, 'unJoin')" :scroll="{y:350}" :rowSelection="null">
                        <div slot="cz" slot-scope="text,record,index">
                            <a-button type="primary" @click="userToRight('one',index)">分配</a-button>
                        </div>
                        <span slot="status" slot-scope="text,record">{{record.status == 1 ? '启用' : '停用'}}</span>
                    </a-table>
                </div>
                <div class="right">
                    <div class="btn_group">
                        <a-input style="width:200px; margin-right: 10px" v-model="joinName" placeholder="请输入姓名" />
                        <a-select show-search option-filter-prop="children" :filter-option="filterOption" style="width:200px; margin-right: 10px" v-model="joinDeptId" placeholder="请选择组织机构" allowClear>
                            <a-select-option v-for="(item, index) in bmList" :key="index" :value="item.value">{{item.title}}</a-select-option>
                        </a-select>
                        <a-button type="primary" style="vertical-align: baseline;"  @click="search('join')">
                            <span class="iconfont">&#xe607;</span>
                            <label class="btn_text">查询</label>
                        </a-button>
                    </div>
                    <a-table  ref="table"  size="middle"  :columns="fp_columns"  :dataSource="fp_selected_tableData"  :alert="false"  :showSizeChanger="false"  :pagination="sPagination" @change="e => this.onChange(e, 'join')" :scroll="{y:350}" :rowSelection="null" >
                        <div slot="cz" slot-scope="text,record,index">
                            <a-button type="primary" @click="userToLeft('one',index)">取消</a-button>
                        </div>
                        <span slot="status" slot-scope="text,record">{{record.status == 1 ? '启用' : '停用'}}</span>
                    </a-table>
                </div>
            </div>
        </div>
        <div slot="footer">
            <a-button @click="exit('fp_visiable')">关闭</a-button>
        </div>
    </a-modal>
  </div>
</template>

<script>
import * as API from '@/api/data'
import RoleTree from './RoleTree'
export default {
    name: 'Role',
    components: {
        RoleTree,
    },
    data() {
        return {
            visiable: false,
            fp_visiable: false, // 分配用户&分配应用
            roleTree: {
                visiable: false,
                title: ''
            },
            roleInfo: {
                visiable: false,
                data: {},
            },
            // 查询参数
            queryParam: {},
            // 表头
            columns: [
                {
                    title: '序号',
                    dataIndex: '',
                    width: '10%',
                    scopedSlots: {
                        customRender: 'xh',
                    },
                },
                {
                    title: '角色名称',
                    width: '20%',
                    dataIndex: 'roleName',
                },
                {
                    title: '用户数',
                    width: '10%',
                    dataIndex: 'userCount',
                },
                {
                    title: '角色描述',
                    dataIndex: 'remark',
                    width: '50%',
                },
            ],
            disabled: true,
            selectedRowKeys: {},
            selectedRow: [],
            roleName: '', // 角色
            data: [], //列表
            pagination: {
                //分页
                total: 0,
                current: 1,
                pageSize: 10, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            nPagination: {
                //分页
                total: 0,
                current: 1,
                pageSize: 10, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            sPagination: {
                //分页
                total: 0,
                current: 1,
                pageSize: 10, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            modal_title: '',
            form: this.$form.createForm(this),
            // 树
            treeData: [],
            checkedKeys: [],
            type: '',
            defaultCheckedKeys: [],
            expandedKeys: [], 
            fp_columns: [],
            fp_tableData: [],
            fp_selected_tableData: [],
            fp_keywords: '', // 分配用户，分配应用  搜索关键词
            selectedRowKeys2: [], // 分配用户
            selectedRowKeys3: [], // 取消用户
            fp_type: '', // 分配，取消
            bmList: [], // 部门列表
            unJoinName: undefined,
            joinName: undefined,
            unJoinDeptId: undefined,
            joinDeptId: undefined,
        }
    },
    mounted() {
        // 获取角色列表
        this.getList();
    },
    methods: {
        close() {
            this.roleTree.visiable = false
        },
        // 获取角色列表
        getList() {
            API.getRoleList({
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize,
                roleName: this.roleName,
            }).then((res) => {
                this.pagination.total = Number(res.total)
                this.data = res.rows
            })
        },
        // 获取用户列表
        async getUserList() {
            let res = await API.getUserNoRoleList({
                username: this.unJoinName,
                deptId:this.unJoinDeptId,
                roleId: this.selectedRow.roleId,
                pageNum: this.nPagination.current,
                pageSize: this.nPagination.pageSize
            })
            this.fp_tableData = res.rows;
            this.nPagination.total = Number(res.total)
        },
        // 获取分配过的用户
        async getJoinUser(){
             let res = await API.getUserFromId({
                deptId: this.joinDeptId,
                name: this.joinName,
                roleId: this.selectedRow.roleId,
                pageNum: this.sPagination.current,
                pageSize: this.sPagination.pageSize
            })
            if(res.resultCode == 200) {
                this.fp_selected_tableData = res.value.records
                this.sPagination.total = res.value.total
            }
        },
        // 获取部门列表
        getDeptList() {
            API.getDeptList().then((res) => {
                for (var i = 0; i < res.rows.children.length; i++) {
                    this.bmList.push(res.rows.children[i])
                }
            })
        },
        onChange(paginatin, type){
            if(type == 'unJoin'){
                this.nPagination.current = paginatin.current
                this.nPagination.pageSize = paginatin.pageSize
                this.getUserList()
            }
            if(type == 'join'){
                this.sPagination.current = paginatin.current
                this.sPagination.pageSize = paginatin.pageSize
                this.getJoinUser()
            }
        },
        // 分配用户，搜索
        search(type) {
            if(type == 'unJoin') {
                this.fp_tableData = []
                this.nPagination.current = 1
                this.getUserList();
            } 
            if(type == 'join') {
                this.fp_selected_tableData = []
                this.sPagination.current = 1
                this.getJoinUser();
            } 
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        // 新增编辑
        add(obj, data) {
            this.type = obj
            this.form.resetFields()
            if (obj == 'add') {
                this.visiable = true
                this.modal_title = '添加角色'
            } else {
                this.visiable = true
                this.modal_title = '编辑角色'
                setTimeout(() => {
                    this.form.setFieldsValue(data)
                }, 0)
            }
        },
        // 关闭新增编辑角色弹窗
        exit(target) {
            this[target] = false;
        },
        // 功能授权
        gnsq(data) {
            this.roleTree.visiable = true;
            this.roleInfo.data = data;
            this.roleTree.title = '角色' + '【'+data.roleName+'】' + '功能授权'
        },
        // 分配用户user，分配应用application
        fp(type,data) {
            this.fp_visiable = true;
            this.fp_type = type;
            if(type === 'user') {
                this.modal_title = '角色' + '【'+data.roleName+'】' + '分配用户'
                this.fp_columns = [
                    {
                        title: '用户名',
                        dataIndex: 'username',
                        width: '20%',
                        align: 'center',
                    },
                    {
                        title: '姓名',
                        dataIndex: 'nickname',
                        width: '20%',
                        align: 'center',
                    },
                    {
                        title: '部门',
                        dataIndex: 'deptName',
                        width: '20%',
                        align: 'center',
                    },
                    {
                        title: '启用状态',
                        dataIndex: 'status',
                        key: 'status',
                        width: '20%',
                        align: 'center',
                        scopedSlots: {
                            customRender: 'status'
                        },
                    },
                    {
                        dataIndex: 'cz',
                        key: 'cz',
                        width: '20%',
                        align: 'center',
                        slots: { title: 'customTitle' },
                        scopedSlots: {
                            customRender: 'cz'
                        }
                    },
                ]
                this.getUserList();
                this.getJoinUser()
                this.getDeptList()
            }
        },
        // 分配用户
        userToRight(type,key) {
            let userId = ''
            this.fp_tableData.forEach((c,i) => {
                if(this.fp_tableData[key].userId == c.userId) {
                    userId = c.userId
                    this.fp_tableData.splice(i,1)
                }
            })
            API.saveRoleUser({ roleId: this.selectedRow.roleId, userId }).then(res => {
                if(res.resultCode == 200) {
                    // this.getJoinUser()
                    this.search('join')
                    this.search('unJoin')
                }
            })
        },
        // 取消用户 
        userToLeft(type,key) {
            let userId = ''
            this.fp_selected_tableData.forEach((c,i) => {
                if(this.fp_selected_tableData[key].userId == c.userId) {
                    userId = c.userId
                    this.fp_selected_tableData.splice(i,1)
                }
            })
            API.removeRoleUser({ roleId: this.selectedRow.roleId, userId }).then(res => {
                if(res.resultCode == 200) {
                    this.search('join')
                    this.search('unJoin')
                }
            })
        },
        // 角色状态切换
        ztChange(e, record) {
            if (e) {
                record.status = '1'
            } else {
                record.status = '0'
            }
        },
        getRoleMenuId(data) {
            API.getRoleMenuId(data.roleId).then((res) => {
                if (res) {
                    data.menuId = res
                    setTimeout(() => {
                        this.form.setFieldsValue(data)
                    }, 0)
                }
            })
        },
        // 删除
        del(data) {
            this.$confirm({
                centered: true,
                title: '确认提示',
                content: '您确定要删除选中的数据吗?',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    API.delRole(data.roleId)
                        .then((res) => {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: '删除成功',
                                onOk() {},
                            })
                            this.disabled = true
                            this.pagination.current = 1
                            this.getList()
                        })
                        .catch((err) => {
                            console.log('删除失败')
                        })
                },
                onCancel: () => {
                    console.log('退出')
                },
            })
        },
        //分页切换
        change(pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.queryParam.page = pagination.current
            this.queryParam.size = pagination.pageSize
            this.getList()
        },
        // 新增编辑角色
        saveRole() {
            const data=this.form.getFieldsValue()    
            this.form.validateFields((err) => {
                if (!err) {
                    if(this.type == 'add'){
                        API.addRole(data).then(res=>{
                            if(res.resultCode == 200) {
                                this.visiable = false
                                this.$success({
                                    centered: true,
                                    title: '成功',
                                    content: '添加成功',
                                    onOk() {}
                                })
                                this.pagination.current = 1;
                                this.getList()
                            }
                        }).catch(() => {
                            console.log('保存失败')
                        })
                    }else{
                        API.updateRole(data).then(res=>{
                            if(res.resultCode == 200) {
                                this.visiable = false
                                this.$success({
                                    centered: true,
                                    title: '成功',
                                    content: '编辑成功',
                                    onOk() {}
                                })
                                this.disabled = true
                                this.getList()
                            }
                        }).catch(() => {
                            console.log('编辑失败')
                        })
                    }
                }
            })
            
        },
        // 功能授权
        saveRoleMenu() {
            this.disabled = true;
            this.roleTree.visiable = false;
            this.getList()
        },
        // saveFP
        // saveFP() {
        //     let relationId = [];
        //     this.fp_selected_tableData.forEach(c => {
        //         relationId.push(this.fp_type == 'user' ? c.userId : c.clientId)
        //     })
        //     if(!relationId.length) {
        //         this.$error({
        //             centered: true,
        //             title: '失败',
        //             content: this.fp_type == 'user' ? '请选择分配用户' : '请选择分配应用',
        //             onOk() {},
        //         })
        //         return;
        //     }
        //     let api_url = {'user': 'saveRoleUser','application': 'saveRoleClient'};

        //     API[api_url[this.fp_type]]({
        //         dataId: this.selectedRow.roleId,
        //         relationId: relationId 
        //     }).then((res) => {
        //         if(res.resultCode == 200) {
        //             this.$success({
        //                 centered: true,
        //                 title: '成功',
        //                 content: '保存成功',
        //                 onOk() {},
        //             })
        //             this.fp_visiable = false;
        //         }
        //     }).catch(e => {
        //         console.log('保存失败')
        //     })
        // },
        onExpand(expandedKeys) {
            console.log('onExpand', expandedKeys)
            // if not set autoExpandParent to false, if children expanded, parent can not collapse.
            // or, you can remove all expanded children keys.
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onCheck(checkedKeys, info) {
            console.log('onCheck', checkedKeys)
            this.form.setFieldsValue({
                menuId: checkedKeys,
            })
            // this.checkedKeys = checkedKeys;
        },
        getMenuList() {
            API.getMenuList().then((res) => {
                res.rows.children.forEach((e) => {
                    var Tree = e
                    this.$set(Tree, 'title', Tree.title)
                    this.$set(Tree, 'key', Tree.key)
                    this.$set(Tree, 'value', Tree.id)
                    this.treeData.push(Tree)
                })
            })
        },
    },
    computed: {
        rowSelection() {
            const { selectedRowKeys } = this
            return {
                columnTitle: ' ',
                onChange: (selectedRowKeys, selectedRows) => {
                    //单选
                    if (selectedRowKeys.length >= 1) {
                        selectedRowKeys = selectedRowKeys.splice(0, 1)
                        this.selectedRowKeys = selectedRowKeys
                        this.selectedRow = selectedRows[0]
                        this.disabled = false
                    } else {
                        this.selectedRowKeys = ''
                        this.selectedRow = {}
                        this.disabled = true
                    }
                },
                getCheckboxProps: (record) => ({
                    props: {
                        disabled: record.name === 'Disabled User', // Column configuration not to be checked
                        name: record.name,
                    },
                }),
            }
        },
        rowSelection2() {
            const { selectedRowKeys2 } = this
            return {
                columnTitle: '',
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys2 = selectedRowKeys
                },
                selectedRowKeys: selectedRowKeys2
            }
        },
        rowSelection3() {
            const { selectedRowKeys3 } = this
            return {
                columnTitle: '',
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys3 = selectedRowKeys
                },
                selectedRowKeys: selectedRowKeys3
            }
        },
    },
}
</script>

<style>
 .modal-box .table-box .ant-table-tbody td{
      word-break: break-all!important;
 }
</style>
<style lang="less" scoped>
.optionBtns {
    margin-bottom: 20px;
}

.ant-card-wider-padding .ant-card-body {
    padding: 24px !important;
}
.btn_group {
    margin-bottom: 15px;
}
.modal-box {
    .table-box {
        display: flex;
        .left,.right {
            flex: 1;
        }
    }
}
</style>
