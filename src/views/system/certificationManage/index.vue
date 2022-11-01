<template>
    <div class="main">
        <div class="wrap">
            <div class="main_content">
                <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px 24px 5px 24px'}" :bordered="false">
                    <a-form class="searchform">
                        <a-form-item :colon='false' class="main_margin_bottom_15">
                            <a-input style="width:250px; margin-right: 10px" v-model="searchValue" placeholder="请输入姓名/手机号/公司名称" />
                            <a-select style="width: 250px;margin-right: 10px;" allowClear placeholder="请选择类型" v-model="type">
                                <a-select-option :key="1" :value="1">企业</a-select-option>
                                <a-select-option :key="2" :value="2">个人</a-select-option>
                            </a-select>
                            <a-select style="width: 250px;margin-right: 10px;" allowClear placeholder="请选择审核状态" v-model="status">
                                <a-select-option :key="2" :value="1">通过</a-select-option>
                                <a-select-option :key="1" :value="2">待审核</a-select-option>
                                <a-select-option :key="2" :value="3">拒绝</a-select-option>
                            </a-select>
                            <a-button type="primary" style="vertical-align: baseline;" @click="init">
                                <span class="iconfont">&#xe607;</span>
                                <label class="btn_text"> 查询</label>
                            </a-button>
                        </a-form-item>
                    </a-form>
                    <div class="optionBtns">
                        <!-- 审核中才能审核 -->
                        <a-button class="add" style="margin-right:20px" :disabled="selectedRow&&selectedRow.status != 2?true:disabled" @click="audit(selectedRow)" type="primary">
                            <span class="iconfont">&#xe61a;</span>
                            <label class="btn_text">审核</label>
                        </a-button>
                    </div>
                    <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false"
                        :pagination="pagination" @change="change" :rowSelection="rowSelection">
                        <div slot="status" slot-scope="text,record">
                            <!-- 
                                拒绝 鼠标经过显示拒绝理由
                                通过 不显示理由
                             -->
                            <template v-if="text == 3">
                                <a-popover title="">
                                    <template slot="content" >
                                       <div class="msgBox flex">
                                          <label class="title">拒绝理由：</label>
                                          <label> {{record.msg}}</label>
                                       </div>
                                    </template>
                                    <span class="color_red">拒绝</span>
                                </a-popover>
                            </template>
                            <template v-else>
                                <span :class="text == 1?'color_green':(text==2?'color_blue':(text==3?'color_red':''))">{{text==1?'通过':(text==2?'审核中':(text==3?'拒绝':''))}}</span>
                            </template>
                            
                        </div>
                        <div slot="username" slot-scope="text,record">
                            <span class="color_blue main_cursor_pointer" @click="viewAudit(record)">{{text}}</span>
                        </div>
                    </a-table>

                </a-card>
                
            </div>
        </div>
        <audit v-if="visible" :visible="visible" ref="audit" :info="info" @cancel="cancel" @onSave="save"></audit>
        <viewInfo :visible="v_visible" :info="v_info" @exit="v_visible = false"></viewInfo>
    </div>
</template>
<script>
import {getAuthUserList, auditUser} from '@/api/data.js'
import audit from './audit.vue'
import viewInfo from './view.vue'
export default {
    components:{audit, viewInfo},
    data(){
        return{
            searchValue:null,
            type:undefined,
            status:undefined,
            columns:[
                {
                    title: '用户账号',
                    dataIndex: 'username',
                    scopedSlots: {
						customRender: "username",
					},
                },
                {
                     title: '用户类型',
                    dataIndex: 'userType',
                    customRender: (text, record, index) =>{              //性别 0未知 1男 2女 9未说明',
                        if(record.userType == 1) return '企业'
                        else if(record.userType == 2) return '个人'
                        
                    }
                },
                {
                     title: '公司名称',
                    dataIndex: 'company',
                },
                {
                     title: '姓名/负责人',
                    dataIndex: 'nickname',
                },
                {
                     title: '手机号',
                    dataIndex: 'mobile',
                },
                {
                     title: '邮箱',
                    dataIndex: 'email',
                },
                {
                     title: '审核状态',
                    dataIndex: 'status',
                    scopedSlots: {
						customRender: "status",
					},
                }
            ],
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
            selectedRowKeys:[],
            selectedRow:{},
            visible:false,
            info:{},
            v_visible:false,
            v_info:{}
        }
    },
    computed: {
      rowSelection() {
        const {
          selectedRowKeys
        } = this
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
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name
            }
          })
        }
      }
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
            this.search()
        },
        search(){
            this.pagination.current = 1
            this.getList()
        },
        async getList(){
            let res = await getAuthUserList({
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize,
                userType: this.type,
                search: this.searchValue,
                status: this.status,
            })
            this.pagination.total = res.value.total
            this.data = res.value.records
        },
        //分页切换
        change(pagination) {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            this.getList()
        },
        // 审核
        audit(data){
            this.visible = true
            this.info = data
        },
        cancel(){
            this.visible = false
        },
        async save(item){
            let res = await auditUser({
                userId: this.info.userId,
                status: item.type,
                msg: item.opinion
            })
            // 延迟关闭
              setTimeout(()=>{
                this.$success({
                    centered: true,
                    title: '成功',
                    content: item.type == 1 ? '认证已通过！' : '认证已拒绝！',
                    onOk() {},
                })
                this.$refs.audit.loading = false
                this.$refs.audit.init()
                this.visible = false
                this.init()
               }, 1000);
            
        },
        viewAudit(data){
            this.v_visible = true
            this.v_info = data
        }
    }
}
</script>
<style lang="less" scoped>
.optionBtns{
    margin-bottom: 10px;
}
.msgBox{
    width: 270px;
    .title{
        min-width: 80px;
    }
}
</style>