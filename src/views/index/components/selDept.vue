<template>
    <a-modal title="选择授权机构" :visible="visible" width="40%" style="min-width:500px" @cancel="cancel" destroyOnClose :maskClosable="false" :keyboard="false" centered :bodyStyle="{'height':'500px','overflowY':'auto'}">
        <div class="timeLine">
            <a-table ref="table" size="middle" :columns="columns" :dataSource="tableData" :alert="false" :showSizeChanger="false" :pagination="pagination" @change="change" :rowSelection="interfaceInfo && !interfaceInfo.showBack ? { selectedRowKeys: selectedRowKeys, onSelect: onSelectEvent, onSelectAll: onSelectAllEvent } : null" :rowKey="(record) => record.deptId">
                <div slot="status" slot-scope="text, records">
                    <span class=" color_green" v-if="records.status == 2">已开通</span>
                    <span class="" v-if="!records.status">未授权</span>
                    <span class=" color_orange" v-if="records.status == 1">授权中</span>
                    <span class="" v-if="records.status == 3"><span class="color_red">已拒绝</span>{{'('+records.msg+')'}}</span>
                </div>
                <div slot="tools" slot-scope="text, records">
                    <span class="info_btn color_blue" v-if="!records.status" @click="onAuth(records)">申请授权</span>
                    <span class="info_btn color_blue" v-if="records.status == 3" @click="onReAuth(records)">重新申请授权</span>
                </div>
            </a-table>
        </div>
        <div slot="footer">
            <a-button @click="cancel">关闭</a-button>
            <a-button v-if="interfaceInfo && !interfaceInfo.showBack && $parent.onSelInterface" type="primary" :loading="loading" @click="save">确定授权</a-button>
        </div>
    </a-modal>
</template>

<script>
import { getDeptByClientId, reClient } from '@/api/interface.js'
export default {
    props: {
        visible: {
            default: false
        },
        interfaceInfo: {},
        clientId:{}
    },
    data() {
        return {
            columns: [
                {
                    title: '机构编码',
                    dataIndex: 'deptId',
                    align: 'center'
                },
                {
                    title: '机构名称',
                    dataIndex: 'deptName',
                    align: 'center'
                }
            ],
            tableData: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 10, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
                showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            selectedRowKeys: [], //已选择行id
            loading:false,
        }
    },
    created(){
        if(this.interfaceInfo && this.interfaceInfo.showBack){
            this.columns = [
                ...this.columns,
                {
                    title: '授权状态',
                    dataIndex: '',
                    width: '20%',
                    scopedSlots: {
                        customRender: 'status'
                    }
                },
                {
                    title: '操作',
                    dataIndex: '',
                    scopedSlots: {
                        customRender: 'tools'
                    }
                }
            ]
        }
        this.getDept()
    },
    methods: {
        // table选中单个
        onSelectEvent(record, selected, selectedRows, nativeEvent){
            if(selected){
                // 选中
                this.selectedRowKeys.push(record.deptId)
            }else{
                // 取消
                this.selectedRowKeys = this.selectedRowKeys.filter(item=>item != record.deptId)
            }
        },
        onSelectAllEvent(selected, selectedRows, changeRows){
            if(selected){
                // 选中
                changeRows.forEach(item=>{
                    this.selectedRowKeys.push(item.deptId)
                })
            }else{
                // 取消
                changeRows.forEach(e=>{
                    this.selectedRowKeys = this.selectedRowKeys.filter(item=>item != e.deptId)
                })
            }
        },
        getDept(){
            getDeptByClientId({clientId: this.$parent.clientId || this.clientId}).then(res => {
                this.tableData = res.value
                if(this.interfaceInfo && this.interfaceInfo.showBack) {
                    let deptList = this.interfaceInfo.clientApi.clientApiDept
                    this.tableData = this.tableData.map(item => {
                        let hasData = deptList.filter(e => e.deptId == item.deptId)
                        if(hasData.length){
                            item = { ...item, ...hasData[0] }
                        }
                        return item
                    })
                }
            })
        },
        change(pagination){
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
        },
        save(){
            if(this.selectedRowKeys.length == 0){
                this.$warning({
                      centered: true,
                      title: '警告',
                      content: '授权机构不能为空！',
                      onOk() {},
                  })
                  return
            }
            this.loading = true
            let deptList = this.selectedRowKeys.map(item => {
                return {
                    deptId: item
                }
            })
            this.interfaceInfo['deptList'] = deptList

            this.$emit('clientApiSave', this.interfaceInfo, 'request')
        },
        onAuth(data){
            let deptList = [
                ...this.interfaceInfo.clientApi.clientApiDept,
                { deptId: data.deptId }
            ]
            let saveData = {
                id: this.interfaceInfo.id,
                name: this.interfaceInfo.id,
                clientApi: {
                    clientId: this.interfaceInfo.clientApi.clientId,
                    id: this.interfaceInfo.clientApi.id
                },
                status: this.interfaceInfo.status,
                deptList
            }
            this.$emit('clientApiSave', saveData, 'refresh')
        },
        onReAuth(data){
            reClient({
                deptId: data.deptId,
                id: this.interfaceInfo.clientApi.id
            }).then(res => {
                this.$message.success('重新申请授权成功!');
                this.$parent.search()
                this.$parent.paginations.current = 1
                this.$parent.getClentApiShowList(this.interfaceInfo.clientApi.clientId)
                this.$parent.isShowDept = false
                //   校端授权刷新授权接口列表
                // this.$parent.getClentApiShowList()
            })
        },
        cancel(){
            this.$parent.isShowDept = false
            if(this.clientId) this.$emit('cancel')
        }
    },
}
</script>

<style lang="less" scoped>
.color_orange {
    color: #FFB600;
}
.info_btn {
    cursor: pointer;
}
/deep/.ant-btn-primary{
    background: #1a66ff!important;;
}
</style>