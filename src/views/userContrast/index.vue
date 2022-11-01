<template>
    <div class="main">
        <div class="wrap">
            <div class="main_content">
                <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px'}" :bordered=false>
                    <div class="main_margin_bottom_10">
                        <a-input style="width:200px; margin-right: 10px" v-model="username" placeholder="请输入用户名/姓名" />
                        <a-input style="width:200px; margin-right: 10px" v-model="clientUsername" placeholder="请输入对照用户名" />
                        <a-select style="width:200px; margin-right: 10px" v-model="clientId" placeholder="请选择应用名称" allowClear>
                            <a-select-option v-for="(item, index) in clientList" :key="index" :value="String(item.clientId)">{{item.clientName}}</a-select-option>
                        </a-select>
                        <a-button type="primary" style="vertical-align: baseline;" @click="getList(1)">
                            <span class="iconfont">&#xe607;</span>
                            <label class="btn_text"> 查询</label>
                        </a-button>
                    </div>
                    <div class="optionBtns">
                        <a-button class="add" style="margin-right:20px" @click="openModal('add')" type="primary">
                            <span class="iconfont">&#xe61a;</span>
                            <label class="btn_text">添加</label>
                        </a-button>
                        <a-button class="edit" style="margin-right:20px" @click="openModal('edit',selectedRow)" :disabled="disabled" type="primary" >
                            <span class="iconfont font_size_20">&#xe632;</span>
                            <label class="btn_text">编辑</label>
                        </a-button>
                        <a-button style="margin-right:20px" @click="del(selectedRow)" :disabled="disabled" class="del" type="primary" >
                            <span class="iconfont">&#xe619;</span>
                            <label class="btn_text">删除</label>
                        </a-button>
                        <a-button class="add" style="margin-right:20px" @click="import(selectedRow)" type="primary">
                            <span>导入</span>
                            <input class="upload" type="file" ref="file" name="file" id="file" @change="dataImport($event)" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                        </a-button>
                        <a-button class="add" style="margin-right:20px" @click="download(selectedRow)" type="primary">下载模板</a-button>
                    </div>
                    <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false" :pagination="pagination" @change="change" :rowSelection="rowSelection">
                    </a-table>
                </a-card>
            </div>
        </div>
        
        <!-- 添加 -->
        <a-modal :title="modal_title" :visible="visible" width="50%" style="min-width:500px" @cancel="visible = false" destroyOnClose :maskClosable="false" :keyboard="false" centered >
            <a-form :form="form">
                <a-form-item label="id" style="display:none" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-input v-decorator="['id']" />
                </a-form-item>
                <a-form-item label="应用名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-select v-decorator="['clientId',{rules: [{ required: true, message: '请选择应用名称！' }]}]" placeholder="请选择应用名称">
                        <a-select-option v-for="(item, index) in clientList" :key="index" :value="String(item.clientId)">{{item.clientName}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="认证用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-input v-decorator="['username']" placeholder="请输入认证用户名" />
                </a-form-item>
                <a-form-item label="应用登录名" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-input v-decorator="['clientUsername']" placeholder="请输入应用登录名" />
                </a-form-item>
            </a-form>
            <div slot="footer">
                <a-button @click="visible = false">关闭</a-button>
                <a-button type="primary" :loading="confirmLoading" @click="save">保存</a-button>
            </div>
        </a-modal>

    </div>
</template>

<script>
    import * as API from '@/api/userContrast'
    import { getClientListAll } from '@/api/data'
    
    export default {
        name: 'userContrast',
        data() {
            return {
                // 表头
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'num',
                        customRender: (text, records, index) =>
                        `${ index + 1 }` 
                    },
                    {
                        title: '应用名称',
                        dataIndex: 'clientName',
                    },
                    {
                        title: '用户名',
                        dataIndex: 'username',
                    },
                    {
                        title: '用户姓名',
                        dataIndex: 'nickname',
                    },
                    {
                        title: '对照用户名',
                        dataIndex: 'clientUsername',
                    },
                    {
                        title: '创建人',
                        dataIndex: 'createUsername',
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                    }
                ],
                //表格对象
                selectedRowKeys: '', //已选择行id
                selectedRow: {}, //已选择行信息
                disabled: true,
                data: [], //列表数据
                pagination: { //分页
                    total: 0,
                    current: 1,
                    pageSize: 10, //每页中显示10条数据
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
                },
                clientUsername: null,
                username: null,
                clientId: undefined,
                modal_title: '',
                type: '',
                visible: false,
                form: null,
                confirmLoading: false,
                clientList: []
            }
        },
        created() {
            this.getList()
            this.getClient()
        },
        methods: {
            getList(page){
                API.contrastList({
                    clientUsername: this.clientUsername,
                    username: this.username,
                    clientId: this.clientId,
                    pageNum: page ? page : this.pagination.current,
                    pageSize: this.pagination.pageSize
                }).then(res => {
                    this.pagination.total = res.value.total
                    this.data = res.value.records
                })
            },
            change(pagination){
                this.pagination.current = pagination.current
                this.pagination.pageSize = pagination.pageSize
                this.getList()
            },
            getClient(){
                getClientListAll({status: 2}).then(res => {
                    this.clientList = res.value
                })
            },
            async openModal(type, data){
                this.type = type
                this.form = this.$form.createForm(this)
                if(this.type == 'add'){
                    this.modal_title = '添加用户'
                }else{
                    this.modal_title = '编辑用户'
                    this.$nextTick(() => {
                        this.form.setFieldsValue({
                            ...data,
                            status: String(data.status)
                        })
                    })
                }
                this.visible = true
            },
            save(){
                let formData = this.form.getFieldsValue()
                this.form.validateFields(err => {
                    if(!err) {
                        API.contrastSave(formData).then(res => {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: this.type == 'add' ? '添加成功' : '编辑成功',
                                onOk() {},
                            })
                            this.getList(1)
                            this.disabled = true
                            this.selectedRowKeys = ''
                            this.selectedRow = {}
                            this.visible = false
                        })
                    }
                })
            },
            del(data){
                this.$confirm({
                    centered: true,
                    title: '提示',
                    content: '您确定要删除选中的数据吗',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        API.contrastDel(data.id).then((res) => {
                                this.$success({
                                    centered: true,
                                    title: '成功',
                                    content: '删除成功',
                                    onOk() {},
                                })
                                this.disabled = true
                                this.selectedRowKeys = ''
                                this.selectedRow = {}
                                this.getList()
                            }).catch((err) => {
                                if(err.response.status == 400){
                                    this.$error({
                                        centered: true,
                                        title: '失败',
                                        content: err.response.data.resultMessage,
                                        onOk() {}
                                    })
                                }
                            })
                    },
                    onCancel: () => {
                        console.log('退出')
                    },
                })
            },
            dataImport(e){
                let file = e.target.files[0]
				if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
					this.$info({
						centered: true,
						title: '提示',
						content: '请选择Excel文件！',
						onOk() {}
					})
					this.$refs.file.value = ''
				} else {
					let data = new FormData()
					data.append('file', file)
					API.contrastUpload(data).then(res => {
						if (res.resultCode == 200) {
							this.$success({
								centered: true,
								title: '成功',
								content: file.name + '上传成功！',
								onOk() {}
							})
						} else {
                            this.$confirm({
                                centered: true,
                                title: '提示',
                                content: '上传完成，有错误数据是否下载',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: () => {
                                    this.common.dc(res, '用户对照.xls')
                                },
                                onCancel: () => {
                                    console.log('退出')
                                },
                            })
						}
                        this.getList()	
                        this.$refs.file.value = ''
					})
				}
            },
            download(){
                API.contrastTemp().then(res => {
                    this.common.dc(res, '用户对照.xls')
                })
            }
        },
        computed: {
            rowSelection() {
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
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.optionBtns {
    margin-top: 15px;
    margin-bottom: 10px;
}
.info_btn {
    color: #189dff;
    padding: 2px 0;
    border-bottom: 1px solid #189dff;
    cursor: pointer;
}
.upload {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
}
</style>
