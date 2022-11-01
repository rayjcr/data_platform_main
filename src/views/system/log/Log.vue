<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px 24px 0 24px'}" :bordered=false>
          <a-form class="searchform">
              <a-form-item :colon='false' class="main_margin_bottom_10">
                <a-input style="width:200px; margin-right: 8px" placeholder="请输入操作人" v-model="username"/>
                <a-input style="width:200px; margin-right: 8px" placeholder="请输入操作描述" v-model="operation"/>
                <a-input style="width:200px; margin-right: 8px" placeholder="请输入操作地点" v-model="location"/>
                <a-range-picker showTime :placeholder="['请选择开始时间', '请选择结束时间']" format="YYYY-MM-DD HH:mm:ss" style="margin-right: 10px"
                   @change="rangeTime">
                  <template slot="renderExtraFooter">
                    选择日期时间
                  </template>
                </a-range-picker>
                <a-button type="primary" style="vertical-align: baseline;" @click="getList">
                  <span class="iconfont">&#xe607;</span>
                  <label class="btn_text"> 查询</label>
                </a-button>
              </a-form-item>
            </a-form>
        </a-card>
        <div style="padding:0 24px;">
          <div class="optionBtns">
            <a-button style="margin-right:20px" @click="del(selectedRow)" :disabled="disabled" class="del" type="primary"><span
                  class="iconfont">&#xe619;</span>
              <label class="btn_text">删除</label></a-button>
              <!-- v-hasPermission="['log:export']"  -->
            <a-button class="assign" style="margin-right:20px" @click="ep" type="primary"><span
                class="iconfont font_size_20">&#xe60f;</span>
              <label class="btn_text" style="margin-left: 0;">导出</label></a-button> 
          </div>
          <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false"
            :pagination="pagination" @change="change" :rowSelection="rowSelection">
              
          </a-table>
        
        </div>
        
      </div>
    </div>
   
  </div>
</template>

<script>
 import * as API from '@/api/data'
  import {
    STable
  } from '@/components'
  export default {
    name: 'SystemLog',
    components: {
      STable
    },
    data() {
      return {
        // 表头
        columns: [{
            title: '操作用户',
            dataIndex: 'username'
          },
        //   {
        //     title: '操作姓名',
        //     dataIndex: 'xm'
        //   },
          {
            title: '操作描述',
            dataIndex: 'operation'
          },
          {
            title: '耗时',
            dataIndex: 'time'
          },
          // {
          //   title: '执行方法',
          //   dataIndex: '',
          //   scopedSlots: {
          //       customRender: 'method'
          //   },
          // },
          // {
          //   title: '方法参数',
          //   dataIndex: '',
          //   scopedSlots: {
          //       customRender: 'params'
          //   }
          // },
          {
            title: 'IP地址',
            dataIndex: 'ip'
          },
          {
            title: '操作地点',
            dataIndex: 'location'
          },
          {
            title: '操作时间',
            dataIndex: 'createTime'
          }
        ],
        disabled: true,
        createTimeFrom:null,
        createTimeTo:null,
        username: '',
        operation: '',
        location: '',
        data:[],
        pagination: { //分页
          total: 0,
          current: 1,
          pageSize: 10, //每页中显示10条数据
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
          showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        },
        selectedRowKeys:'',
        selectedRow:{}
        
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        API.logList({
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          username: this.username,
          operation: this.operation,
          location: this.location,
          createTimeFrom: this.createTimeFrom,
          createTimeTo: this.createTimeTo
        }).then(res => {
          this.pagination.total = res.total
          this.data = res.rows
        })
      },
      //分页切换
      change(pagination) {
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getList()
      },
      //日期时间监听事件
      rangeTime(data, dateStrings) {
        this.createTimeFrom = dateStrings[0]
        this.createTimeTo = dateStrings[1]
      },
      // 导出
      ep(){
        API.exportLog({
         username: this.username,
         operation: this.operation,
         location: this.location,
         createTimeFrom: this.createTimeFrom,
         createTimeTo: this.createTimeTo
        }).then(res=>{
           this.common.dc(res,'系统日志.xlsx')
        }).catch((r) => {
          this.$error({
            centered: true,
            title: '失败',
            content: '导出失败',
            onOk() {}
          })
        })
         
      },
      del(data){
        this.$confirm({
          centered: true,
          title: '确认提示',
          content: '您确定要删除选中的数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            API.delLog(data.id).then(res=>{
              this.$success({
                centered: true,
                title: '成功',
                content: '删除成功',
                onOk() {}
              })
              this.disabled = true
              this.pagination.current = 1;
              this.getList()
            })
          },
          onCancel:()=>{
            console.log('退出')
          }
        })
        
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
    }
  }
</script>

<style lang="less" scoped>
  @import '~ant-design-vue/lib/style/themes/default.less';

  .optionBtns {
    margin-bottom: 10px;
  }

  .ant-form-item-control {
    line-height: 30px;
  }
</style>

</script>

