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
                <a-button type="primary" style="vertical-align: baseline;" @click="search()">
                  <span class="iconfont">&#xe607;</span>
                  <label class="btn_text"> 查询</label>
                </a-button>
              </a-form-item>
            </a-form>
        </a-card>
        <div style="padding:0 24px;">
          <a-table ref="table" size="middle"  :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false"
            :pagination="pagination" @change="change">
            <div slot="name" slot-scope="text">
               <div class="nameBox">
                 <div class="nameBox-value" :title="text">{{text}}</div>
               </div>
            </div>
          </a-table>

        </div>
        
      </div>
    </div>
   
  </div>
</template>

<script>
 import * as API from '@/api/data'
  export default {
    name: 'SystemLog',
    data() {
      return {
        // 表头
        columns: [{
            title: '操作用户',
            dataIndex: 'username',
            
          },
          {
            title: '操作描述',
            dataIndex: 'operation',
           
          },
          {
            title: '耗时',
            dataIndex: 'time',
            
          },
          {
            title: '执行方法',
            dataIndex: 'method',
            width:'200',
            scopedSlots: {
                customRender: 'name',
            },
          },
          {
            title: '方法参数',
            dataIndex: 'params',
            width:'200',
            scopedSlots: {
                customRender: 'name',
            },
          },
          {
            title: 'IP地址',
            dataIndex: 'ip',
            
          },
          {
            title: '操作地点',
            dataIndex: 'location',
            
          },
          {
            title: '操作时间',
            dataIndex: 'createTime',
            
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
        }
      }
    },
    mounted() {
      this.search()
    },
    methods: {
      search(){
        this.pagination.current = 1
        this.getList()
      },
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
          this.pagination.total = res.value.total
          this.data = res.value.records
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
      }
    }
  }
</script>

<style lang="less" scoped>
  .optionBtns {
    margin-bottom: 10px;
  }

  .ant-form-item-control {
    line-height: 30px;
  }
  .nameBox{
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .nameBox-value{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

</script>

