<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">


        <a-card style="border-radius:8px;" :bodyStyle="{padding:'24px'}" :bordered=false>
          <a-form class="searchform">
            <a-form-item :colon='false' class="main_margin_bottom_10">
              <a-input style="width:200px; margin-right: 8px" v-model="keyy" placeholder="请输入键" />
              <a-input style="width:200px; margin-right: 8px" v-model="valuee" placeholder="请输入值" />
              <a-input style="width:200px; margin-right: 8px" v-model="tableName" placeholder="请输入表名" />
              <a-input style="width:200px; margin-right: 8px" v-model="fieldName" placeholder="请输入字段" />
              <a-button type="primary" style="vertical-align: baseline;" @click="getList">
                <span class="iconfont">&#xe607;</span>
                <label class="btn_text"> 查询</label>
              </a-button>
            </a-form-item>

          </a-form>
          <div class="optionBtns">
            <a-button class="add" style="margin-right:20px" v-hasPermission="['dict:add']" @click="add('add')" type="primary"><span class="iconfont">&#xe61a;</span>
              <label class="btn_text">添加</label></a-button>
            <a-button class="edit" style="margin-right:20px" v-hasPermission="['dict:update']" @click="add('edit',selectedRow)" type="primary"  :disabled="disabled"><span class="iconfont font_size_20">&#xe632;</span>
              <label class="btn_text">编辑</label></a-button>
            <a-button class="del" style="margin-right:20px"  v-hasPermission="['dict:delete']" @click="del(selectedRow)" type="primary" :disabled="disabled"><span
                class="iconfont">&#xe619;</span>
              <label class="btn_text">删除</label></a-button>
            <a-button class="assign" style="margin-right:20px" @click="ep" type="primary" v-hasPermission="['dict:export']"><span
                class="iconfont font_size_20">&#xe60f;</span>
              <label class="btn_text" style="margin-left: 0;">导出</label></a-button>   
          </div>
           <a-table ref="table" size="middle" :columns="columns" :dataSource="data" :alert="false" :showSizeChanger="false"
             :pagination="pagination" @change="change" :rowSelection="rowSelection">
            
           </a-table> 
        </a-card>
       <a-modal :title="title" :visible="dictShow" width="960px" style="min-width:500px" @cancel="dictShow = false">
          <a-form :form="form" @submit="saveDict">
            <a-form-item label='id' style="display:none" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
              <a-input v-decorator="['dictId']" />
            </a-form-item>
            <a-form-item label='键' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
              <a-input v-decorator="['keyy',{rules: [{ required: true, message: '请输入键！' }]}]" placeholder="请输入键" />
            </a-form-item>
            <a-form-item label='值' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
              <a-input v-decorator="['valuee',{rules: [{ required: true, message: '请输入值！' }]}]" placeholder="请输入值" />
            </a-form-item>
           <a-form-item label='表名' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
             <a-input v-decorator="['tableName',{rules: [{ required: true, message: '请输入表名！' }]}]" placeholder="请输入表名" />
           </a-form-item>
          <a-form-item label='字段' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
            <a-input v-decorator="['fieldName',{rules: [{ required: true, message: '请输入字段！' }]}]" placeholder="请输入字段" />
          </a-form-item>
          </a-form>
          <div slot="footer">
            <a-button @click="dictShow = false">关闭</a-button>
            <a-button type="primary" :loading="confirmLoading" @click="saveDict">保存</a-button>
          </div>
       </a-modal>
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
    name: 'DataDictionary',
    components: {
      STable
    },
    data() {
      return {
        // 查询参数
        queryParam: {},
        // 表头
        columns: [{
            title: '键',
            dataIndex: 'keyy'
          },
          {
            title: '值',
            dataIndex: 'valuee'
          },
          {
            title: '表名',
            dataIndex: 'tableName'
          },
          {
            title: '字段',
            dataIndex: 'fieldName'
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
        disabled: true,
        data:[],
        pagination: { //分页
          total: 0,
          current: 1,
          pageSize: 10, //每页中显示10条数据
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
          showTotal: total => `共有 ${total} 条数据`, //分页中显示总的数据
        },
        dictShow:false,
        title:'',
        type:'',
        fieldName: '',
        keyy: '',
        valuee: '',
        tableName: '',
      }
    },
    created() {
      this.getList()
     
    },
    mounted(){
    },
    methods: {
      getList(){
        API.getDictList({
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          fieldName: this.fieldName,
          keyy: this.keyy,
          valuee: this.valuee,
          tableName: this.tableName,
        }).then(res=>{
          this.pagination.total = res.total
          this.data = res.rows
        })
      },
      add(obj,data){
        this.form = this.$form.createForm(this)
        this.type = obj
        if (obj == 'add') {
          this.title = '添加字典'
        } else {
          setTimeout(() => {
            this.form.setFieldsValue(data)
          }, 0)
          this.title = '编辑字典'
        }
        this.dictShow = true
      },
      del(data){
        this.$confirm({
          centered: true,
          title: '确认提示',
          content: '您确定要删除选中的数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
             API.delDict(data.dictId).then(res => {
                 this.$success({
                   centered: true,
                   title: '成功',
                   content: '删除成功',
                   onOk() {}
                 })
                 this.disabled = true
                 this.pagination.current = 1;
                 this.getList()
               
             }).catch(err=>{
               console.log('删除失败')
             })
          },
          onCancel:()=>{
            console.log('退出')
          }
        })
        
      },
      //分页切换
      change(pagination) {
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.queryParam.page = pagination.current;
        this.queryParam.size = pagination.pageSize;
        this.getList()
      },
      // 导出
      ep(){
        API.exportDict({
          fieldName: this.fieldName,
          keyy: this.keyy,
          valuee: this.valuee,
          tableName: this.tableName,
        }).then(res=>{
           this.common.dc(res,'数据字典.xlsx')
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
      saveDict(){
        this.form.validateFields(err => {
          if (!err) {
             if (this.type == 'edit') {
               API.editDict(this.form.getFieldsValue()).then(res => {
                 try {
                   this.$success({
                     centered: true,
                     title: '成功',
                     content: '编辑成功',
                     onOk() {}
                   })
                   this.disabled = true
                   this.pagination.current = 1;
                   this.getList()
                 } catch {
                   console.log('编辑失败')
                 }
               })
             } else {
               API.addDict(this.form.getFieldsValue()).then(res => {
                 try {
                   this.$success({
                     centered: true,
                     title: '成功',
                     content: '添加成功',
                     onOk() {}
                   })
                   this.disabled = true
                   this.pagination.current = 1;
                   this.getList()
                 } catch {
                   console.log('添加失败')
                 }
               })
             }
              this.dictShow = false
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
    margin-top: 15px;
    margin-bottom: 10px;
  }

  .ant-form-item-control {
    line-height: 30px;
  }
</style>
