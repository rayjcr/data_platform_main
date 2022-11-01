<template>
    <div class="main">
        <div class="wrap">
            <div class="main_content" v-if="!showInfo">
                <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px'}" :bordered=false>
                    <div class="main_margin_bottom_10">
                        <a-input style="width:200px; margin-right: 10px" v-model="name" placeholder="请输入接口名称" />
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
                        <a-button class="add" style="margin-right:20px" type="primary" :disabled="disabled ? disabled : (selectedRow.status == 1 ? true : false)" @click="handleStatus('online')">上线</a-button>
                        <a-button class="assign" style="margin-right:20px" type="primary" :disabled="disabled ? disabled : (selectedRow.status == 0 ? true : false)" @click="handleStatus('offline')">下线</a-button> 
                        
                    </div>
                    <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false" :pagination="pagination" @change="change" :rowSelection="rowSelection">
                        <div slot="status" slot-scope="text">
                            <span class="color_green" v-if="text == 1">已上线</span>
                            <span class="color_red" v-if="text == 0">已下线</span>
                        </div>
                        <div slot="tools" slot-scope="text, records">
                            <span class="info_btn" @click="openInfo(records)">详情</span>
                           
                        </div>
                    </a-table>
                </a-card>
            </div>
            <template v-else>
                <InterfaceInfo :interfaceData="interfaceInfo" :id="interfaceInfo.id"/>
            </template>
        </div>
        
        <!-- 添加 -->
        <a-modal :title="modal_title" :visible="visible" width="50%" style="min-width:800px" @cancel="cancel" destroyOnClose :maskClosable="false" :keyboard="false" centered :bodyStyle="{height: '500px', 'overflow-y': 'auto'}" >
            <a-form :form="form">
                <a-form-item label="id" style="display:none" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-input v-decorator="['id']" />
                </a-form-item>
                <a-form-item label="接口名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-input v-decorator="['name', { rules: [{ required: true, message:'请输入接口名称' }] }]" placeholder="请输入接口名称" />
                </a-form-item>
                <a-form-item label="接口地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-input v-decorator="['url', { rules: [{ required: true, message:'请输入接口地址' }] }]" placeholder="请输入接口地址" />
                </a-form-item>
                <a-form-item label="请求方式" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-radio-group v-decorator="['requestType', {rules: [{ required: true, message: '请选择请求方式！' }], initialValue: 'GET' }]" >
                        <a-radio :value="'GET'"> GET </a-radio>
                        <a-radio :value="'POST'"> POST </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="参数类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                     <a-select v-decorator="['contentType', {rules: [{ required: true, message: '请选择参数类型！' }], initialValue: '0'}]" placeholder="请选择参数类型">
                        <a-select-option :value="'0'"> application/x-www-form-urlencoded </a-select-option>
                        <a-select-option :value="'1'"> application/json </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="参数项" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <div class="params_box">
                        <div class="flex align_center mb10" v-for="(item, index) in paramsList" :key="index">
                            <a-input v-model="item.paramKey" style="width: 125px;" placeholder="请输入参数名称" />
                            <a-input v-model="item.paramComment" class="ml10" style="width: 180px;" placeholder="请输入参数注释，可为空" />
                            <span class="label ml10">是否必填：</span>
                            <a-select :value="item.paramType" style="width: 60px; min-width: 60px;height: 32px;" class="ml10 mr10" placeholder="是否必填" @change="(e) => onParamsTypeChagne(e, index)">
                                <a-select-option :value="'2'"> 是 </a-select-option>
                                <a-select-option :value="'1'"> 否 </a-select-option>
                            </a-select>
                            <div class="tools_icon">
                                <span v-if="index == 0" class="iconfont color_green" @click="paramChagne('add')">&#xe683;</span>
                                <span v-else class="iconfont color_red" @click="paramChagne('del', index)">&#xe658;</span>
                            </div>
                        </div>
                    </div>
                </a-form-item>
                <a-form-item label="主题分类" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-select v-decorator="['fdm',{rules: [{ required: true, message: '请选择主题分类！' }]}]" placeholder="请选择主题分类" @change="e => this.getInterfaceType(e)">
                        <a-select-option v-for="(item, index) in parentTypeList" :key="index" :value="String(item.id)">{{item.mc}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="接口分类" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-select v-decorator="['type',{rules: [{ required: true, message: '请选择接口分类！' }]}]" placeholder="请选择接口分类">
                        <a-select-option v-for="(item, index) in typeList" :key="index" :value="String(item.dm)">{{item.mc}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="接口标签" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-checkbox-group v-decorator="['state', {rules: [{ required: true, message: '请选择接口标签！' }]}]" name="checkbox">
						<a-checkbox :value="'2'">应用开发者集成</a-checkbox>
						<a-checkbox :value="'1'">应用认证集成</a-checkbox>
					</a-checkbox-group>
                </a-form-item>
                
                <a-form-item label="接口简介" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-textarea v-decorator="['comment']" placeholder="请输入接口简介300字以内" :rows="4" />
                </a-form-item>
                <a-form-item label="接口文档" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-upload name="file" :multiple="false" accept=".md, .xlsx" :fileList="fileList" :beforeUpload="beforeUpload" :customRequest="customRequest">
                        <a-button type="primary">上传文档</a-button>
                    </a-upload>
                    <a-input style="display:none" v-decorator="['file', { rules: [{ required: true, message:'请上传接口文档' }] } ]" />
                </a-form-item>
                <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-radio-group v-decorator="['status', { initialValue: '1' }]" name="radio">
						<a-radio :value="'1'">已上线</a-radio>
						<a-radio :value="'0'">已下线</a-radio>
					</a-radio-group>
                </a-form-item>
            </a-form>
            <div slot="footer">
                <a-button @click="cancel">关闭</a-button>
                <a-button type="primary" :loading="confirmLoading" @click="save">保存</a-button>
            </div>
        </a-modal>

    </div>
</template>

<script>
    import * as API from '@/api/interface'
    import InterfaceInfo from './interfaceInfo.vue'
    
    export default {
        name: 'interface',
        components: { InterfaceInfo },
        data() {
            return {
                // 表头
                columns: [
                    {
                        title: '接口名称',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: '主题分类',
                        dataIndex: 'fmc',
                    },
                    {
                        title: '接口分类',
                        dataIndex: 'mc',
                    },
                    {
                        title: '接口标签',
                        dataIndex: 'state',
                        customRender: (text, records, index) => 
                        `${ this.getInterfaceLabel(text) }`
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: {
                            customRender: 'status'
                        }
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'creatTime',
                        width: '20%'
                    },
                    {
                        title: '操作',
                        width:200,
                        scopedSlots: {
                            customRender: 'tools'
                        }
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
                name: null,
                modal_title: '',
                type: '',
                visible: false,
                form: null,
                parentTypeList: [],
                typeList: [],
                confirmLoading: false,
                fileList: null,
                showInfo: false,
                interfaceInfo: {},
                paramsList: [
                    {
                        paramKey: null,
                        paramType: '1',
                        paramComment: null,
                    }
                ]
            }
        },
        created() {
            this.getList()
            this.getInterfaceType()
        },
        methods: {
            getList(page){
                if(page) this.pagination.current = page
                API.interfaceList({
                    name: this.name,
                    pageNum: this.pagination.current,
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
            async getInterfaceType(id){
                let res = await API.interfaceType({ fdm: id || 0 })
                if(!id) this.parentTypeList = res.value
                else this.typeList = res.value
            },
            getInterfaceLabel(label){
                let arr = label.split(',')
                let labelArr = ['应用认证集成', '应用开发者集成']
                let text = ''
                arr.forEach(item => {
                    text += labelArr[Number(item) - 1] + '，'
                })
                return text.substring(0, text.length - 1)
            },
            async openModal(type, data){
                this.type = type
                this.form = this.$form.createForm(this)
                if(this.type == 'add'){
                    this.modal_title = '添加接口信息'
                    this.paramsList = [
                        {
                            paramKey: null,
                            paramType: '1',
                            paramComment: null,
                        }
                    ]
                }else{
                    this.modal_title = '编辑接口信息'
                    this.$nextTick(async () => {
                        let res = await API.getInterfaceById({id: data.id})
                        await this.getInterfaceType(data.fdm)
                        this.form.setFieldsValue({
                            ...res.value,
                            fdm: String(data.fdm),
                            status: String(res.value.status),
                            state: res.value.state.split(','),
                            contentType: res.value.contentType || '0',
                            requestType: res.value.requestType || 'GET'
                        })
                        if(res.value.paramList.length){
                            this.paramsList = res.value.paramList 
                        }
                        this.fileList = []
                        this.fileList.push({
                            uid: '1',
                            name: data.file,
                            url: '/api/'+data.file,
                            thumbUrl: '/api/'+data.file
                        })
                    })
                }
                this.visible = true
            },
            changeFile(info) {
                // 上传文件
                // console.log(info)
            },
            beforeUpload(file, fileList) {
                this.customRequest(file);
                this.fileList = [];
                this.fileList.push(file);
                return false;
            },
            customRequest(file) {
                // 上传提交
                const formData = new FormData();
                formData.append("file", file);
                API.fileUpload(formData).then(res => {
                    this.$nextTick(() => {
                        this.form.setFieldsValue({
                            file: res.value
                        })
                    })
                })
            },
            onParamsTypeChagne(value, index){
                this.paramsList[index].paramType = value
            },
            paramChagne(type, index){
                if(type == 'add') {
                    this.paramsList.push({
                        paramKey: null,
                        paramType: '1',
                        paramComment:null
                    })
                }else{
                    this.paramsList.splice(index, 1)
                }
            },
            save(){
                let formData = this.form.getFieldsValue()
                /*
                    paramList保存参数列表 
                    参数名称paramKey为空, 不传这条数据
                */
                let data = []
                this.paramsList.forEach(item=>{
                    if(item.paramKey){
                        data.push(item)
                    }
                })
                formData = {
                    ...formData,
                    state: formData.state.join(','),
                    paramList: [...data]
                }
                this.form.validateFields(err => {
                    if(!err) {
                        API.interfaceSave(formData).then(res => {
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
                            this.initForm()
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
                        API.interfaceDel(data.id).then((res) => {
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
                            })
                            .catch((err) => {
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
            handleStatus(type){
                let req = type == 'online' ? API.interfaceOnline : API.interfaceOffline
                req({id: this.selectedRow.id}).then(res => {
                    this.$success({
                        centered: true,
                        title: '成功',
                        content: type == 'online' ? '上线成功' : '已下线',
                        onOk() {},
                    })
                    this.disabled = true
                    this.selectedRowKeys = ''
                    this.selectedRow = {}
                    this.getList()
                })
            },
            openInfo(data){
                this.interfaceInfo = data
                this.showInfo = true
            },
            initForm(){
                this.fileList = [];
                // 编辑保存后重置数据
                this.paramsList = [
                    {
                        paramKey: null,
                        paramType: '1',
                        paramComment: null,
                    }
                ]
            },
            cancel(){
                this.visible = false;
                this.initForm()
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
.color_green {
    color: #00ff00;
}
.color_red {
    color: #ff0000;
}
.params_box {
    padding-top: 4px;
    .label {
        font-size: 16px;
        line-height: 32px;
    }
    .mb10:last-child {
        margin-bottom: 0;
    }
}
.tools_icon {
    // margin-left: 10px;
    height: 32px;
    .iconfont {
        font-size: 20px;
        line-height: 30px;
        cursor: pointer;
    }
}
.mb10 {
    margin-bottom: 10px;
}
.ml10 {
    margin-left: 10px;
}
.mr10 {
    margin-right: 10px;
}
</style>
