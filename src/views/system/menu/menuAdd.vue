<template>
  <div>
    <a-modal
      :title="modal_title"
      :visible="menuEditVisiable"
      width="50%"
      style="min-width:500px"
      @cancel="exit"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      centered
    >
      <a-form :form="form" @submit="saveMenu">
        <a-form-item
          label="id"
          style="display:none"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          v-if="type == 'edit'"
        >
          <a-input v-decorator="['menuId']" />
        </a-form-item>
        <a-form-item
          label="id"
          style="display:none"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input v-decorator="['menuName']" />
        </a-form-item>
        <a-form-item
          label="id"
          style="display:none"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input v-decorator="['type']" />
        </a-form-item>
        <div class="first_menu" v-if="isFirstMenu">
          <a-form-item
            label="菜单名称"
            style="margin-bottom:10px"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input
              v-decorator="['title',{rules: [{ required: true, message: '请输入菜单名称！' }]}]"
              placeholder="请输入菜单名称"
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item
            label="菜单URL"
            style="margin-bottom:10px"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input
              v-decorator="['path',{rules: [{ required: true, message: '请输入菜单URL！' }]}]"
              placeholder="请输入菜单URL"
              autocomplete="off"
            />
          </a-form-item>

          <a-form-item
            label="组件地址"
            style="margin-bottom:10px"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input
              v-decorator="['component',{rules: [{ required: true, message: '请输入组件地址！' }]}]"
              placeholder="请输入组件地址"
              autocomplete="off"
            />
          </a-form-item>

          <a-form-item
            label="菜单图标"
            style="margin-bottom:10px"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input v-decorator="['icon']" readonly disabled placeholder="请选择菜单图标">
              <a-icon
                slot="addonAfter"
                class="main_cursor_pointer"
                type="setting"
                @click="iconShow = true"
              />
            </a-input>
          </a-form-item>
          <a-form-item
            label="菜单排序"
            style="margin-bottom:10px"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input v-decorator="['orderNum']" placeholder="请输入菜单排序" autocomplete="off" />
          </a-form-item>
        </div>

        <div class="second_menu" v-else>
          <a-form-item
            label="id"
            style="display:none"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
            v-if="type == 'edit'"
          >
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-form-item
            label="id"
            style="display:none"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input v-decorator="['type']" />
          </a-form-item>
          <a-form-item
            label="按钮名称"
            style="margin-bottom:10px"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 17 }"
          >
            <a-input
              v-decorator="['title',{rules: [{ required: true, message: '请输入按钮名称！' }]}]"
              placeholder="请输入按钮名称"
              autocomplete="off"
            />
          </a-form-item>
        </div>
        <!-- <a-form-item
          label="相关权限"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input v-decorator="['perms']" placeholder="请输入相关权限" autocomplete="off" />
        </a-form-item> -->
        <a-form-item
          label="上级菜单"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <div class="tree-box">
            <a-tree
              :key="menuTreeKey"
              checkable
              :treeData="data"
              checkStrictly
              ref="tree"
              v-decorator="['parentId']"
              @check="onCheck"
              :expandedKeys="expandedKeys"
              @expand="onExpand"
              :defaultCheckedKeys="defaultCheckedKeys"
            />
          </div>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="exit">关闭</a-button>
        <a-button type="primary" @click="saveMenu">保存</a-button>
      </div>
    </a-modal>
    <a-modal
      title="选择菜单图标"
      :visible="iconShow"
      width="960px"
      style="min-width:500px"
      @cancel="iconShow = false"
    >
      <div class="icon_list">
        <ul class="icon_list_item">
          <li
            class="icon_list_item_li"
            v-for="icon in icon_list"
            :key="icon"
            @click="getIconId(icon)"
          >
            <!-- <span class="iconfont" v-bind:style="{color:icon_item.color}" v-html="icon_item.value"></span> -->
            <a-icon :type="icon" :title="icon" :class="{'active':activeIndex === icon}" />
          </li>
        </ul>
      </div>
      <div slot="footer">
        <a-button @click="iconShow = false">关闭</a-button>
        <a-button type="primary" @click="saveIcon">保存</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as API from '@/api/data'
export default {
    name: 'RoleTree',
    props: {
        menuEditVisiable: {
            default: false,
        },
        type: {
            default: String,
        },
        isFirstMenu: {
            default: Boolean,
        },
        menuData: {
            default: Array,
        },
    },
    data() {
        return {
            modal_title: '',
            form: this.$form.createForm(this),
            expandedKeys: [],
            data: [],
            defaultCheckedKeys: [],
            menuTreeKey: +new Date(), //更新tree
            iconShow: false,
            activeIndex: null,
            icon_list: [
                'lock',
                'unlock',
                'bars',
                'book',
                'calendar',
                'cloud',
                'cloud-download',
                'code',
                'copy',
                'credit-card',
                'delete',
                'desktop',
                'download',
                'ellipsis',
                'file',
                'file-text',
                'file-unknown',
                'file-pdf',
                'file-word',
                'file-excel',
                'file-jpg',
                'file-ppt',
                'file-markdown',
                'file-add',
                'folder',
                'folder-open',
                'folder-add',
                'hdd',
                'frown',
                'meh',
                'smile',
                'inbox',
                'laptop',
                'appstore',
                'link',
                'mail',
                'mobile',
                'notification',
                'paper-clip',
                'picture',
                'poweroff',
                'reload',
                'search',
                'setting',
                'share-alt',
                'shopping-cart',
                'tablet',
                'tag',
                'tags',
                'to-top',
                'upload',
                'user',
                'video-camera',
                'home',
                'loading',
                'loading-3-quarters',
                'cloud-upload',
                'star',
                'heart',
                'environment',
                'eye',
                'camera',
                'save',
                'team',
                'solution',
                'phone',
                'filter',
                'exception',
                'export',
                'customer-service',
                'qrcode',
                'scan',
                'like',
                'dislike',
                'message',
                'pay-circle',
                'calculator',
                'pushpin',
                'bulb',
                'select',
                'switcher',
                'rocket',
                'bell',
                'disconnect',
                'database',
                'compass',
                'barcode',
                'hourglass',
                'key',
                'flag',
                'layout',
                'printer',
                'sound',
                'usb',
                'skin',
                'tool',
                'sync',
                'wifi',
                'car',
                'schedule',
                'user-add',
                'user-delete',
                'usergroup-add',
                'usergroup-delete',
                'man',
                'woman',
                'shop',
                'gift',
                'idcard',
                'medicine-box',
                'red-envelope',
                'coffee',
                'copyright',
                'trademark',
                'safety',
                'wallet',
                'bank',
                'trophy',
                'contacts',
                'global',
                'shake',
                'api',
                'fork',
                'dashboard',
                'table',
                'profile',
                'alert',
                'audit',
                'branches',
                'build',
                'border',
                'crown',
                'experiment',
                'fire',
                'money-collect',
                'property-safety',
                'read',
                'reconciliation',
                'rest',
                'security-scan',
                'insurance',
                'interation',
                'safety-certificate',
                'project',
                'thunderbolt',
                'block',
                'cluster',
                'deployment-unit',
                'dollar',
                'euro',
                'pound',
                'file-done',
                'file-exclamation',
                'file-protect',
                'file-search',
                'file-sync',
                'gateway',
                'gold',
                'robot',
                'shopping',
            ],
            choose_icon: '',
        }
    },
    mounted() {},
    methods: {
        //图标选中事件
        getIconId(icon) {
            this.activeIndex = icon
            this.choose_icon = icon
            this.$message.success(`选中 ${icon}`)
        },
        saveIcon() {
            this.form.setFieldsValue({
                icon: this.choose_icon,
            })
            this.iconShow = false
        },
        saveMenu() {
            let checkedArr =
                Object.is(this.checkedKeys.checked, undefined) || Object.is(this.checkedKeys, undefined)
                    ? this.checkedKeys
                    : this.checkedKeys.checked
            if (this.checkedKeys.checked || checkedArr) {
                console.log(checkedArr)
                if (checkedArr.length > 1) {
                    this.$info({
                        centered: true,
                        title: '提示',
                        content: '最多只能选择一个上级菜单，请修改',
                        onOk() {},
                    })
                    this.checkedKeys = []
                    return
                }
            } else {
                checkedArr = []
            }

            const data = this.form.getFieldsValue()
            this.$set(data, 'menuName', data.title)

            if (this.isFirstMenu) {
                data.type = '0'
            } else {
                data.type = '1'
                data.menuId = data.id
            }
            if (checkedArr.length) {
                data.parentId = checkedArr[0]
            } else {
                if (!this.isFirstMenu) {
                    this.$message.error('请选择一个上级菜单')
                    return
                } else {
                    data.parentId = '0'
                }
            }
            this.form.setFieldsValue(data)
            this.$forceUpdate()
            this.form.validateFields((err) => {
                if (!err) {
                    if (this.type == 'add') {
                        API.addMenu(this.form.getFieldsValue()).then((res) => {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: '添加成功',
                                onOk() {},
                            })
                            this.$emit('suc')
                        })
                    } else {
                        API.updateMenu(this.form.getFieldsValue()).then((res) => {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: '编辑成功',
                                onOk() {},
                            })
                            this.$emit('suc')
                        })
                    }
                }
            })
        },
        exit() {
            this.$emit('handleCancel')
        },
        // 树
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
        },
        onCheck(checkedKeys) {
            this.checkedKeys = checkedKeys
        },
    },
    watch: {
        menuEditVisiable() {
            if (this.menuEditVisiable) {
                this.data = []
                this.form.resetFields()
                this.modal_title =
                    this.type == 'add'
                        ? this.isFirstMenu
                            ? '添加菜单'
                            : '添加功能按钮'
                        : this.isFirstMenu
                        ? '编辑菜单'
                        : '编辑功能按钮'
                if (this.type == 'edit') {
                    const arr = []
                    arr.push(this.menuData.parentId)
                    this.checkedKeys = this.defaultCheckedKeys = this.menuData.parentId == '0' ? [] : arr
                    this.menuTreeKey = +new Date()
                    this.menuData.orderNum = this.menuData.order
                    this.menuData.menuId = this.menuData.id
                    this.menuData.perms = this.menuData.permission
                    this.$nextTick(function () {
                        this.form.setFieldsValue(this.menuData)
                    })
                } else {
                    this.checkedKeys = []
                    this.defaultCheckedKeys = []
                }

                API.getMenuList({
                    type: '0',
                })
                    .then((res) => {
                        // this.data = res.rows.children
                        if (res) {
                            res.rows.children.forEach((e) => {
                                var Tree = e
                                this.$set(Tree, 'title', Tree.title)
                                this.$set(Tree, 'key', Tree.key)
                                this.$set(Tree, 'value', Tree.id)
                                this.data.push(Tree)
                                this.expandedKeys.push(Tree.key)
                            })
                        }
                    })
                    .catch((err) => {})
            }
        },
    },
}
</script>

<style scoped="scoped">
.icon_list {
    max-height: 500px;
    overflow-y: auto;
}
.icon_list_item_li {
    float: left;
    margin: 15px 13px;
    padding: 0 10px;
    cursor: pointer;
    /* font-size: 30px; */
    color: #999;
}

.icon_list_type_item {
    display: inline-block;
    padding: 0px 10px;
    line-height: 30px;
    border-radius: 4px;
    cursor: pointer;
}

.icon_list_item {
    overflow: hidden;
}

.icon_list .icon_list_item .icon_list_item_li i {
    font-size: 30px;
}

.icon_list .icon_list_item .icon_list_item_li:hover i,
.active {
    color: #40a9ff !important;
}
.tree-box {
    max-height: 326px;
    overflow-y: auto;
  }
</style>
