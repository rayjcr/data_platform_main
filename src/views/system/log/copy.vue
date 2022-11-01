<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px'}" :bordered="false">
          <div class="main_margin_bottom_10">
            <a-input style="width:200px;margin-right: 8px" placeholder="请输入业务模块名称" />
            <a-input style="width:200px;margin-right: 8px" placeholder="请输入操作用户名" v-model="username" />
            <a-button type="primary" style="vertical-align: baseline;" @click="getList(1)">
              <span class="iconfont">&#xe607;</span>
              <label class="btn_text">查询</label>
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
          >
            <div slot="xh" slot-scope="text,record,index">
                {{index + 1}}
            </div>
          </a-table>
        </a-card>
      </div>
    </div>
  </div>
</template>
<script>
    import Vue from 'vue'
    import * as API from '@/api/data'

    export default {
        data() {
            return {
                columns: [
                    {
                        title: '序号',
                        dataIndex: '',
                        scopedSlots: {
                            customRender: 'xh',
                        },
                    },
                    {
                        title: '业务模块',
                        dataIndex: 'ywmk',
                    },
                    {
                        title: '操作类型',
                        dataIndex: 'type',
                    },
                    {
                        title: '操作用户',
                        dataIndex: 'username',
                    },
                    {
                        title: '操作日期',
                        dataIndex: 'createTime',
                    },
                    {
                        title: 'IP地址',
                        dataIndex: 'ip',
                    },
                    {
                        title: '操作描述',
                        dataIndex: 'operation',
                    },
                ],
                data: [],
                pagination: {
                    //分页
                    total: 0,
                    current: 1,
                    pageSize: 10, //每页中显示10条数据
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
                    showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
                },
                username: undefined
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList(page) {
                this.pagination.current = page || this.pagination.current;
                API.logList({
                    pageNum: this.pagination.current,
                    pageSize: this.pagination.pageSize,
                    username: this.username
                })
                    .then((res) => {
                        this.pagination.total = res.total
                        this.data = res.rows
                    })
                    .catch((err) => {})
            },
            //分页切换
            change(pagination) {
                this.pagination.current = pagination.current
                this.pagination.pageSize = pagination.pageSize
                this.getList()
            },
        }
    }
</script>
<style scoped="scoped">

</style>
