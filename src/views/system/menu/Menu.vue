<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px'}" :bordered="false">
          <div class="main_margin_bottom_10">
            <a-input
              style="width:200px;margin-right: 8px"
              placeholder="请输入菜单名称"
              v-model="menuName"
            />
            <a-button type="primary" style="vertical-align: baseline;" @click="getList">
              <span class="iconfont">&#xe607;</span>
              <label class="btn_text">查询</label>
            </a-button>
          </div>

          <div class="optionBtns">
            <a-button class="add" style="margin-right:20px" type="primary" @click="addMenu">
              <span class="iconfont">&#xe61a;</span>
              <label class="btn_text">新增</label>
            </a-button>
            <a-button
              class="edit"
              style="margin-right:20px"
              type="primary"
              @click="add('edit',selectedRow)"
              :disabled="disabled"
            >
              <span class="iconfont font_size_20">&#xe632;</span>
              <label class="btn_text">编辑</label>
            </a-button>
            <a-button
              class="del"
              style="margin-right:20px"
              type="primary"
              :disabled="disabled"
              @click="del(selectedRow)"
            >
              <span class="iconfont">&#xe619;</span>
              <label class="btn_text">删除</label>
            </a-button>
          </div>
          <a-table
            ref="table"
            size="middle"
            :columns="columns"
            :dataSource="data"
            :alert="false"
            :showSizeChanger="false"
            :rowSelection="rowSelection"
          >
            <div slot="lx" slot-scope="text,record,index" class="cz_box">
              <label
                class="current_status"
                :class="[text.type == '0'?'bg_basic_blue color_blue border_color_blue':'bg_basic_pink color_pink border_color_pink']"
                v-html="text.type=='0'?'菜单':'按钮'"
              ></label>
            </div>
            <template v-if="text" slot="icon" slot-scope="text">
              <a-icon :type="text.icon" class="font_size_20 color_blue" />
            </template>
          </a-table>
        </a-card>
        <menu-add
          :type="type"
          :isFirstMenu="isFirstMenu"
          @handleCancel="handleCancel"
          @suc="submit"
          :menuData="menuData"
          :menuEditVisiable="menuEditVisiable"
        ></menu-add>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import menuAdd from './menuAdd.vue'
import * as API from '@/api/data'

export default {
    components: {
        menuAdd,
    },
    data() {
        return {
            columns: [
                {
                    title: '排序',
                    dataIndex: 'order',
                },
                {
                    title: '名称',
                    dataIndex: 'title',
                },
                {
                    title: '图标',
                    dataIndex: '',
                    scopedSlots: {
                        customRender: 'icon',
                    },
                },
                {
                    title: '类型',
                    dataIndex: '',
                    scopedSlots: {
                        customRender: 'lx',
                    },
                },
                {
                    title: '地址',
                    dataIndex: 'path',
                }
            ],
            sjyType: '',
            disabled: true,
            confirmLoading: false,
            visible: false,
            form: this.$form.createForm(this),
            title: '添加菜单',
            selectedRow: [], //选中的行
            selectedRowKeys: [],
            isFirstMenu: true,

            // 树
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            data: [],
            // 选择=图标组件显隐
            iconShow: false,
            type_list: [
                {
                    bg: '#40a9ff',
                    color: '#fff',
                    value: '全部',
                    id: '0',
                },
                {
                    bg: '',
                    color: '#999',
                    value: '线性',
                    id: '1',
                },
                {
                    bg: '',
                    value: '扁平',
                    color: '#999',
                    id: '2',
                },
            ], //图标分类
            chooseIcon: '', //选中的图标值
            total: 50, //菜单图标个数
            time: [], //开始时间结束时间
            // pagination: { //分页
            //   total: 0,
            //   current: 1,
            //   pageSize: 10, //每页中显示10条数据
            //   showSizeChanger: true,
            //   pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
            //   showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
            // },
            menuName: '',
            treeData: [],
            defaultCheckedKeys: [],
            menuTreeKey: +new Date(),
            type: '',
            menuData: {},
            menuEditVisiable: false,
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            API.getMenuList({
                menuName: this.menuName,
            })
                .then((res) => {
                    // this.pagination.total = res.total
                    this.data = res.rows.children
                })
                .catch((err) => {})
        },
        handleCancel() {
            this.menuEditVisiable = false
            this.menuTreeKey = +new Date()
            this.defaultCheckedKeys = []
            this.expandedKeys = []
            this.checkedKeys = []
            this.form.resetFields()
        },
        submit() {
            this.form.resetFields()
            this.menuEditVisiable = false
            this.disabled = true
            this.getList()
        },
        // 删除
        del(data) {
            this.$confirm({
                centered: true,
                title: '您确定要删除选中的数据吗?',
                content: '当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    API.delMenu({menuIds: data.id})
                        .then((res) => {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: '删除成功',
                                onOk() {},
                            })
                            this.disabled = true
                            this.getList()
                        })
                        .catch((err) => {
                            console.log(err)
                            console.log('删除失败')
                        })
                },
                onCancel: () => {
                    console.log('退出')
                },
            })
        },
        add(obj, data) {
            console.log(obj)
            this.type = obj
            if (data.type == '0' || data == '0') {
                this.isFirstMenu = true
            } else {
                this.isFirstMenu = false
            }
            if (obj == 'edit') {
                this.menuData = data
                setTimeout(() => {
                    this.form.setFieldsValue(data)
                }, 0)
            }
            this.menuEditVisiable = true
        },

        //分页切换
        change(pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.getList()
        },
        // 判断添加类型
        addMenu() {
            this.add('add', '0')
        },
        addBtn() {
            this.add('add', '1')
        },
        // 退出选择菜单图标
        saveIcon() {
            this.form.setFieldsValue({
                cdtb: this.chooseIcon,
            })

            this.iconShow = false
        },
        //图标选中事件
        getIconId(index) {
            this.activeIndex = icon
            this.choosedIcon = icon
            this.$message.success(`选中 ${icon}`)
        },
        //类型选中事件
        getTypeId(index) {
            for (var i = 0; i < this.type_list.length; i++) {
                this.type_list[i].bg = '#fff'
                this.type_list[i].color = '#999'
            }
            this.type_list[index].bg = '#40a9ff'
            this.type_list[index].color = '#fff'
        },
        // 菜单图标列表分页
        change(current) {
            this.getIconList(current)
        },
        // 获取菜单图标列表
        getIconList(num) {
            console.log(num)
        },
    },
    computed: {
        rowSelection() {
            const { selectedRowKeys } = this
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
                getCheckboxProps: (record) => ({
                    props: {
                        disabled: record.name === 'Disabled User', // Column configuration not to be checked
                        name: record.name,
                    },
                }),
            }
        },
    },
}
</script>
<style scoped="scoped">
.optionBtns {
    margin-top: 15px;
    margin-bottom: 10px;
}
.pop_icon {
    font-size: 30px;
}
.icon_list_item {
    overflow: hidden;
}
.icon_list .icon_list_item .icon_list_item_li span {
    font-size: 45px;
}
.icon_list .icon_list_item .icon_list_item_li:hover span {
    color: #40a9ff !important;
}
.icon_list_item_li {
    float: left;
    margin: 15px 13px;
    padding: 0 10px;
    cursor: pointer;
}
.icon_list_type_item {
    display: inline-block;
    padding: 0px 10px;
    line-height: 30px;
    border-radius: 4px;
    cursor: pointer;
}
.current_status {
    font-size: 12px;
    padding: 2px 5px;
    border: 1px solid;
    border-radius: 2px;
}
</style>
