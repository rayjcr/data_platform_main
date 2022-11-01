<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px'}" :bordered=false>
          <div class="main_margin_bottom_10">
            <a-input style="width:200px;margin-right: 8px" placeholder="请输入名称" v-model="deptName"/>
            <a-range-picker showTime :placeholder="['请选择开始时间', '请选择结束时间']" format="YYYY-MM-DD HH:mm:ss" style="margin-right: 8px" v-model="time" @change="rangeTime">
                  <template slot="renderExtraFooter">
                   选择日期时间
                  </template>
                </a-range-picker>
            <a-button type="primary" style="vertical-align: baseline;" @click="getList">
              <span class="iconfont">&#xe607;</span>
              <label class="btn_text"> 查询</label>
            </a-button>
          </div>
        
          <div class="optionBtns">
            <a-button class="add" v-hasPermission="['dept:add']" style="margin-right:20px" type="primary" @click="add('add')"><span
                class="iconfont">&#xe61a;</span>
              <label class="btn_text">添加</label></a-button>
            <a-button class="edit" v-hasPermission="['dept:update']" style="margin-right:20px" type="primary" @click="add('edit',selectedRow)" :disabled="disabled"><span
                class="iconfont font_size_20">&#xe632;</span>
              <label class="btn_text">编辑</label></a-button>
            <a-button class="del" v-hasPermission="['dept:delete']" style="margin-right:20px" type="primary" :disabled="disabled" @click="del(selectedRow)"><span class="iconfont">&#xe619;</span>
              <label class="btn_text">删除</label></a-button>
              <a-button class="assign" style="margin-right:20px" @click="ep" type="primary" v-hasPermission="['dept:export']"><span
                  class="iconfont font_size_20">&#xe60f;</span>
                <label class="btn_text" style="margin-left: 0;">导出</label></a-button>
          </div>
          <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false"
             :rowSelection="rowSelection">
             </a-table>
        </a-card>
        <dept-tree :deptEditVisiable="deptEditVisiable" @saveDept = "saveDept" @exit="exit" :type="type" :deptInfoData = "deptInfoData"></dept-tree>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import * as API from '@/api/data'
  import deptTree from './deptTree.vue'
  export default{
    components:{
      deptTree
    },
    data(){
      return{
        deptName:'',
        createTimeFrom:'',
        createTimeTo:'',
        time:[],
        disabled:true,
        columns:[{
          title: '名称',
          dataIndex: 'title'
        },{
          title: '排序',
          dataIndex: 'order'
        },{
          title: '创建时间',
          dataIndex: 'createTime'
        },{
          title: '修改时间',
          dataIndex: 'modifyTime'
        }],
        data:[],
        type:'',
        isFirstMenu:false,
        deptEditVisiable:false,
        deptInfoData:{},
        selectedRow: [], //选中的行
        selectedRowKeys: [],
      }
    },
    mounted() {
      this.getList()
    },
    methods:{
      getList(){
        API.deptList({
          deptName:this.deptName,
          createTimeFrom:this.createTimeFrom,
          createTimeTo:this.createTimeTo
        }).then(res=>{
          this.data = res.rows.children
        })
      },
      // 导出
      ep(){
        API.exportDept({
         deptName: this.deptName,
         createTimeFrom: this.createTimeFrom,
         createTimeTo: this.createTimeTo,
        }).then(res=>{
           this.common.dc(res,'部门.xlsx')
        }).catch((r) => {
          console.error(r)
          this.$error({
            centered: true,
            title: '失败',
            content: '导出失败',
            onOk() {}
          })
        })
         
      },
      // 删除
      del(data){
        this.$confirm({
          centered: true,
          title: '您确定要删除选中的数据吗?',
          content: '当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            API.delDept(data.id).then(res => {
              this.$success({
                centered: true,
                title: '成功',
                content: '删除成功',
                onOk() {}
              })
              this.disabled = true
              this.getList()
            }).catch(err=>{
              console.log(err)
               console.log('删除失败')
             })
          },
          onCancel:()=>{
            console.log('退出')
          }
        })
      },
      //日期时间监听事件
      rangeTime(data, dateStrings) {
        this.createTimeFrom = dateStrings[0]
        this.createTimeTo = dateStrings[1]
      },
      add(obj, data) {
        this.type = obj
        if (obj == 'edit') {
            this.deptInfoData = data
        }
        this.deptEditVisiable = true
      },
      saveDept(data){
        this.deptEditVisiable = false
        this.disabled = true
        this.getList()
      },
      exit(){
        this.deptEditVisiable = false
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
            // 单选
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
    }
  }
</script>

<style scoped="scoped">
  .optionBtns {
    margin-top: 15px;
    margin-bottom: 10px;
  }
</style>
