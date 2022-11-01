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
              <a-input style="width:250px; margin-right: 10px" placeholder="请输入用户名" v-model="username" />
              <a-tree-select style="width: 250px;margin-right: 10px;" v-model="deptId" allowClear :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="bmList"
                placeholder="请选择组织架构" treeDefaultExpandAll >
              </a-tree-select>
              <a-select style="width:200px; margin-right: 10px" v-model="userType" placeholder="请选择用户类型" allowClear>
                  <a-select-option v-for="(item, index) in userTypeList" :key="index" :value="String(item.type)">{{item.name}}</a-select-option>
              </a-select>
              <a-button type="primary" style="vertical-align: baseline;" @click="getList(1)">
                <span class="iconfont">&#xe607;</span>
                <label class="btn_text">查询</label>
              </a-button>
            </a-form-item>
          </a-form>
          <div class="optionBtns main_margin_bottom_10">
            <!-- <a-button class="add" style="margin-right:20px" @click="add('add')" type="primary">
              <span class="iconfont">&#xe61a;</span>
              <label class="btn_text">新增</label>
            </a-button>
            <a-button
              class="edit"
              style="margin-right:20px"
              @click="add('edit',selectedRow)"
              :disabled="disabled"
              type="primary"
            >
              <span class="iconfont font_size_20">&#xe632;</span>
              <label class="btn_text">编辑</label>
            </a-button>
            <a-button
              style="margin-right:20px"
              @click="del(selectedRow)"
              :disabled="disabled"
              class="del"
              type="primary"
            >
              <span class="iconfont">&#xe619;</span>
              <label class="btn_text">删除</label>
            </a-button> -->
            <a-button
              class="add"
              style="margin-right:20px"
              type="primary"
              :disabled="disabled"
              @click="add('init',selectedRow)"
            >
              <a-icon type="key" />
              <label class="btn_text">初始化密码</label>
            </a-button>
            <!-- <a-button
              class="add"
              style="margin-right:20px"
              type="primary"
              :disabled="disabled"
              @click="add('enable',selectedRow)"
            >
              <a-icon type="check" />
              <label class="btn_text">启用账号策略</label>
            </a-button>
            <a-button class="add" style="margin-right:20px" type="primary" :disabled="disabled">
              <a-icon type="close" />
              <label class="btn_text">停用账号策略</label>
            </a-button> -->
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
            <div slot="userName" slot-scope="text,record">
                <!-- class="userName" @click="add('look',record)" -->
              <span>{{record.username}}</span>
            </div>
            <div slot="ssex" slot-scope="text,record">
              <span v-html="record.ssex == '0'?'男':(text=='1'?'女':'保密')"></span>
            </div>
            <div slot="roleType" slot-scope="text,record">
              <span v-if="record.roleType == 1">超管</span>
              <span v-else-if="record.roleType == 2">校管</span>
              <span v-else-if="record.roleType == 3">教师</span>
              <span v-else-if="record.roleType == 4">家长</span>
              <span v-else-if="record.roleType == 5">学生</span>
              <span v-else>其他</span>
            </div>
            <div slot="cz" slot-scope="text,record">
              <a-switch
                checked-children="启用"
                un-checked-children="停用"
                @change="e=>ztChange(e,record)"
                :checked="record.status == '1'?true:false"
              />
            </div>
          </a-table>
        </a-card>
      </div>
    </div>

    <!-- 新增编辑用户 -->
    <a-modal
      :title="modal_title"
      :visible="u_visible"
      width="50%"
      style="min-width:500px"
      @cancel="u_visible = false"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      centered
    >
      <a-form class="user-modal-box" :form="form" @submit="saveUser">
        <a-form-item
          label="姓名"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            v-decorator="['xm',{rules: [{ required: true, message: '请输入姓名' }]}]"
            placeholder="请输入姓名"
          />
        </a-form-item>
        <a-form-item
          label="性别"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-radio-group v-model="sex">
            <a-radio :value="0">男</a-radio>
            <a-radio :value="1">女</a-radio>
            <a-radio :value="2">保密</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="用户名"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            :maxLength="20" :disabled="modal_title === '新增用户' ? false : true"
            v-decorator="['username',{rules: [{ required: true, message: '请输入用户名' }]}]"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item
          label="密码"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          v-if="modal_title === '新增用户'"
        >
          <a-input
            v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }]}]"
            placeholder="请输入密码"
            type="password"
          />
        </a-form-item>
        <a-form-item
          label="电子邮箱"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            v-decorator="['email',{rules: [{ pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ , message: '邮箱格式错误！' }]}]"
            placeholder="请输入电子邮箱"
          />
        </a-form-item>
        <a-form-item
          label="联系电话"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            v-decorator="['mobile',{rules: [{ required: true, message: '请输入联系电话' },{ pattern: /^((0\d{2,3}-\d{7,8})|(\d{7,8})|(1[34578]\d{9}))$/ , message: '电话号码格式错误！' }]}]"
            placeholder="请输入联系电话"
          />
        </a-form-item>
        <a-form-item label='角色' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
            <a-select v-decorator="['roleId',{rules: [{ required: true, message: '请选择角色！' }]}]" placeholder="请选择角色">
              <a-select-option v-for="(role_item,role_index) in roleList" :key="role_index" :value="role_item.roleId">{{role_item.roleName}}</a-select-option>
            </a-select>
          </a-form-item>
        <a-form-item label='所属部门' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
            <a-tree-select style="width: 100%" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="bmList"
              placeholder="请选择所属部门" treeDefaultExpandAll v-decorator="['deptId',{rules: [{ required: true, message: '请选择所属部门！' }]}]">
            </a-tree-select>
          </a-form-item>
        <a-form-item
          label="启用状态"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-radio-group v-model="status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">停用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="u_visible = false">关闭</a-button>
        <a-button type="primary" @click="saveUser">保存</a-button>
      </div>
    </a-modal>

    <!-- 初始化密码 -->
    <a-modal
      :title="modal_title"
      :visible="visible"
      width="50%"
      style="min-width:500px"
      @cancel="visible = false"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      centered
    >
      <a-form :form="form" @submit="initPassward">
        <a-form-item
          label="初始化类型"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-radio-group v-model="p_type" @change="onChange">
            <a-radio :value="1">默认密码</a-radio>
            <a-radio :value="2">自定义密码</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- <a-form-item
          label="密码"
          v-show="p_type == 1"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input type="password" @change="checkStrong" :disabled="true" />
        </a-form-item> -->
        <a-form-item
          label="密码"
          v-show="p_type == 2"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            type="password"
            @change="checkStrong"
            v-decorator="['password1',{rules: [{ required: true, message: '请输入密码！' }]}]"
            placeholder="请输入密码！"
            autocomplete="new-password"
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          v-show="p_type == 2"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            type="password"
            v-decorator="['password2',{rules: [{ required: true, message: '请输入确认密码！' }]}]"
            placeholder="请输入确认密码！"
            autocomplete="new-password"
          />
        </a-form-item>
        <a-form-item
          label="密码强度"
          v-show="p_type == 2"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <div class="strength-span">
            <span class="strength" :class="{'one': strong >= 1}"></span>
            <span class="strength" :class="{'two': strong >= 2}"></span>
            <span class="strength" :class="{'three': strong >= 3}"></span>
          </div>
          <div class="strength-font">
            <span class="one">弱</span>
            <span class="two">中</span>
            <span class="three">强</span>
          </div>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="visible = false">关闭</a-button>
        <a-button type="primary" @click="initPassward">保存</a-button>
      </div>
    </a-modal>

    <!-- 启用账户 -->
    <a-modal
      :title="modal_title"
      :visible="a_visible"
      width="50%"
      style="min-width:500px"
      @cancel="a_visible = false"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      centered
    >
      <a-form :form="form" @submit="enable">
        <a-form-item
          label="账号有效期"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-date-picker
            showTime
            placeholder="请选择有效截止日期"
            format="YYYY-MM-DD HH:mm:ss"
            style="margin-right: 10px"
            :disabledDate="disabledDate"
            v-model="time"
            @change="changeTime"
          ></a-date-picker>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="a_visible = false">关闭</a-button>
        <a-button type="primary" >保存</a-button>
      </div>
    </a-modal>

    <!-- 查看账号信息 -->
    <a-modal
      :title="modal_title"
      :visible="d_visible"
      width="60%"
      style="min-width:500px"
      @cancel="d_visible = false"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      centered
    >
      <div class="a-modal-box">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="账号信息">
            <ul>
              <li class="li-item">
                <div class="left">职工号: zyld</div>
                <div class="left">密保手机: 18521564465</div>
              </li>
              <li class="li-item">
                <div class="left">密保邮箱: zyld</div>
                <div class="left">设置别名登录: 18521564465</div>
              </li>
              <li class="li-item">
                <div class="left">微信账号: zyld</div>
                <div class="left">QQ账号: 18521564465</div>
              </li>
              <li class="li-item">
                <div class="left">账号策略有效期: zyld</div>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane key="2" tab="详细信息">
            <ul>
              <li class="li-item">
                <div class="left">姓名: zyld</div>
                <div class="left">性别: 男</div>
              </li>
              <li class="li-item">
                <div class="left">民族: zyld</div>
                <div class="left">政治面貌: 18521564465</div>
              </li>
              <li class="li-item">
                <div class="left">证件类型: zyld</div>
                <div class="left">证件号码: 18521564465</div>
              </li>
              <li class="li-item">
                <div class="left">手机号码: zyld</div>
                <div class="left">电子邮箱: 18521564465</div>
              </li>
              <li class="li-item">
                <div class="left">用户类型: zyld</div>
                <div class="left">用户状态: 正常</div>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane key="3" tab="所属角色">
            <a-tag>管理员</a-tag>
            <a-tag>外用管理员</a-tag>
          </a-tab-pane>
          <a-tab-pane key="4" tab="授权应用">
            <div class="list-box">
              <div class="yy-item">
                <img
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt
                />
                <p>应用一</p>
              </div>
              <div class="yy-item">
                <img
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt
                />
                <p>应用一</p>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="5" tab="所有权限">
            <a-tree
              :treeData="treeData"
              ref="tree"
              @check="onCheck"
              :defaultCheckedKeys="defaultCheckedKeys"
              :expandedKeys="expandedKeys"
              @expand="onExpand"
            />
          </a-tab-pane>
        </a-tabs>
      </div>
      <div slot="footer">
        <a-button @click="d_visible = false">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as API from '@/api/data'
import moment from 'moment'

export default {
    name: 'User',
    data() {
        return {
            visible: false, // 初始化密码弹窗
            u_visible: false, // 新增编辑用户弹窗
            a_visible: false, // 启用账号弹窗
            d_visible: false, // 查看账号信息弹窗
            zzjgList: [], // 组织架构
            bmList: [], // 部门列表
            roleList: [], // 角色列表
            userTypeList: [],
            userType: undefined,
            roleTree: {
                visiable: false,
                title: '数据权限',
            },
            roleInfo: {
                visiable: false,
                data: {},
            },
            // 表头
            columns: [
                {
                    title: '序号',
                    dataIndex: 'xh',
                    width: '10%',
                },
                {
                    title: '用户名',
                    width: '10%',
                    dataIndex: '',
                    scopedSlots: {
                        customRender: 'userName',
                    },
                },
                {
                    title: '姓名',
                    width: '10%',
                    dataIndex: 'nickname',
                },
                {
                    title: '性别',
                    width: '10%',
                    dataIndex: '',
                    scopedSlots: {
                        customRender: 'ssex',
                    },
                },
                {
                    title: '角色',
                    dataIndex: 'roleName',
                    width: '10%',
                },
                {
                    title: '用户类型',
                    dataIndex: 'type',
                    width: '10%',
                    // scopedSlots: {
                    //     customRender: 'roleType',
                    // },
                    customRender: (text, records, index) => 
                    `${this.userTypeList.filter(e => e.type == text)[0].name}`
                },
                {
                    title: '组织机构',
                    dataIndex: 'deptName',
                    width: '10%',
                },
                {
                    title: '电话',
                    dataIndex: 'mobile',
                    width: '10%',
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                    width: '10%',
                },
                {
                    title: '操作',
                    dataIndex: '',
                    width: '10%',
                    scopedSlots: {
                        customRender: 'cz',
                    },
                },
            ],
            disabled: true,
            selectedRowKeys: {},
            selectedRow: [],
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
            form: {},
            sex: 0, // 0男，1女
            status: 1, // 1启用 0停用
            p_type: 1, // 1默认密码,2自定义密码
            timer: null,
            strong: 0, // 密码强度
            time: null,
            treeData: [],
            defaultCheckedKeys: [],
            expandedKeys: [],
            username: undefined,
            userInfo: {},
            deptId:null
        }
    },
    mounted() {
        this.getList();
        // 获取部门列表
        this.getDeptList();
        // 获取角色列表
        this.getRoleList();
        // 获取用户类型
        this.getUserType();
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
                deptId:this.deptId,
                type: this.userType
            }).then((res) => {
              res.rows.forEach((e,index)=>{
                this.$set(e,'xh',(this.pagination.current - 1) * this.pagination.pageSize + (index + 1))
              })
                this.pagination.total = Number(res.total)
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
        // 获取角色列表
        getRoleList() {
            API.getRoleList().then(res => {
                this.roleList = res.rows
            })
        },
        // 获取用户类型
        getUserType() {
            API.userType().then(res => {
                this.userTypeList = res.value
            })
        },
        // 新增编辑用户
        saveUser() {
            let data = this.form.getFieldsValue();
            this.form.validateFields((err) => {
                if (!err) {
                    let api_url = this.modal_title === '新增用户' ? 'addUser' : 'updateUser';
                    API[api_url]({
                        "deptId": data.deptId,
                        "email": data.email,
                        "mobile": data.mobile,
                        "nickname": data.xm,
                        "password": data.password,
                        "pic": data.pic,
                        "roleId": data.roleId,
                        "ssex": this.sex,
                        "status": this.status,
                        "userId": this.modal_title === '新增用户' ? null : this.selectedRow.userId,
                        "username": data.username
                    }).then((res) => {
                        if(res.resultCode == 200) {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: this.modal_title === '新增用户' ? '添加成功' : '编辑成功',
                                onOk() {},
                            })
                            this.u_visible = false;
                            this.disabled = true;
                            this.getList(1)
                        }
                    })
                }
            })
        },
        add(type, data) {
            this.form = this.$form.createForm(this)
            if (type === 'add') {
                this.u_visible = true
                this.modal_title = '新增用户'
            } else if (type === 'edit') {
                this.u_visible = true
                this.modal_title = '编辑用户'
                this.getUserInfo(data.userId);
            } else if (type === 'init') {
                this.strong = 0
                this.visible = true
                this.modal_title = '初始化' + '【' + data.username + '】' + '的密码'
            } else if (type === 'enable') {
                this.a_visible = true
                this.modal_title = '启用' + '【' + data.username + '】' + '的账号策略'
            } else if (type === 'look') {
                this.d_visible = true
                this.modal_title = data.username + '的账号信息'
                this.getUserInfo(data.userId)
            }
        },
        // 获取用户信息
        getUserInfo(id) {
            API.getUserInfo(id)
                .then((res) => {
                    if(res.resultCode == 200) {
                        if(this.modal_title === '编辑用户') {
                            this.$nextTick(() => {
                                this.form.setFieldsValue({
                                    'mobile': res.value.mobile,
                                    'email': res.value.email,
                                    'xm': res.value.nickname,
                                    'username': res.value.username,
                                    'password': res.value.password,
                                    'roleId': res.value.roleId,
                                    'deptId': typeof res.value.deptId === 'string' ? res.value.deptId : String(res.value.deptId),
                                })
                                this.sex = Number(res.value.ssex);
                                this.status = res.value.status;
                            })
                        }
                    }
                })
                .catch((err) => {
                    console.log('停用失败')
                })
        },
        // 删除账号
        del(data) {
            this.$confirm({
                centered: true,
                title: '确认提示',
                content: '您确定要删除选中的数据吗?',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    API.delUser(data.userId)
                        .then((res) => {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: '删除成功',
                                onOk() {},
                            })
                            this.disabled = true
                            this.getList(1)
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
        // 初始化密码
        initPassward() {
            let data = {
                userIds: this.selectedRow.userId,
            }
            if(this.p_type == 2) { // 自定义密码
                let form_data = this.form.getFieldsValue();
                if(form_data.password1 != form_data.password2) {
                    this.$error({
                        centered: true,
                        title: '失败',
                        content: '两次密码输入不一致',
                        onOk() {},
                    })
                    return;
                }
                data['password'] = form_data.password1;
            }
            API.reset(data)
                .then((res) => {
                    if(res.resultCode == 200) {
                        this.$success({
                            centered: true,
                            title: '成功',
                            content: '初始化成功',
                            onOk() {},
                        })
                        this.visible = false;
                        this.disabled = true;
                        this.getList(1)
                    }
                })
                .catch((err) => {
                    console.log('初始化失败')
                })
        },
        // 检测密码强度
        checkStrong(val) {
            !!this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                let { password1 } = this.form.getFieldsValue()
                let modes = 0
                this.strong = modes
                //正则表达式验证符合要求的
                if (password1 && password1.length < 1) return modes
                if (/\d/.test(password1)) modes++ //数字
                if (/[a-z]/.test(password1)) modes++ //小写
                if (/[A-Z]/.test(password1)) modes++ //大写
                if (/\W/.test(password1)) modes++ //特殊字符

                //逻辑处理
                switch (modes) {
                    case 1:
                        this.strong = 1
                        break
                    case 2:
                        this.strong = 2
                        break
                    case 3:
                    case 4:
                        this.strong = password1.length < 12 ? 3 : 4
                        break
                }
            }, 500)
        },
        // 启用账号
        enable() {},
        changeTime() {},
        range(start, end) {
            const result = []
            for (let i = start; i < end; i++) {
                result.push(i)
            }
            return result
        },
        disabledDate(current) {
            // Can not select days before today and today
            return current && current < moment().endOf('day')
        },
        onChange() {},
        ztChange(e,data) {
            API.handleStatus({
                status: data.status == 0 ? 1 : 0,
                userId: data.userId
            })
                .then((res) => {
                    if(res.resultCode == 200) {
                        this.$success({
                            centered: true,
                            title: '成功',
                            content: '修改用户状态成功',
                            onOk() {},
                        })
                        this.getList(1)
                    }
                })
                .catch((err) => {
                    console.log('修改用户状态失败')
                })
        },
        // 查看账号信息tab页切换回调
        callback() {},
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys
        },
        //分页切换
        change(pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.getList()
        },
        saveRole() {
            this.roleTree.visiable = false
            this.disabled = true
            this.pagination.current = 1
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
.user-modal-box {
    h3 {
        font-weight: 600;
    }
}
.ant-table-wrapper {
    .userName {
        color: #1890ff;
        cursor: pointer;
        text-decoration: underline;
    }
}
.a-modal-box {
    .li-item {
        display: flex;
        line-height: 30px;
        .left,
        .right {
            flex: 1;
        }
    }
    .list-box {
        overflow-x: hidden;
        overflow-y: auto;
        height: 300px;
        .yy-item {
            float: left;
            margin-left: 20px;
            img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
            p {
                text-align: center;
                margin-top: 5px;
            }
        }
    }
}
.strength-span {
    span {
        display: inline-block;
        width: 85px;
        height: 10px;
        background: #eee;
        line-height: 20px;
        margin-right: 10px;
    }
    .one {
        background: red;
    }
    .two {
        background: orange;
    }
    .three {
        background: #00d1b2;
    }
}

.strength-font {
    line-height: 20px;
    span {
        display: inline-block;
        width: 85px;
        line-height: 20px;
        margin-right: 10px;
        text-align: center;
    }
    .one {
        color: red;
    }
    .two {
        color: orange;
    }
    .three {
        color: #00d1b2;
    }
}
</style>
