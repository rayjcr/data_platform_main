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
  >
    <a-form :form="form" @submit="saveRole">
      <a-form-item label="功能授权" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <div class="tree-box">
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
        </div>
      </a-form-item>
    </a-form>
    <div slot="footer">
      <a-button @click="exit">关闭</a-button>
      <a-button type="primary" @click="saveRole">保存</a-button>
    </div>
  </a-modal>
</template>

<script>
import * as API from '@/api/data'
export default {
    name: 'RoleTree',
    props: {
        roleEditVisiable: {
            default: false,
        },
        title: {
            type: String,
            default: '角色功能授权',
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
        saveRole() {
            this.form.validateFields((err) => {
                if (!err) {
                    // const data = this.form.getFieldsValue()
                    // data.menuId = this.checkedKeys.join(',')
                    API.saveRoleMenu({
                        dataId: this.roleInfoData.roleId,
                        relationId: this.checkedKeys
                    })
                        .then((res) => {
                            this.$emit('success')
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: '授权成功',
                                onOk() {},
                            })
                        })
                        .catch(() => {
                            console.log('授权失败')
                        })
                }
            })
        },
    },
    watch: {
        roleEditVisiable() {
            if (this.roleEditVisiable) {
                this.treeData = []
                API.getMenuList().then((res) => {
                    res.rows.children.forEach((e) => {
                        var Tree = e
                        this.$set(Tree, 'title', Tree.title)
                        this.$set(Tree, 'key', Tree.key)
                        this.$set(Tree, 'value', Tree.id)
                        this.treeData.push(Tree)
                    })
                    API.getRoleMenuId(this.roleInfoData.roleId).then((res) => {
                        if (res) {
                            this.defaultCheckedKeys = res.value
                            this.expandedKeys = res.value
                            this.checkedKeys = res.value
                            this.menuTreeKey = +new Date()
                        }
                    })
                })
            }
        },
    },
}
</script>

<style lang="less" scoped>
    .tree-box {
        max-height: 400px;
        overflow-y: auto;
    }
</style>
