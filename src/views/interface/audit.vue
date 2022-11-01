<template>
    <div class="main">
        <div class="wrap">
            <div class="main_content" v-if="!showInfo">
                <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px'}" :bordered=false>
                    <div class="main_margin_bottom_10">
                        <a-input style="width:200px; margin-right: 10px" v-model="name" placeholder="请输入应用名称" />
                        <a-button type="primary" style="vertical-align: baseline;" @click="search">
                            <span class="iconfont">&#xe607;</span>
                            <label class="btn_text"> 查询</label>
                        </a-button>
                    </div>
                    <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false" :pagination="pagination" @change="change">
                        <div slot="status" slot-scope="text, records">
                            <span class="info_btn" @click="openInfo(records)">接口授权</span>
                            <span class="num" v-if="records.num">{{records.num}}</span>
                        </div>
                    </a-table>
                </a-card>
            </div>
            <template v-else>
                <AuditList :auditClient="auditClient" @exit="exit"/>
            </template>
        </div>
    </div>
</template>

<script>
    import * as API from '@/api/interface'
    import AuditList from './auditList.vue'
    export default {
        name: 'audit',
        components: { AuditList },
        data() {
            return {
                // 表头
                columns: [
                    {
                        title: '应用名称',
                        dataIndex: 'clientName',
                        key: 'clientName'
                    },
                    {
                        title: '组织机构',
                        dataIndex: 'company',
                    },
                    {
                        title: '接入方式',
                        dataIndex: 'joinType',
                        customRender: (text,records,index) => 
                        `${records.joinType == 1 ? 'CAS Client' : 'OAuth2.0'}`
                    },
                    {
                        title: '操作',
                        dataIndex: 'status',
                        scopedSlots: {
                            customRender: 'status'
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
                auditClient: {}
            }
        },
        created() {
            this.search()
        },
        methods: {
            search(){
                this.pagination.current = 1
                this.getList()
            },
            getList(){
                API.clientList({
                    clientName: this.name,
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
            openInfo(data){
                this.auditClient = data
                this.showInfo = true
            },
            exit(){
                this.showInfo = false
                this.search()
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
.num {
    min-width: 16px;
    height: 16px;
    padding: 2px;
    border-radius: 16px;
    color: #ffffff;
    background-color: #ff0000;
    display: inline-block;
    font-size: 12px;
    text-align: center;
    line-height: 12px;
    margin-left: 10px;
}
.color_green {
    color: #00ff00;
}
.color_red {
    color: #ff0000;
}
</style>
