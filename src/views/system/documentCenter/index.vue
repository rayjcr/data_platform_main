<template>
    <div class="notification">
        <div class="wrap">
            <div class="main_content">
                <a-card style="border-radius:2px;" :bodyStyle="{padding:'24px 24px 5px 24px'}" :bordered="false" v-if="!visible">
                    <a-form class="searchform">
                        <a-form-item :colon="false" class="main_margin_bottom_15">
                            <a-input style="width:250px; margin-right: 10px" allowClear v-model="searchValue" placeholder="请输入文档名称" />
                            <a-select style="width: 250px;margin-right: 10px;" allowClear placeholder="请选择状态" v-model="status">
                                <a-select-option :key="1" :value="1">已发布</a-select-option>
                                <a-select-option :key="0" :value="0">未发布</a-select-option>
                            </a-select>
                            <a-button type="primary" style="vertical-align: baseline;" @click="init">
                                <span class="iconfont">&#xe607;</span>
                                <label class="btn_text">查询</label>
                            </a-button>
                        </a-form-item>
                    </a-form>
                    <div class="optionBtns main_margin_bottom_10">
                        <a-button class="add" style="margin-right:20px" type="primary" @click="add('add')">
                            <span class="iconfont">&#xe61a;</span>
                            <label class="btn_text">添加</label>
                        </a-button>
                        <a-button class="edit" style="margin-right:20px" type="primary" :disabled="disabled" @click="add('edit',selectedRow)">
                            <span class="iconfont font_size_20">&#xe632;</span>
                            <label class="btn_text">编辑</label>
                        </a-button>
                        <a-button class="del" style="margin-right:20px" type="primary" :disabled="disabled" @click="del(selectedRow)">
                            <span class="iconfont">&#xe619;</span>
                            <label class="btn_text">删除</label>
                        </a-button>
                        <a-button class="add" style="margin-right:20px" type="primary" :disabled=" (selectedRow && selectedRow.status == 1)? true:disabled" @click="send(1,selectedRow)">
                            <span class="iconfont">&#xe6c4;</span>
                            <label class="btn_text">发布</label>
                        </a-button>
                        <a-button class="add" style="margin-right:20px" type="primary" :disabled=" (selectedRow && selectedRow.status != 1)? true:disabled" @click="send(0,selectedRow)">
                            <span class="iconfont">&#xe656;</span>
                            <label class="btn_text">取消发布</label>
                        </a-button>
                    </div>
                    <a-table
                        ref="table"
                        size="middle"
                        :columns="columns"
                        :dataSource="data"
                        :alert="false"
                        :showSizeChanger="false"
                        :pagination="pagination"
                        @change="change"
                        :rowSelection="rowSelection"
                    >
                        <div slot="status" slot-scope="text">
                            <span :class="text == 1?'color_blue':''">{{text==1?'已发布':'未发布'}}</span>
                        </div>
                        <div slot="omit" slot-scope="text">
                            <div class="omitBox">
                                <div class="omitBox-item">{{text}}</div>
                            </div>
                        </div>
                        
                    </a-table>
                </a-card>
                 <!-- 新增编辑 -->
                <add ref="add" v-else :info="info" :type="type" @exit="exit" @save="save"></add>
            </div>
            
        </div>
       
    </div>
</template>
<script>
import add from './components/add.vue'
import { getDocumentCenterlist,saveDocumentCenter,delDocumentCenter,updateStatus} from '@/api/documentCenter.js'
export default {
    // 文档管理
    name:'documentCenter',
    components:{
        add
    },
    data(){
        return{
            searchValue:null,
            disabled:true,
            status:undefined,
            // 列表
            columns:[
                {
                    title: '序号',
                    dataIndex: 'xh',
                    customRender: (text, record, index) =>
						`${(this.pagination.current - 1) * this.pagination.pageSize + index +1}`,
                },
                {
                    title: '文档名称',
                    dataIndex: 'title',
                     width:'150',
                    scopedSlots: {
						customRender: "omit",
					},
                },
                {
                    title: '文档一级分类',
                    dataIndex: 'firstName',
                },
                {
                    title: '文档二级分类',
                    dataIndex: 'secondName',
                },
                {
                    title: '发布时间',
                    dataIndex: 'createTime',
                },
                {
                    title: '发布人',
                    dataIndex: 'username',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: {
						customRender: "status",
					},
                }
            ],
            data:[],
            pagination: {
                //分页
                total: 0,
                current: 1,
                pageSize: 10, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            selectedRowKeys:[],
            selectedRow:{},
            // 新增编辑
            visible:false,
            info:{},
            type:''
        }
    },
    mounted(){
        this.init()
    },
    methods:{
        search(){
            this.pagination.current = 1
            this.getList()
        },
        init() {
            this.selectedRowKeys = []
            this.disabled = true
            this.selectedRow = {}
            this.search()
        },
        async getList(){
            let res = await getDocumentCenterlist({
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize,
                status: this.status,
                title: this.searchValue,
            })
            this.data = res.value.records
            this.pagination.total = res.value.total
        },
        add(type,item){
            this.type = type
            if(type == 'edit'){
                this.info = item
            }
            this.visible = true
        },
        //分页切换
        change(pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.getList()
        },
        // 退出
        exit(){
            this.visible = false
        },
        // 保存
        async save(data){
            let res = await saveDocumentCenter(data)
            if (res.resultCode == 200) {
                this.$success({
                    centered: true,
                    title: '成功',
                    content: '保存成功!',
                    onOk() {}
                })
                this.$refs.add.init()
                this.visible = false
                this.init()
            }
            
        },
        // 删除
        async del(data) {
            this.$confirm({
                centered: true,
                title: '确认提示',
                content: '您确定要删除选中的数据吗?',
                okText: '确认',
                cancelText: '取消',
                onOk: async() => {
                    let res = await delDocumentCenter({id: data.id})
                    if (res.resultCode == 200) {
                        this.$success({
                            centered: true,
                            title: '成功',
                            content: '删除成功！',
                            onOk() {}
                        })
                    } else if (res.resultCode == 500) {
                        this.$error({
                            centered: true,
                            title: '失败',
                            content: '删除失败！',
                            onOk() {}
                        })
                    }
                    this.init()
                },
                onCancel: () => {
                    console.log('退出')
                }
            })
        },
        // 发布取消发布
       async send(type,item){
            this.$confirm({
                centered: true,
                title: '确认提示',
                content: '您确定要' + (type == 0 ? '取消发布' : '发布' ) + '选中的文档吗?',
                okText: '确认',
                cancelText: '取消',
                onOk: async() => {
                    let res = await updateStatus({id: item.id,status: type})
                    if (res.resultCode == 200) {
                        this.$success({
                            centered: true,
                            title: '成功',
                            content: (type == 0 ? '取消发布' : '发布' ) + '成功！',
                            onOk() {}
                        })
                        this.init()
                    }
                    
                },
                onCancel: () => {
                    console.log('退出')
                }
            })
        }
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
    },
}
</script>
<style lang="less" scoped>
    .notification{
        padding: 0 15px;
        height: 100%;
        .wrap{
            height: 100%;
            width: 100%;
            position: relative;
            .main_content{
                width: 100%;
                position: absolute;
                left: 0;
                top: 15px;
                bottom: 34px;
                right: 0;
                background: #fff;
                border-radius: 2px;
                overflow-y: auto;
                overflow-x: hidden;
                .omitBox-item{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
</style>