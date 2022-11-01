<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <a-card
          style="border-radius:2px;"
          :bodyStyle="{padding:'24px 24px 5px 24px'}"
          :bordered="false"
        >
          <a-form class="searchform">
            <a-form-item :colon="false" class="main_margin_bottom_15">
              <a-input
                style="width:250px; margin-right: 10px"
                placeholder="请输入用户名/姓名"
                v-model="username"
              />
              <a-tree-select v-model="deptId" allowClear style="width: 250px;margin-right: 10px;" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="bmList"
                placeholder="请选择组织架构" treeDefaultExpandAll >
                </a-tree-select>
              <a-button type="primary" style="vertical-align: baseline;" @click="getList(1)">
                <span class="iconfont">&#xe607;</span>
                <label class="btn_text">查询</label>
              </a-button>
            </a-form-item>
          </a-form>
          <div class="optionBtns main_margin_bottom_10">
            <a-button
              class="add"
              style="margin-right:20px"
              :disabled="disabled"
              @click="add(selectedRow)"
              type="primary"
            >
              <span class="iconfont">&#xe61a;</span>
              <label class="btn_text">数据授权</label>
            </a-button>
            <a-button
              style="margin-right:20px"
              @click="del"
              :disabled="disabled"
              class="del"
              type="primary"
            >
              <span class="iconfont">&#xe619;</span>
              <label class="btn_text">清除数据授权</label>
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
            <div slot="xh" slot-scope="text,record,index">
              <span>{{index+1}}</span>
            </div>
            <div slot="ssex" slot-scope="text,record">
              <span v-html="record.ssex == '0'?'男':(text=='1'?'女':'保密')"></span>
            </div>
          </a-table>
        </a-card>
      </div>
    </div>

    <!-- 数据授权 -->
    <data-tree
      ref="roleTree"
      :roleInfoData="roleInfo.data"
      :title="roleTree.title"
      :roleEditVisiable="roleTree.visiable"
      @close="close"
      @success="saveUserDept"
    ></data-tree>
  </div>
</template>

<script>
import * as API from '@/api/data'
import DataTree from './DataTree'
export default {
    name: 'Data',
    components: {
        DataTree,
    },
    data() {
        return {
            bmList: [], // 组织架构
            deptId: undefined,
            username: undefined,
            roleTree: {
                visiable: false,
                title: '数据权限'
            },
            roleInfo: {
                visiable: false,
                data: {},
            },
            // 表头
            columns: [
                {
                    title: '序号',
                    dataIndex: '',
                    scopedSlots: {
                        customRender: 'xh',
                    },
                },
                {
                    title: '用户名',
                    dataIndex: 'username',
                },
                {
                    title: '姓名',
                    dataIndex: 'nickname',
                },
                {
                    title: '角色',
                    dataIndex: 'roleName',
                },
                {
                    title: '性别',
                    dataIndex: '',
                    scopedSlots: {
                        customRender: 'ssex',
                    },
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                },
                {
                    title: '组织机构',
                    dataIndex: 'deptName',
                },
                {
                    title: '电话',
                    dataIndex: 'mobile',
                },
            ],
            disabled: true,
            selectedRowKeys: [],
            selectedRow: {},
            data: [], //列表
            pagination: {
                //分页
                total: 0,
                current: 1,
                pageSize: 10, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            modal_title: '',
            form: this.$form.createForm(this),
        }
    },
    mounted() {
        this.getList()
        // 获取部门列表
        this.getDeptList();
    },
    methods: {
        close() {
            this.roleTree.visiable = false
        },
        getList(page) {
            this.pagination.current = page || this.pagination.current;
            API.getUserPage({
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize,
                username: this.username,
                deptId: this.deptId
            }).then((res) => {
                this.pagination.total = res.total
                this.data = res.rows
            })
        },
        // 获取部门列表
        getDeptList() {
            API.getDeptList().then((res) => {
                for (var i = 0; i < res.rows.children.length; i++) {
                    this.bmList.push(res.rows.children[i])
                }
            })
        },
        // 数据授权
        add(data) {
            if(this.selectedRowKeys.length > 1) {
                this.$error({
                    centered: true,
                    title: '失败',
                    content: '请选择一个用户进行数据授权',
                    onOk() {},
                })
                return;
            }
            this.roleTree.visiable = true;
            this.roleTree.title = (data.nickname || data.username) + '的数据权限'
            this.roleInfo.data = data;
        },
        // 清除数据授权
        del() {
            let userIds = ''
            this.selectedRowKeys.forEach((c,i) => {
                userIds += this.data[c].userId + (this.selectedRowKeys.length - 1 == i ? '' : ',')
            })
            console.log(userIds)
            this.$confirm({
                centered: true,
                title: '确认提示',
                content: '确定要清除所选用户的数据权限吗?',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    API.removeDept({
                        userIds: userIds
                    })
                        .then((res) => {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: '清除成功',
                                onOk() {},
                            })
                            this.init()
                        })
                        .catch((err) => {
                            console.log('清除失败')
                        })
                },
                onCancel: () => {
                    console.log('退出')
                },
            })
        },
        //分页切换
        change(pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.getList()
        },
        saveUserDept() {
            this.roleTree.visiable = false
           this.init()
        },
        init(){
             this.disabled = true
            this.pagination.current = 1
            this.selectedRowKeys.length = 0
            this.selectedRow.length = 0
            this.getList()
        },
        onExpand(expandedKeys) {
            console.log('onExpand', expandedKeys)
            // if not set autoExpandParent to false, if children expanded, parent can not collapse.
            // or, you can remove all expanded children keys.
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        onCheck(checkedKeys, info) {
            console.log('onCheck', checkedKeys)
            this.form.setFieldsValue({
                menuId: checkedKeys,
            })
            // this.checkedKeys = checkedKeys;
        },
        getMenuList() {
            API.getMenuList().then((res) => {
                res.rows.children.forEach((e) => {
                    var Tree = e
                    this.$set(Tree, 'title', Tree.title)
                    this.$set(Tree, 'key', Tree.key)
                    this.$set(Tree, 'value', Tree.id)
                    this.treeData.push(Tree)
                })
            })
        },
    },
    computed: {
        rowSelection() {
            const { selectedRowKeys } = this
            return {
                columnTitle: '',
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRow = selectedRowKeys.length > 0 ? selectedRows[0] : {};
                    this.disabled = selectedRowKeys.length > 0 ? false : true;
                },
                // selectedRowKeys: selectedRowKeys
            }
        },
    },
}
</script>

<style lang="less" scoped>
.optionBtns {
    margin-bottom: 20px;
}

.ant-card-wider-padding .ant-card-body {
    padding: 24px !important;
}
</style>
