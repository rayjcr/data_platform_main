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
              <a-input style="width:250px; margin-right: 10px" allow-clear v-model="name" placeholder="请输入应用名称" />
              <a-select style="width: 250px;margin-right: 10px;" allowClear placeholder="请选择接入方式" v-model="joinType">
                <a-select-option :key="1" :value="1">CAS</a-select-option>
                <a-select-option :key="2" :value="2">OAUTH</a-select-option>
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

            <!-- 2022-1-21 涉及到审核的需填写审核意见 拒绝必填意见 通过可不填 -->
            <!-- 应用级别 levelType 1局端应用 2 学校应用 -->
            <a-button
              class="add"
              style="margin-right:20px"
              type="primary"
              :disabled="(selectedRow&&(selectedRow.levelType != 2)) ? disabled : true"
              @click="examine('audit')"
            >
              <a-icon type="audit" />
              <label class="btn_text">接入审核</label>
            </a-button>
            <!-- 接入审核通过   -->
            <!-- 
              1.待审核上架 publishStatus 5
              2.已上架 publishStatus 7
              可以进行编辑，已下架需重新申请上架
              应用在拒绝接入情况下，不能操作上下加审核按钮
             -->
            <a-button
              class="add"
              style="margin-right:20px"
              type="primary"
              :disabled="(selectedRow&&(selectedRow.status == '2'&&(selectedRow.publishStatus == '5' || selectedRow.publishStatus == '7'))) ? disabled : true"
              @click="examine('shelves')"
            >
              <a-icon type="audit" />
              <label class="btn_text">上下架审核</label>
            </a-button>
            <!-- <a-button
              class="add"
              style="margin-right:20px"
              type="primary"
              :disabled="selectedRow&&selectedRow.status == '3'?true:disabled"
              @click="examine(2)"
            >
              <a-icon type="audit" />
              <label class="btn_text">审核不通过</label>
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
            <div slot="xh" slot-scope="text,record,index">
              <span>{{index+1}}</span>
            </div>
            <div slot="name" slot-scope="text,record">
              <div class="nameBox">
                <span class="yyName" @click="add('look',record)">{{record.clientName}}</span>
              </div>
              
            </div>
            <div slot="joinType" slot-scope="text,record">
              <span>{{record.joinType == 1 ? 'CAS' : 'OAUTH'}}</span>
            </div>
            <div slot="status" slot-scope="text,record">
              <span
                :class="record.status == '2' ? 'pass' : 'nopass'"
              >{{record.status == '1' ? '待审核' : record.status == '2' ? '审核通过' : '已拒绝'}}</span>
            </div>
            <div slot="publishStatus" slot-scope="text,record">
              <span
                :class="record.publishStatus == '7' ? 'pass' : 'nopass'"
              >{{record.publishStatus == '5' ? '待审核' : record.publishStatus == '7' ? '已上架' : record.publishStatus == '6' ? '已下架' : '-'}}</span>
            </div>
            <div slot="open" slot-scope="text,record">
              <a-switch
                checked-children="启用"
                un-checked-children="停用"
                @change="e=>ztChange(e,record)"
                :checked="record.open == '1'?true:false"
              />
            </div>
            <div slot="my" slot-scope="text,record">
              <span class="pass my" @click="add('my',record)" v-if="record.status == '2' && record.joinType == 2">查看</span>
            </div>
            <div slot="zt" slot-scope="text,record">
              <span class="color_blue main_cursor_pointer" @click="auditLog(record)">审核记录</span>
            </div>
          </a-table>
        </a-card>
      </div>
    </div>

    <!-- 新增编辑应用信息 -->
    <a-modal
      :title="modal_title"
      :visible="visible"
      width="60%"
      style="min-width:500px"
      @cancel="visible = false"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      centered
    >
      <a-form :form="form" @submit="save">
        <a-form-item
          label="应用名称"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            type="text"
            v-decorator="['clientName',{rules: [{ required: true, message: '请输入应用名称！' }]}]"
            placeholder="请输入应用名称！"
          />
        </a-form-item>
        <a-form-item
          label="接入方式"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-radio-group v-model="jrfs">
            <a-radio :value="2">OAuth2.0(推荐)</a-radio>
            <a-radio :value="1">CAS Client</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="服务域名"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            type="text"
            v-decorator="['serviceUrl',{rules: [{ required: true, message: '请输入服务域名！' }]}]"
            placeholder="(需要添加http/https完整路径)"
          />
        </a-form-item>
        <a-form-item
          label="首页地址"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-input
            type="text"
            v-decorator="['loginUrl',{rules: [{ required: true, message: '请输入首页地址！' }]}]"
            placeholder="(需要添加http/https完整路径)"
          />
        </a-form-item>
        <a-form-item
          label="应用图标"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-upload
            action="/api/client/fileUpload"
            listType="picture-card"
            :headers="{'Cookies':'JSESSIONID=' + token}"
            :fileList="fileList"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <!-- v-if="fileList.length < 1" -->
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="应用简介"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-textarea
            v-decorator="['clientComment',{rules: [{ required: true, message: '请输入应用简介' }]}]"
            placeholder="请输入应用简介"
            :rows="4"
          />
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="visible = false">关闭</a-button>
        <a-button type="primary" @click="save">保存</a-button>
      </div>
    </a-modal>

    <!-- 查看应用信息 -->
    <a-modal
      :title="modal_title"
      :visible="l_visible"
      width="60%"
      style="min-width:500px"
      @cancel="l_visible = false"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      centered
    >
      <div class="cell client_info_box flex" v-if="clientInfo">
                <div class="client_logo">
                    <img class="headImg" :src="headImg" @error="error" width="100%" height="100%"/>
                </div>
                <div class="client_info flex_1">
                    <div class="client_name" v-if="clientInfo">{{clientInfo.clientName}} <span class="tag">{{clientInfo.joinType == '2'?'OAuth2.0':'CAS Client'}}</span></div>
                    <div class="cell_row flex">
                        <div class="info_item">
                            <label>AppId</label>
                            <span>{{clientInfo.status == '1'?'未获得':(clientInfo.status == '2'?clientInfo.clientId:'已回收')}}</span>
                            <span v-if="clientInfo.status == '1'">（审核通过后可获得）</span>
                        </div>
                        
                    </div>
                    <div class="cell_row flex">
                        <div class="info_item">
                            <label>服务域名</label>
                            <span>{{clientInfo.serviceUrl || ''}}</span>
                        </div>
                        <div class="info_item">
                            <label>首页地址</label>
                            <span>{{clientInfo.loginUrl || ''}}</span>
                        </div>
                    </div>
                    <div class="cell_row status flex">
                        <div class="info_item mr77">
                            <label>应用级别</label>
                             <span>{{clientInfo.levelType == 1?'局端应用':'校端应用'}}</span>
                        </div>
                        <div class="info_item" v-if="clientInfo.levelType == 2">
                            <label>应用对象</label>
                            <span class="sel" @click="onSetDept('', 'select')">查看</span>
                        </div>
                        <div class="info_item">
                            <label>应用类型</label>
                             <span>{{clientInfo.clientType ? (clientInfo.clientType == 1 ? '单点认证集成' : '开发者集成') : ''}}</span>
                        </div>
                        <div class="info_item">
                            <label>IP白名单</label>
                            <span>{{clientInfo.ipStr || ''}}</span>
                        </div>
                    </div>
                    <div class="cell_row flex">
                        <div class="info_item">
                            <label>应用描述</label>
                            <span>{{clientInfo.clientComment || ''}}</span>
                        </div>
                    </div>
                </div>
            </div>
      <div slot="footer">
        <a-button @click="l_visible = false">关闭</a-button>
      </div>
    </a-modal>

    <!-- 查看秘钥 -->
    <a-modal
      :title="modal_title"
      :visible="m_visible"
      width="60%"
      style="min-width:500px"
      @cancel="m_visible = false"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      centered
    >
      <a-form :form="form" v-if="clientInfo">
        <a-form-item
          label="AppID"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <p>{{clientInfo.clientId}}</p>
        </a-form-item>
        <a-form-item
          label="AppSecret"
          style="margin-bottom:10px"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <p class="appsecret">{{clientInfo.clientSecret}}</p>
        </a-form-item>
      </a-form>
      <div slot="footer">
        <a-button @click="m_visible = false">关闭</a-button>
      </div>
    </a-modal>

    <!--审核意见 -->
    <Audit :modalTitle="modal_title" :clientInfo="clientInfo" :modalType="modalType" :visible="auditVisible" ref="audit" :info="selectedRow" @cancel="cancel" @onSave="onSave"></Audit>
    <!-- 审核记录 -->
    <auditLog :visible="s_vis" :log="log" :info="infoLog" @cancel="s_vis = false"></auditLog>
    <SelDept v-if="isShowDept" :clientId="clientId" :visible="isShowDept" :interfaceInfo="onSelInterface" @cancel="isShowDept = false"/>
  </div>
</template>

<script>
import * as API from '@/api/data'
import { auditOk,auditNo,clientAuditLog } from '@/api/interface'
import cookie from 'js-cookie'
import Audit from './audit.vue'
import auditLog from './auditLog.vue'
import SelDept from '../index/components/selDept.vue'
export default {
    name: 'Application',
    components:{
      Audit,auditLog,SelDept
    },
    data() {
        return {
            disabled: true,
            visible: false,
            l_visible: false, // 查看应用信息弹窗
            m_visible: false, // 查看秘钥
            name: '', // 客户端名称
            joinType: undefined, // 接入方式
            modal_title: '',
            selectedRowKeys: [], // 选中行
            selectedRow: {}, // 选中行信息
            headImg:null,
            columns: [
                {
                    title: '序号',
                    dataIndex: '',
                    width: '30',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'xh',
                    },
                },
                {
                    title: '应用名称',
                    dataIndex: '',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'name',
                    },
                },
                {
                    title: '接入方式',
                    dataIndex: '',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'joinType',
                    },
                },
                {
                    title: '申请人',
                    dataIndex: 'nickname',
                    align: 'center',
                    width: '10%',
                },
                {
                    title: '申请时间',
                    dataIndex: 'createTime',
                    align: 'center',
                },
                {
                    title: '接入审核状态',
                    dataIndex: '',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: '上架申请时间',
                    dataIndex: '',
                    align: 'center',
                    customRender: (text, record, index) => 
                    `${ record.publishTime || '-'}`
                },
                {
                    title: '上架状态',
                    dataIndex: '',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'publishStatus',
                    },
                },
                {
                    title: '操作',
                    dataIndex: '',
                    width:100,
                    align: 'center',
                    scopedSlots: {
                        customRender: 'zt',
                    },
                },
                // {
                //     title: '秘钥',
                //     dataIndex: '',
                //     align: 'center',
                //     width: '10%',
                //     scopedSlots: {
                //         customRender: 'my',
                //     },
                // },
            ],
            data: [],
            pagination: {
                //分页
                total: 0,
                current: 1,
                pageSize: 10, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            form: {},
            jrfs: 2, // 1 OAuth，2 CAS
            fileList: [],
            token: cookie.get('JSESSIONID'),
            clientInfo: {}, // 应用详情
            auditVisible:false,
            info:{},
            s_vis:false,
            infoLog:{},
            log:[],
            modalType: '',
            isShowDept:false,
            clientId:null,
            onSelInterface:null,
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        onSetDept(data, type){
            this.clientId = this.clientInfo?this.clientInfo.clientId:''
            if(type == 'backShow') data['showBack'] = true
            this.onSelInterface = data || null
            this.isShowDept = true
        },
       // 图片报错显示默认图
        error(){
            this.headImg = require('@/assets/default.png')
        },
        cancel(){
          this.auditVisible = false
        },
        auditLog(data){
          this.s_vis = true
          this.infoLog = data
          this.clientAuditLog(data.clientId)
        },
        // 应用审核记录
        async clientAuditLog(clientId){
          let res = await clientAuditLog({clientId})
          this.log = res.value
        },
        getList(page) {
            this.pagination.current = page || this.pagination.current;
            API.getClientList({
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize,
                name: this.name,
                joinType: this.joinType
            }).then((res) => {
                if(res.resultCode == 200) {
                    this.pagination.total = res.value.total
                    this.data = res.value.records
                }
            })
        },
        async add(type, data) {
            this.form = this.$form.createForm(this)
            if (type === 'add') {
                this.visible = true
                this.modal_title = '新增应用信息'
            } else if (type === 'edit') {
                this.visible = true
                this.modal_title = '编辑应用信息'
                this.getClientInfo(data.clientId);
            } else if (type === 'look') {
                await this.getClientInfo(data.clientId);
                if(!this.clientInfo){
                  this.$success({
                      centered: true,
                      title: '成功',
                      content: '应用不存在或已被删除',
                      onOk() {},
                  })
                  this.init()
                  return
                }
                this.l_visible = true
                this.modal_title = '查看应用信息'
                this.headImg = this.clientInfo?('/api/' + this.clientInfo.logo):null
            } else if(type === 'my') {
                this.m_visible = true;
                this.modal_title = '查看'+data.clientName+'的秘钥'
                this.clientInfo = data;
            }
        },
        init(){
          this.disabled = true;
          this.selectedRowKeys = []
          this.selectedRow = {}
          this.getList(1);
        },
        // 查询单个客户端信息
        async getClientInfo(id) {
           await API.getClientInfo(id).then((res) => {
                // this.clientInfo = null
                if(res.resultCode == 200) {
                    this.clientInfo = res.value;
                    if(this.modal_title === '编辑应用信息') {
                        this.$nextTick(() => {
                            this.form.setFieldsValue({
                                'clientName': res.value.clientName,
                                'clientComment': res.value.clientComment,
                                'loginUrl': res.value.loginUrl,
                                'serviceUrl': res.value.serviceUrl,
                                'password': res.value.password,
                            })
                            this.fileList = [{
                                uid: '-1',
                                name: 'image.png',
                                status: 'done',
                                url: '/api' + res.value.logo,
                                response: {
                                    value: res.value.logo
                                }
                            }]
                            this.jrfs = res.value.joinType;
                        })
                    }
                }
            })
        },
        del(data) {
            this.$confirm({
                centered: true,
                title: '确认提示',
                content: '确认要删除吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    API.delClient(data.clientId)
                        .then((res) => {
                            if(res.resultCode == 200) {
                                this.$success({
                                    centered: true,
                                    title: '成功',
                                    content: '删除成功',
                                    onOk() {},
                                })
                                this.init()
                            }
                        })
                        .catch((err) => {
                            console.log('停用失败')
                        })
                },
                onCancel: () => {
                    console.log('退出')
                },
            })
        },
        async onSave(info){
          let api = null
          let params = {
            clientId:this.selectedRow.clientId,
            comment:info.opinion,
          }
          
          if(info.type == 'pass'){
            // 审核通过
            api = this.modalType == 'audit' ? auditOk : API.publishOk
          }else{
            api = this.modalType == 'audit' ? auditNo : API.publishNo
          }
          let res = await api(params)
          if(res.resultCode == 200){
            let msgHead = this.modalType == 'audit' ? '应用审核' : '上下架'
            let msg = null
            if(this.modalType == 'audit'){
                /**
                 * status 返回错误成功状态
                 * -1 未找到数据
                 * 0 成功
                 * 1 失败
                 */
                let {status} = res.value
                if(status === 0){
                  msg = info.type == 'pass' ? msgHead+'已通过' : msgHead+'已拒绝'
                  this.$success({
                      centered: true,
                      title: '成功',
                      content: msg,
                      onOk() {},
                  })
                }else{
                  if(status == -1) msg = '应用不存在或已被删除'
                  if(status == 1 || !status) msg = '应用审核失败'
                  this.$warning({
                    centered: true,
                    title: '错误',
                    content: msg,
                    onOk() {}
                  })
                }


                
            }else{
              /**
                 * status 返回错误成功状态
                 * -1 未找到数据 ok
                 * 0 成功 ok
                 * 1 重复下架(审核) ok
                 * 2 重复上架(审核) ok
                 * 3 已下架不可上架(审核) ok
                 * 4 数据未修改成功
                 * 5 应用已上架(申请应用)
                 */
               let str = info.type == 'pass' ? '应用允许上架' : '应用拒绝上架'
               let {status} = res.value
               
               if(status === 0){
                 msg = str + '操作成功'
                 this.$success({
                    centered: true,
                    title: '成功',
                    content: msg,
                    onOk() {},
                }) 
               }else{
                 if(status == -1) msg = '应用不存在或已被删除'
                 if(status == 1 || status == 2 || status == 3) msg = str + '操作失败，' + res.value.msg
                 if(status == 4) msg = str + '操作失败，' + '请重新审核'
                 if(!status){
                    msg = str + '操作失败'
                  }
                  this.$warning({
                    centered: true,
                    title: '错误',
                    content: msg,
                    onOk() {}
                  })
               }
            }
            // 延迟关闭
              setTimeout(()=>{
                
                this.$refs.audit.loading = false
                this.$refs.audit.init()
                this.auditVisible = false
                this.init()
               }, 1000);
            }
            if(res.resultCode == 500){
              this.$refs.audit.loading = false
            }
        },
        // 审核
        async examine(type) {
          await this.getClientInfo(this.selectedRow.clientId);
          if(!this.clientInfo){
            this.$success({
                centered: true,
                title: '成功',
                content: '应用不存在或已被删除',
                onOk() {},
            })
            this.init()
            return
          }
          this.modalType = type
          this.modal_title = type == 'shelves' ? '上下架审核' : '应用接入审核'
          this.auditVisible = true
        },
        ztChange(e,data) {
            API.handleClientStatus({
                status: data.open == 1 ? 0 : 1,
                clientId: data.clientId
            })
                .then((res) => {
                    if(res.resultCode == 200) {
                        this.$success({
                            centered: true,
                            title: '成功',
                            content: '修改应用状态成功',
                            onOk() {},
                        })
                        this.getList(1)
                    }
                })
                .catch((err) => {
                    console.log('修改应用状态失败')
                })
        },
        // 分页切换
        change(pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.getList()
        },
        beforeUpload(file, fileList) {
            this.fileList = []
            const reg = /\.(jpg|png|gif|jpeg)(\?.*)?$/
            return new Promise((resolve, reject) => {
                if (reg.test(file.name)) {
                    resolve()
                } else {
                    this.$error({
                        centered: true,
                        title: '失败',
                        content: '请上传正确的文件格式',
                        onOk() {},
                    })
                    reject(new Error('请上传正确的文件格式'))
                }
            })
        },
        handleChange({ file, fileList }) {
            this.fileList = fileList
            // console.log(this.fileList)
            if (file.status === 'done') {
                // console.log(file.response.value)
                // this.logo = file.response.value
            } else if (file.status === 'error') {
                this.$error({
                    centered: true,
                    title: '失败',
                    content: '图片上传失败',
                    onOk() {},
                })
            }
        },
        save() {
            if(!this.fileList.length) {
                this.$error({
                    centered: true,
                    title: '失败',
                    content: '请上传应用图标',
                    onOk() {},
                })
                return;
            }
            let data = this.form.getFieldsValue();
            data['joinType'] = this.jrfs;
            data['logo'] = this.fileList.length ? this.fileList[0].response.value : null;

            if(this.modal_title === '编辑应用信息') {
                data['clientId'] = this.selectedRow.clientId;
            }
            
            this.form.validateFields((err) => {
                if (!err) {
                    API.registerClient(data).then((res) => {
                        if(res.resultCode == 200) {
                            this.$success({
                                centered: true,
                                title: '成功',
                                content: '保存成功',
                                onOk() {},
                            })
                            this.fileList = [];
                            this.visible = false;
                            this.init();
                        }
                    })
                }
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

<style lang="less" scoped>
.yyName {
    color: #1bd86f;
    cursor: pointer;
    text-decoration: underline;
}
.pass {
    color: #1bd86f;
}
.nopass {
    color: red;
}
.my {
    cursor: pointer;
}
.appsecret {
    max-height: 200px;
    overflow-y: auto;
}
.nameBox{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  margin: auto;
}
.cell {
    width: 100%;
    // min-height: 3.9rem;
    background-color: #ffffff;
    border-radius: .10rem;
    // box-shadow: 0 1px 10px 0 rgba(59, 100, 168, .1);
    padding: .48rem .48rem 0.1rem .48rem;
    .cell_title {
        font-size: .2rem;
        line-height: .2rem;
        font-weight: bold;
        color: #333333;
        margin-bottom: .4rem;
    }
}
.client_info_box {
    // height: 4.5rem;
    .client_logo {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: .05rem;
        // background-color: #2072fe;
        margin-right: .32rem;
        overflow: hidden;
        img{
            object-fit: cover;
        }
    }
    .client_name {
        font-size: .2rem;
        font-weight: bold;
        line-height: .2rem;
        color: #333333;
        margin-bottom: .2rem;
        .tag {
            display: inline-block;
            padding: 0 .12rem;
            background-color: #f1f2f5;
            color: #7787a2;
            font-size: .12rem;
            line-height: .24rem;
            border-radius: .24rem;
            margin-left: 8px;
        }
    }
    .cell_row {
        margin-bottom: .15rem;
        .info_item {
            min-width: 3.7rem;
            font-size: .14rem;
            line-height: .24rem;
            color: #333333;
            label {
                display: block;
                color: #666666;
            }
            .sel {
                color: #1a66ff;
                cursor: pointer;
                &:hover {
                    font-weight: bold;
                }
            }
            .box {
                .copySecret {
                    width: 85%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    cursor: pointer;
                }
                .sel {
                    margin: 0 0.05rem;
                }
            }
            &.app_secret {
                flex: 1;
            }
        }
        &.status {
            .info_item {
                min-width: auto;
                margin-right: 50px;
            }
        }
    }
}

</style>
