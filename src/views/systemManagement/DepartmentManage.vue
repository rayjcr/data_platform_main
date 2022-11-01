<template>
  <div>
    <a-card
      style="border-radius:8px;min-height:750px"
      :bordered=false
    >
      <a-form
        layout="inline"
        class="searchform"
      >
        <a-form-item :colon='false'>
          <a-input
          style="width:200px"
            v-model="bmName"
            placeholder="请输入部门名称或部门编码"
          />
        </a-form-item>
        <a-form-item :colon='false'>
          <a-button
            type="primary"
            icon="search"
            @click="$refs.table.refresh()"
          >查询</a-button>
        </a-form-item>
      </a-form>
      <div class="optionBtns">
        <a-button
          style="margin-right:20px"
          type="primary"
          @click="showModal('create')"
        >添加</a-button>
        <a-button
          style="margin-right:20px"
          type="primary"
          @click="showModal('edit')"
        >编辑</a-button>
        <a-button
          style="margin-right:20px"
          type="primary"
          @click="handleDelete"
        >删除</a-button>
      </div>
      <s-table
        ref="table"
        size="middle"
        :columns="columns"
        :data="getList"
        :alert="false"
        :showSizeChanger="false"
        :rowSelection="rowSelection"
      >
      </s-table>
    </a-card>
    <a-modal
      :title="optionType[nowtype]+'部门'"
      :visible="visible"
      width="50%"
      style="min-width:500px"
      @cancel="handleCancel"
      :maskClosable='false'
      :keyboard='false'
      centered
    >
      <a-form
        :form="form"
        @submit="handleOk"
      >
        <a-form-item label='部门id' style="display:none" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['bmid']" />      
        </a-form-item>
        <a-form-item
          label='部门编码'
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input v-decorator="['bmbm',{rules: [{ required: true, message: '请输入部门编码！' }]}]" placeholder="请输入部门编码"/>
        </a-form-item>
        <a-form-item
          label='部门名称'
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input v-decorator="['bmmc',{rules: [{ required: true, message: '请输入部门名称！' }]}]" placeholder="请输入部门名称"/>
        </a-form-item>
        <a-form-item
          label='部门负责人'
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input v-decorator="['bmfzr']" placeholder="请输入部门负责人"/>
        </a-form-item>
        <a-form-item
          label='部门电话'
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input v-decorator="['bmdh',{rules: [{ required: true, message: '请输入部门电话！' },{ pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$|^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$|^0\d{2,3}-?\d{7,8}$/ , message: '部门电话格式错误！' }]}]" placeholder="请输入部门电话"/>
        </a-form-item>
        <a-form-item
          label='部门邮箱'
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input v-decorator="['bmyx',{rules: [{ pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/ , message: '部门邮箱格式错误！' }]}]" placeholder="请输入部门邮箱"/>
        </a-form-item>
        <!-- <a-form-item label='邮编' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['yb']" />
        </a-form-item> -->
        <!-- <a-form-item label='区号' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['qh']" />
        </a-form-item> -->
        <!-- <a-form-item label='传真' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['cz']" />
        </a-form-item> -->
        <!-- <a-form-item label='部门地址' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['bmdz']" />
        </a-form-item> -->
        <!-- <a-form-item label='部门描述' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['bmms']" />
        </a-form-item> -->
        <!-- <a-form-item label='部门顺序' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['bmsx']" />
        </a-form-item> -->
        <!-- <a-form-item label='字母搜索' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['zmss']" />
        </a-form-item> -->
        <a-form-item
          label='是否启用'
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-radio-group v-decorator="['sfzf']">
            <a-radio value='1'>是</a-radio>
            <a-radio value='0'>否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <!-- <a-button type="primary" :loading="confirmLoading" >密码初始化</a-button> -->
        <a-button @click="handleCancel">关闭</a-button>
        <a-button
          type="primary"
          :loading="confirmLoading"
          @click="handleOk"
        >保存</a-button>

      </div>
    </a-modal>
  </div>
</template>

<script>
import * as API from '@/api/data'
import { STable } from '@/components'
export default {
  name: 'DepartmentManage',
  components: {
    STable
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '部门编码',
          dataIndex: 'bmbm'
        },
        {
          title: '部门名称',
          dataIndex: 'bmmc'
        },
        {
          title: '部门电话',
          dataIndex: 'bmdh'
        },
        {
          title: '是否启用',
          dataIndex: 'sfzf',
          customRender: text => {
            if (text == '1') {
              return '是'
            }
            return '否'
          }
        }
      ],
      //弹框
      visible: false,
      //按钮加载flg
      confirmLoading: false,
      //表格对象
      form: {},
      selectedRowKeys: '', //已选择行id
      selectedRow: {}, //已选择行信息
      optionType: {
        create: '添加',
        edit: '编辑'
      },
      nowtype: '',
      bmList: [],
      bmName: '' //数据源名称
    }
  },
  activated() {
    this.getBMList()
    this.$refs.table.refresh();
  },
  methods: {
    //显示弹层
    showModal(type) {
      if (type == 'create') {
        this.nowtype = type
        this.form = this.$form.createForm(this)
        setTimeout(() => {
          this.form.setFieldsValue({ sfzf: '1' }) //启用状态默认启用
        }, 0)
        this.visible = true
      } else {
        if (this.selectedRowKeys == '') {
          this.$info({
            centered: true,
            title: '提示',
            content: '请选择一条记录',
            onOk() {}
          })
          return
        }
        this.nowtype = type
        let data = this.selectedRow
        this.form = this.$form.createForm(this)
        setTimeout(() => {
          this.form.setFieldsValue(data)
        }, 0)
        this.visible = true
      }
    },
    //确认提交
    handleOk(e) {
      this.confirmLoading = true
      this.form
        .validateFields()
        .then(() => {
          //验证
          if (this.nowtype == 'create') {
            API.saveDepartment(this.form.getFieldsValue()).then(res => {
              if (res.code == '200') {
                this.$refs.table.refresh()
                this.visible = false
                this.confirmLoading = false
                //this.$message.success(res.message)
                this.$success({
                  centered: true,
                  title: '成功',
                  content: res.message,
                  onOk() {}
                })
              } else {
                this.confirmLoading = false
                //this.$message.error(res.message)
                this.$error({
                  centered: true,
                  title: '错误',
                  content: res.message,
                  onOk() {}
                })
              }
            })
          } else {
            let param = this.form.getFieldsValue()
            this.$set(param, 'id', this.selectedRow.id)
            API.saveDepartment(param).then(res => {
              if (res.code == '200') {
                this.$refs.table.refresh()
                this.visible = false
                this.confirmLoading = false
                //this.$message.success(res.message)
                this.$success({
                  centered: true,
                  title: '成功',
                  content: res.message,
                  onOk() {}
                })
              } else {
                this.confirmLoading = false
                //this.$message.error(res.message)
                this.$error({
                  centered: true,
                  title: '错误',
                  content: res.message,
                  onOk() {}
                })
              }
            })
          }
        })
        .catch(err => {
          this.confirmLoading = false
        })

      // this.$form.submit();
    },
    //处理删除
    handleDelete(e) {
      if (this.selectedRowKeys == '') {
        this.$info({
          centered: true,
          title: '提示',
          content: '请选择一条记录',
          onOk() {}
        })
        return
      }
      var { selectedRow } = this
      this.$confirm({
        centered: true,
        title: '确认提示',
        content: '您确定要删除选择的记录吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          API.deleteDepartment({ ids: selectedRow.bmid }).then(res => {
            if (res.code == '200') {
              this.$refs.table.refresh() //刷新列表
              this.selectedRow = {}
              this.selectedRowKeys = '' //清空已选择
              //this.$message.success(res.message)   //提示信息
              this.$success({
                centered: true,
                title: '成功',
                content: res.message,
                onOk() {}
              })
            }
          })
        }
      })
    },
    //关闭弹框
    handleCancel(e) {
      this.visible = false
    },
    checkConnect() {
      this.$success({
        centered: true,
        title: '成功',
        content: '数据源连接成功！',
        onOk() {}
      })
    },

    //获取数据源信息
    getList(param) {
      return API.getDepartment(Object.assign(param, { searchValue: this.bmName })).then(res => {
        return res.data
      })
    },
    //获取部门信息供选择
    getBMList() {
      API.searchBmxxPage({ pn: 1 }).then(res => {
        this.bmList = res.data.list
      })
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        columnTitle: ' ',
        onChange: (selectedRowKeys, selectedRows) => {
          //单选
          if (selectedRowKeys.length >= 1) {
            selectedRowKeys = selectedRowKeys.splice(0, 1)
            this.selectedRowKeys = selectedRowKeys
            this.selectedRow = selectedRows[0]
          } else {
            this.selectedRowKeys = ''
            this.selectedRow = {}
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
  margin-top: 40px;
  margin-bottom: 20px;
}
</style>
