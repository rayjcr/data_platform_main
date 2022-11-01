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
                        <a-button class="add" style="margin-right:20px" type="primary" @click="exit">返回</a-button>
                    </div>
                    <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false" :pagination="pagination" @change="change">
                        <div slot="apiName" slot-scope="text, records">
                            <span class="info_btn" @click="openInfo(records)">{{records.apiName}}</span>
                        </div>
                        <div slot="status" slot-scope="text">
                            <span class="color_green" v-if="text == 2">已授权</span>
                            <span class="color_red" v-if="text == 3">已拒绝</span>
                            <span  v-if="text == 1">未授权</span>
                        </div>
                        <div slot="tools" slot-scope="text, records">
                            <span class="cursor color_blue" v-if="records.status == 1" @click="handleAudit('audit', records)">授权</span>
                            <span class="cursor color_green" v-if="records.status == 2" @click="handleAudit('cancel', records)">取消授权</span>
                            <span class="info_btn ml10" @click="auditlog(records)">审核记录</span>
                        </div>
                    </a-table>
                </a-card>
            </div>
            <template v-else>
                <InterfaceInfo :interfaceData="interfaceInfo" :id="interfaceInfo.apiId"/>
            </template>
        </div>
        <AuditLog :visible="a_vis" :log="log" :info="logInfo" @cancel="a_vis = false"></AuditLog>
        <!-- 审核 -->
        <a-modal title="接口授权" :visible="visible" width="30%" style="min-width:500px" @cancel="cancelModal" destroyOnClose :maskClosable="false" :keyboard="false" centered >
            <a-form>
                <!-- 
                    取消授权时 选通过 不可点击保存
                 -->
                <a-form-item label="授权状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-radio-group v-model="status">
                        <a-radio :value="0">通过</a-radio>
                        <a-radio :value="1">拒绝</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="授权意见" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-textarea v-model="opinion" :maxLength="100" placeholder="请输入授权意见" :rows="6" />
                    <label class="len">
                        还可以输入
                        <span class="color_blue">{{100 - (opinion?opinion.length : 0)}}</span>字
                     </label>
                </a-form-item>
            </a-form>
            <div slot="footer">
                <a-button @click="cancelModal">关闭</a-button>
                <a-button type="primary" class="add" :disabled="getDisabled()" @click="onSave">确定</a-button>
                <!-- <a-button type="primary" @click="onSave('refuse')">拒绝</a-button>
                <a-button type="primary" class="add" :disabled="chooseData&&chooseData.status == '2'"  @click="onSave('pass')">通过</a-button> -->
            </div>
        </a-modal>
    </div>
</template>

<script>
    import * as API from '@/api/interface'
    import InterfaceInfo from './interfaceInfo.vue'
    import AuditLog from './AuditLog.vue'
    export default {
        name: 'auditList',
        props: {
            auditClient: {}
        },
        components: { InterfaceInfo,AuditLog },
        data() {
            return {
                // 表头
                columns: [
                    {
                        title: '接口名称',
                        dataIndex: 'apiName',
                        scopedSlots: {
                            customRender: 'apiName'
                        }
                    },
                    {
                        title: '申请时间',
                        dataIndex: 'ftime',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: {
                            customRender: 'status'
                        }
                    },
                    {
                        title: '操作',
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
                showInfo: false,
                interfaceInfo: {},
                opinion: null,
                visible: false,
                chooseData: null,
                log:[],
                a_vis:false,
                logInfo:{},
                status:0
            }
        },
        created() {
            this.getList()
        },
        methods: {
            async auditlog(data){
                await this.apiAuditLog(data.id)
                this.logInfo = data
                this.a_vis = true
            },
            async apiAuditLog(clientApiId){
                let res = await API.apiAuditLog({clientApiId})
                this.log = res.value    
            },
            getList(page){
                API.clientApiList({
                    clientId: this.auditClient.clientId,
                    apiName: this.name,
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
            openInfo(data){
                this.interfaceInfo = data
                this.showInfo = true
            },
            handleAudit(type, data){
                this.chooseData = data
                this.visible = true
                console.log(this.status,22)
            },
            onSave(){
                let type = ''
                if(this.status === 0) type = 'pass' 
                if(this.status == 1) type = 'refuse' 
                if(type == 'refuse' && !this.opinion){
                    this.$info({
                        centered: true,
                        title: '提示',
                        content: '授权意见不能为空！',
                        onOk() {},
                    })
                    return
                }
                let reqMethod = type == 'refuse' ? API.clientApiAuditNo : API.clientApiAuditOk
                reqMethod({
                    id: this.chooseData.id,
                    comment: this.opinion,
                    // status: type == 'pass' ? 2 : 3
                }).then((res) => {
                    this.visible = false
                    this.$success({
                        centered: true,
                        title: '成功',
                        content: type == 'pass' ? '接口审核已通过' : '接口审核已拒绝',
                        onOk() {},
                    })
                    this.getList()
                    this.opinion = null
                    this.status = 0
                })
            },
            exit(){
                this.$emit('exit')
            },
            cancelModal(){
                this.opinion = null
                this.status = 0
                this.chooseData = null
                this.visible = false
            },
            getDisabled(){
                // status 1 未授权 2 已授权 3 已拒绝
                if(this.chooseData){
                    let {status} = this.chooseData
                    if(status == 2 && this.status == 0) return true
                    else return false
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
    // border-bottom: 1px solid #189dff;
    cursor: pointer;
}
.cursor {
    cursor: pointer;
}
.color_green {
    color: #00ff00;
}
.color_red {
    color: #ff0000;
}
</style>
