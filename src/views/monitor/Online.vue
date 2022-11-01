<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <a-card style="border-radius:2px;" :bodyStyle="{padding:'24px 24px 5px 24px'}" :bordered=false>
          <a-form class="searchform">
            <a-form-item :colon='false' class="main_margin_bottom_15">
              <a-input style="width:250px; margin-right: 10px" v-model="yhm" placeholder="请输入用户名" />
              <a-button type="primary" style="vertical-align: baseline;" @click="getList(1)">
                <span class="iconfont">&#xe607;</span>
                <label class="btn_text"> 查询</label>
              </a-button>
            </a-form-item>
          </a-form>
          
          <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false" :pagination="pagination" @change="change">
          </a-table>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
  import * as API from '@/api/data'
  export default {
    name: 'onlineUser',
    data() {
      return {
        // 表头
        columns: [{
            title: '用户名',
            dataIndex: 'username'
          },
          {
            title: '姓名',
            dataIndex: 'nickname'
          },
          {
            title: '登录时间',
            dataIndex: 'loginTime'
          },
          {
            title: '登录IP',
            dataIndex: 'ip'
          }
        ],
        pagination: { //分页
          total: 0,
          current: 1,
          pageSize: 10, //每页中显示10条数据
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
          showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        },
        yhm:'',
        data:[],
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList(page) {
        API.loginLis({
          username: this.yhm,
          pageNum: page ? page : this.pagination.current,
          pageSize: this.pagination.pageSize,
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
      }
    }
  }
</script>

<style scoped="scoped">
  .cz_box span{
    color: red;
  }
  .current_status{
    font-size: 12px;
    padding: 2px 5px;
    border: 1px solid;
    border-radius: 2px;
    margin-left: 10px;
  }
</style>
