<template>
  <a-modal
    :title="title"
    :visible="roleEditVisiable"
    width="50%"
    style="min-width:500px"
    @cancel="exit"
    destroyOnClose
    :maskClosable="false"
    :keyboard="false"
    centered
    :bodyStyle="{'height':'500px','overflowY':'auto'}"
  >
    <a-form :form="form" @submit="saveUserDept">
      <a-form-item label="数据授权" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-tree
          :key="menuTreeKey"
          checkStrictly
          checkable
          :treeData="treeData"
          ref="tree"
          @check="onCheck"
          :defaultCheckedKeys="defaultCheckedKeys"
          :expandedKeys="expandedKeys"
          @expand="onExpand"
        />
      </a-form-item>
    </a-form>
    <div slot="footer">
      <a-button @click="exit">关闭</a-button>
      <a-button type="primary" @click="saveUserDept">保存</a-button>
    </div>
  </a-modal>
</template>

<script>
    import * as API from '@/api/data'
    export default {
        name: 'DataTree',
        props: {
            roleEditVisiable: {
                default: false,
            },
            title: {
                type: String,
            },
            roleInfoData: {
                require: true,
            },
        },
        data() {
            return {
                treeData: [],
                menuTreeKey: +new Date(),
                defaultCheckedKeys: [],
                form: this.$form.createForm(this),
                allTreeKeys: [],
                expandedKeys: [],
                checkedKeys: [],
            }
        },
        mounted() {},
        methods: {
            exit() {
                this.menuTreeKey = +new Date()
                this.defaultCheckedKeys = []
                this.expandedKeys = []
                this.checkedKeys = []
                this.treeData = []
                this.form.resetFields()
                this.$emit('close')
            },
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys
            },
            onCheck(checkedKeys, info) {
                this.checkedKeys = checkedKeys.checked
            },
            saveUserDept() {
                this.form.validateFields((err) => {
                    if (!err) {
                        API.saveUserDept({
                            dataId: this.roleInfoData.userId,
                            relationId: this.checkedKeys
                        })
                            .then((res) => {
                                this.$emit('success')
                                this.$success({
                                    centered: true,
                                    title: '成功',
                                    content: '保存成功',
                                    onOk() {},
                                })
                            })
                            .catch(() => {
                                console.log('保存失败')
                            })
                    }
                })
            },
        },
        watch: {
            roleEditVisiable() {
                if (this.roleEditVisiable) {
                    this.treeData = []
                    API.getDeptList().then((res) => {
                        res.rows.children.forEach((e) => {
                            var Tree = e
                            this.$set(Tree, 'title', Tree.title)
                            this.$set(Tree, 'key', Tree.key)
                            this.$set(Tree, 'value', Tree.id)
                            this.treeData.push(Tree)
                        })

                        API.getDeptInfo(this.roleInfoData.userId).then((res) => {
                                if (res.resultCode == 200) {
                                    this.defaultCheckedKeys = res.value;
                                    this.expandedKeys = res.value;
                                    this.checkedKeys = res.value;
                                    this.menuTreeKey = +new Date()
                                }
                            })
                    })
                }
            },
        },
    }
</script>

<style>
</style>
