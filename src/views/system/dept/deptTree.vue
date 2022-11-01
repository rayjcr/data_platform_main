<template>

  <a-modal :title="modal_title" :visible="deptEditVisiable" width="50%" style="min-width:500px" @cancel="exit" destroyOnClose
    :maskClosable='false' :keyboard='false' centered>
    <a-form :form="form" @submit="saveDept">
      <a-form-item label='角色名称' style="display: none;" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="type == 'edit'">
        <a-input v-decorator="['deptId']" placeholder="请输入角色名称" />
      </a-form-item>
      <a-form-item label='部门名称' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-input v-decorator="['deptName',{rules: [{ required: true, message: '请输入部门名称！' }]}]" placeholder="请输入部门名称" />
      </a-form-item>
      <a-form-item label='排序' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-input v-decorator="['orderNum']" placeholder="请输入序号" />
      </a-form-item>
      <a-form-item label='上级部门' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-tree :key="menuTreeKey" checkable :treeData="data" checkStrictly ref="tree" v-decorator="['parentId']"
          @check="onCheck" :expandedKeys="expandedKeys" @expand="onExpand" :defaultCheckedKeys="defaultCheckedKeys" />
      </a-form-item>

    </a-form>
    <div slot="footer">
      <a-button @click="exit">关闭</a-button>
      <a-button type="primary" @click="saveDept">保存</a-button>
    </div>
  </a-modal>
</template>

<script>
   import * as API from '@/api/data'
  export default {
    name: 'deptTree',
    props: {
      deptEditVisiable: {
        default: false
      },
      type: {
        default:String
      },
      deptInfoData: {
        require: true
      }
    },
    data() {
      return {
        treeData: [],
        modal_title: '',
        menuTreeKey: +new Date(),
        defaultCheckedKeys: [],
        form: this.$form.createForm(this),
        allTreeKeys: [],
        expandedKeys:[],
        checkedKeys:[],
        data: [],
      }
    },
    mounted() {
      
    },
    methods: {
      exit() {
        this.menuTreeKey = +new Date()
        this.defaultCheckedKeys = []
        this.expandedKeys = []
        this.checkedKeys = []
        this.treeData = []
        this.form.resetFields()
        this.$emit('exit')
      },
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys);
        this.checkedKeys = checkedKeys.checked
      },
      saveDept() {
        let checkedArr = Object.is(this.checkedKeys.checked, undefined) || Object.is(this.checkedKeys, undefined) ? this.checkedKeys : this.checkedKeys.checked
        if(this.checkedKeys.checked || checkedArr){
           console.log(checkedArr)
          if (checkedArr.length > 1) {
            this.$info({
              centered: true,
              title: '提示',
              content: '最多只能选择一个上级菜单，请修改',
              onOk() {}
            })
            this.checkedKeys = []
            return
          }
        }else{
          checkedArr = []
        }
        const data = this.form.getFieldsValue()
        if (checkedArr.length) {
          data.parentId = checkedArr[0]
        } else {
          data.parentId = '0'
        }
        this.form.validateFields(err => {
          if (!err) {
            if(this.type == 'add'){
                API.addDept(data).then(res=>{
                  this.$emit('saveDept')
                  this.$success({
                    centered: true,
                    title: '成功',
                    content: '添加成功',
                    onOk() {}
                  })
                }).catch(() => {
                  console.log('保存失败')
                })
            }else{
              console.log(data)
              API.updateDept(data).then(res=>{
                this.$emit('saveDept')
                this.$success({
                  centered: true,
                  title: '成功',
                  content: '编辑成功',
                  onOk() {}
                })
              }).catch(() => {
                console.log('编辑失败')
              })
            }
          }
        })
        
      }
    },
    watch: {
      deptEditVisiable() {
        if (this.deptEditVisiable) {
          this.treeData = []
          this.data = []
          this.form.resetFields()
          if (this.type == 'edit') {
            const arr = [];
            arr.push(this.deptInfoData.parentId)
            this.checkedKeys = this.defaultCheckedKeys = this.deptInfoData.parentId == '0'?[]:arr
            this.menuTreeKey = +new Date()
            this.deptInfoData.orderNum = this.deptInfoData.order
            this.deptInfoData.deptId = this.deptInfoData.id
            this.deptInfoData.deptName = this.deptInfoData.title
            this.$nextTick(function() {
              this.form.setFieldsValue(this.deptInfoData)
            })
          }
          this.modal_title =this.type=='add' ? '添加部门' : '编辑部门'
          API.deptList().then(res => {
            res.rows.children.forEach(e => {
              var Tree = e
              this.$set(Tree, 'title', Tree.title)
              this.$set(Tree, 'key', Tree.key)
              this.$set(Tree, 'value', Tree.id)
              this.data.push(Tree)
              this.expandedKeys.push(Tree.key);
            })
          })
        }
      }
    }
  }
</script>

<style>
</style>
