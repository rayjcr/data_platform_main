<template>
  <div class="main">
    <div class="wrap">
      <div class="main_content">
        <a-row>
          <a-col :span="8">
            <div class="left-box">
              <div class="my_title">组织机构</div>
              <div class="content_head">
                <a-input-search v-model="deptName" placeholder="组织机构名称" style="width: 90%;" @search="onSearch" />
              </div>
              <div class="jg-list">
                <a-tree default-expand-all @select="onSelect" @rightClick="rightClick" :treeData="bmList">
                  <!-- <a-tree-node key="0-0" title="parent 0" >
                    <a-tree-node key="0-0-0" title="leaf 0-0" />
                    <a-tree-node key="0-0-1" title="leaf 0-1" />
                  </a-tree-node> -->
                </a-tree>
                <div class="tooltip-box" :style="style">
                  <p
                    v-for="(item,index) in tooltip_list"
                    :key="index"
                    @click="clickToolTip(item.type)"
                  >{{item.title}}</p>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span="16">
            <div class="right-box" v-if="title">
              <div class="my_title">{{title}}</div>
              <a-form :form="form" @submit="saveJg">
                <!-- <a-form-item
                  label="机构编号"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    type="text"
                    v-decorator="['bh',{rules: [{ required: true, message: '请输入机构编号！' }]}]"
                    placeholder="请输入机构编号！"
                  />
                </a-form-item> -->
                <a-form-item
                  label="机构名称"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    type="text"
                    v-decorator="['deptName',{rules: [{ required: true, message: '请输入机构名称' }]}]"
                    placeholder="请输入机构名称"
                  />
                </a-form-item>
                <a-form-item
                  label="负责人"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    type="text"
                    v-decorator="['adminName']"
                    placeholder="请输入负责人"
                  />
                </a-form-item>
                <a-form-item
                  label="电话"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    v-decorator="['mobile',{rules: [{ pattern: /^((0\d{2,3}-\d{7,8})|(\d{7,8})|(1[34578]\d{9}))$/ , message: '电话号码格式错误！' }]}]"
                    placeholder="请输入电话"
                  />
                </a-form-item>
                <a-form-item
                  label="地址"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    type="text"
                    v-decorator="['address']"
                    placeholder="请输入地址"
                  />
                </a-form-item>
                <a-form-item
                  label="邮箱"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    v-decorator="['email',{rules: [{ pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ , message: '邮箱格式错误！' }]}]"
                    placeholder="请输入邮箱"
                  />
                </a-form-item>
                <a-form-item
                  label="邮编"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    v-decorator="['postCode',{rules: [{ pattern: /^[1-9][0-9]{5}$/ , message: '邮编格式错误' }]}]"
                    placeholder="请输入邮编"
                  />
                </a-form-item>
                <a-form-item
                  label="排序号"
                  style="margin-bottom:10px"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input type="number" v-decorator="['orderNum']" placeholder="请输入排序号" />
                </a-form-item>
              </a-form>
              <div class="footer" style="text-align: center;">
                <a-button @click="title = ''">关闭</a-button>
                <a-button type="primary" @click="saveJg">保存</a-button>
              </div>
            </div>
            <div class="right-box" v-else>
                <v-empty tip="暂无数据"></v-empty>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from '@/api/data'

import Empty from "@/components/Empty/Empty";

export default {
    name: 'Zzjg',
    components: {
        'v-empty': Empty,
    },
    data() {
        return {
            style: {},
            tooltip_list: [],
            form: {},
            title: '',
            deptName: undefined, // 部门名称
            selectedId: '',
            bmList: [], // 部门列表
            deptInfo: {}, // 部门详情
            eventKey: 0,
        }
    },
    mounted() {
        this.getDeptList();
    },
    methods: {
        onSearch() {
            this.getDeptList();
        },
        // 获取部门列表
        getDeptList() {
            this.bmList = [];
            API.getDeptList({
                deptName: this.deptName
            }).then((res) => {
                for (var i = 0; i < res.rows.children.length; i++) {
                    this.bmList.push(res.rows.children[i])
                }
            })
        },
        // 查询部门详细信息
        getDeptById(deptId) {
            API.getDeptById({
                deptId
            }).then((res) => {
                if(res.resultCode == 200) {
                    this.deptInfo = res.value;
                    if(this.title === '编辑组织机构') {
                        this.$nextTick(() => {
                            this.form.setFieldsValue({
                                'mobile': res.value.mobile,
                                'email': res.value.email,
                                'address': res.value.address,
                                'orderNum': res.value.orderNum,
                                'postCode': res.value.postCode,
                                'adminName': res.value.adminName,
                                'deptName': res.value.deptName,
                            })
                        })
                    }
                }
            })
        },
        onSelect(keys, event) {
            // console.log('Trigger Select', keys, event)
            this.form = this.$form.createForm(this)
            this.style = {
                display: 'none',
            }
            // let childrenLen = event.node.$children.length
            if (event.selected) {
                this.title = '编辑组织机构'
            } else {
                this.title = ''
            }
            this.getDeptById(keys[0])
        },
        rightClick({ event, node }) {
            this.tooltip_list = [
                { title: '增加', type: 'add' },
                { title: '修改', type: 'edit' },
                { title: '删除', type: 'del' },
            ]
            this.style = {
                top: event.layerY + 'px',
                left: event.layerX + 'px',
                display: 'block',
            }
            this.eventKey = node.eventKey
        },
        clickToolTip(type) {
            this.form = this.$form.createForm(this)
            if (type === 'add') {
                this.title = '新增组织机构'
            } else if (type === 'edit') {
                this.title = '编辑组织机构'
            } else {
                this.del();
            }
            this.style = {
                display: 'none',
            }
            this.getDeptById(this.eventKey)
        },
        del() {
            this.$confirm({
                centered: true,
                title: '确认提示',
                content: '确认删除该组织机构吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    API.delDept(this.deptInfo.deptId)
                        .then((res) => {
                           this.$success({
                                centered: true,
                                title: '成功',
                                content: '删除成功',
                                onOk() {},
                            })
                            this.getDeptList();
                            this.title = ''
                        })
                        .catch((err) => {
                            console.log('删除失败')
                        })
                },
                onCancel: () => {
                    console.log('退出')
                },
            })
        },
        saveJg() {
            let data = this.form.getFieldsValue();
            let url = 'addDept';
            if(this.title === '编辑组织机构') {
                data['deptId'] = this.deptInfo.deptId;
                url = 'editDept'
            }
            
            data['parentId'] = this.deptInfo.parentId;
            API[url](data).then((res) => {
                if(res.resultCode == 200) {
                    this.$success({
                        centered: true,
                        title: '成功',
                        content: '保存成功',
                        onOk() {},
                    })
                    this.getDeptList();
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
.ant-row,
.ant-col-8,
.ant-col-16 {
    height: 100%;
}
.main_content {
    background-color: transparent;
}
.left-box,
.right-box {
    height: 100%;
    background-color: #ffffff;
}
.my_title {
    height: 48px;
    line-height: 48px;
    font-weight: 600;
    padding-left: 15px;
    border-bottom: 1px solid #f0f2f5;
}
.content_head {
    height: 48px;
    width: 100%;
    line-height: 48px;
    font-size: 14px;
    text-align: center;
}
.jg-list {
    position: relative;
    height: calc(100% - 96px);
    padding: 0 0 10px 10px;
    overflow-y: auto;
    .tooltip-box {
        position: absolute;
        z-index: 100;
        width: 100px;
        background-color: #ffffff;
        box-shadow: 0 1px 2px #ccc;
        // opacity: 0;
        display: none;
        transition: all 0.1s;
        p {
            line-height: 40px;
            cursor: pointer;
            text-align: center;
            margin: 0;
            border-bottom: 1px solid #ccc;
            &:nth-child(3) {
                border-bottom: none;
            }
        }
    }
}
.right-box {
    margin-left: 10px;
}
</style>
