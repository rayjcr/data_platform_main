<template>
  <div ref="modal">
    <a-modal :title="title" :visible="visible" style="min-width:500px" @cancel="exit" :maskClosable='false' :keyboard='false'
      centered :footer="null" :getContainer="()=>this.$refs.modal">
      <!-- 绑定手机 -->
      <a-form :form="form" v-if="info.bm == 'bdsj'">
        <a-form-item style="margin-bottom:20px" :wrapper-col="{ span: 24 }">
          <a-input v-decorator="['mobile',{rules: [{ required: true,pattern: /^1[34578]\d{9}$/ , message: '请输入正确的手机号码！' }]}]"
            allow-clear placeholder="请输入手机号码" autocomplete="off" />
        </a-form-item>
        <a-form-item style="margin-bottom:20px;position: relative;" :wrapper-col="{ span: 24 }">
          <a-input v-decorator="['code',{rules: [{ required: true, message: '请输入验证码！' }]}]" placeholder="请输入验证码"
            autocomplete="off" style="padding-right: 100px;" />
          <label class="djs" :class="[status == 0?'fsq':'fsh']" @click="sendCode">{{status == 0?'获取验证码':'重新发送 ('+ time + 's)'}}</label>
        </a-form-item>
        <div class="alignCenter">
          <button class="btn-change" type="button" @click="exit">取消</button>
          <button class="btn-change btn_blue" :class="[!form.getFieldValue('mobile')||!form.getFieldValue('code')?'jy':'']"
            type="button" @click="save">确定</button>
        </div>
      </a-form>
      <!-- 修改密码 -->
      <a-form :form="form" v-if="info.bm == 'xgmm'">
        <a-form-item label="旧密码:" password style="margin-bottom:20px;position: relative;" :label-col="{ span: 4 }"
          :wrapper-col="{ span: 19 }">
          <a-input :type="close?'password':'text'" v-decorator="['jmm',{rules: [{ required: true , message: '请输入旧密码！' }]}]" allow-clear placeholder="请输入旧密码"
            autocomplete="off" />
          <span class="iconfont jmm" v-html="close?'&#xe61f;':'&#xe6cc;'"  @click="close = !close"></span>
        </a-form-item>
        <a-form-item label="新密码:" password style="margin-bottom:20px;position: relative;" :label-col="{ span: 4 }" 
          :wrapper-col="{ span: 19 }">
          <a-input :type="close1?'password':'text'" v-decorator="['xmm',{rules: [{ required: true, message: '至少6个字符，区分大小写，字母、数字组成' },{validator: handleConfirmPass1}]}]" allow-clear placeholder="请输入新密码"
            autocomplete="new-password" />
          <span class="iconfont xmm" v-html="close1?'&#xe61f;':'&#xe6cc;'" @click="close1 = !close1"></span>
          <!-- <span class="tip" v-if="!form.getFieldValue('xmm')">{{message}}</span> -->
        </a-form-item>
        <a-form-item label="确认密码:" password style="margin-bottom:20px" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
          <a-input type="password" v-decorator="['qrmm',{rules: [{ required: true,message: '请输入密码！'},{validator: handleConfirmPass}]}]" allow-clear placeholder="请输入密码"
            autocomplete="off" />
        </a-form-item>
        <div class="alignCenter">
          <button class="btn-change" type="button" @click="exit">取消</button>
          <button class="btn-change btn_blue" :class="[!form.getFieldValue('jmm')||!form.getFieldValue('xmm')||!form.getFieldValue('qrmm')?'jy':'']"
            type="button" @click="save">确定</button>
        </div>
      </a-form>
      <!-- 绑定邮箱 -->
       <a-form :form="form" v-if="info.bm == 'bdyx'">
          <a-form-item label="邮箱地址:" password style="margin-bottom:20px;position: relative;" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 19 }">
            <div class="flex alignCenter mb10 email">
              <a-input v-decorator="['email',{rules: [{ required: true, message: '请输入邮箱' },{ type: 'email', message: '电子邮箱格式错误！' }]}]" placeholder="请输入邮箱" />
              <a-button class="ml10" type="primary" :disabled="isSent" @click="sendCode">{{sentMsg}}</a-button>
            </div>
          </a-form-item>
          <a-form-item label="验证码:" password style="margin-bottom:20px;position: relative;" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 19 }">
            <a-input v-decorator="['emailCode',{rules: [{ required: true, message: '请输入验证码' }]}]" placeholder="请输入验证码" />
          </a-form-item>
        <div class="alignCenter">
          <button class="btn-change" type="button" @click="exit">取消</button>
          <button class="btn-change btn_blue" :class="[!form.getFieldValue('email')||!form.getFieldValue('emailCode')?'jy':'']"
            type="button" @click="save">确定</button>
        </div>
      </a-form> 
    </a-modal>
  </div>

</template>

<script>
import {  sentEmailCode } from '@/api/login.js'
import { getEncryptCode } from '@/api/common.js'
  // 验证码倒计时
  var num = 60;
  export default {
    props: {
      visible: {
        default: false
      },
      info: {
        default: String
      },
      type:{
        default: String
      }
    },
    data() {
      return {
        title: '',
        form: this.$form.createForm(this),
        status: 0,
        time: num,
        close: true,
        close1: true,
        message:'6-20个字符，区分大小写，字母、数字、符号组成',
        sentMsg: '发送验证码',
        count: 60,
        isSent: false,
        timer: null
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.form.resetFields()
        this.sentMsg = '发送验证码'
        this.isSent = false
        clearInterval(this.timer)
        this.count = 60
      },
      handleConfirmPass(rule, value, callback) {
        let qrmm = this.form.getFieldValue('qrmm')
        let xmm = this.form.getFieldValue('xmm')
        if (qrmm && xmm && xmm !== qrmm) {
            callback('两次密码输入不一致！')
        }
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
      },
      handleConfirmPass1(rule, value, callback) {
        callback()
      },
      exit() {
        this.init()
        this.$emit('exit')
      },
      mmqd(sValue){
        var modes = 0;
        		//正则表达式验证符合要求的
        		if(sValue.length < 1) return modes;
        		if(/\d/.test(sValue)) modes++; //数字
        		if(/[a-z]/.test(sValue)) modes++; //小写
        		if(/[A-Z]/.test(sValue)) modes++; //大写  
        		if(/\W/.test(sValue)) modes++; //特殊字符
        
        		//逻辑处理
        		switch(modes) {
        			case 1:
        				return 1;
        				break;
        			case 2:
        				return 2;
        				break;
        			case 3:
        			case 4:
        				return sValue.length < 10 ? 3 : 4
        				break;
        		}
        		return modes;
      },
      sendCode() {
        let email = this.form.getFieldValue('email')
          if(!email){
              this.$warning({
                  centered: true,
                  title: '提示',
                  content: '请输入邮箱',
                  onOk() {
                  }
              })
              return 
          }
          email = getEncryptCode(email)
          sentEmailCode({ email }).then(res => {
              if(res.resultCode == 200){
                  this.sentMsg = (--this.count) + 's后再次发送'
                  this.isSent = true
                  this.timer = setInterval(() => {
                      if(this.count <= 0){
                          this.sentMsg = '发送验证码'
                          this.isSent = false
                          clearInterval(this.timer)
                          this.count = 60
                          return
                      }
                      this.count--
                      this.sentMsg = this.count + 's后再次发送'
                  }, 1000)
              }
              
          })
      },
      save() {
        let form = this.form.getFieldsValue()
        if (form.mobile && form.code && this.info.bm == 'bdsj' || form.jmm && form.xmm && form.qrmm && this.info.bm == 'xgmm' || form.email && form.emailCode&& this.info.bm == 'bdyx') {
          this.form.validateFields(err => {
            if (!err) {
              let data = this.form.getFieldsValue()
              this.$emit('save',data)
              this.init()
            }

          })
        }
        
        
      }
    },
    watch: {
      visible() {
        if (this.visible) {
          this.title = this.info.mc
          if(this.type == 'edit'){
            // 编辑
            this.$nextTick(()=>{
              this.form.setFieldsValue(this.info.form)
              console.log(this.info)
            })
           
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped="scoped">
  /deep/.ant-modal-header {
    background: #F3F5F7;
    border-radius: 15px 15px 0 0;
    border: 0;
  }

  /deep/.ant-modal-content {
    border-radius: 15px;
  }

  /deep/.ant-modal-title {
    font-weight: 600;
    color: #333;
  }

  /deep/.has-error .ant-input,
  .has-error .ant-input:hover {
    border-color: #FF7C13;
    border-width: 2px;
  }

  /deep/.has-error .ant-form-explain,
  .has-error .ant-form-split {
    color: #FF7C13;
    font-size: 15px;
    padding-left: 20px;
    margin-top: 5px;
  }

  /deep/.has-error .ant-input:not([disabled]):hover {
    border-color: #FF7C13;
  }

  /deep/.has-error .ant-input:focus {
    border-color: #FF7C13;
  }

  /deep/.ant-form-item-label label {
    line-height: 50px;
    font-weight: 600;
  }

  input {
    border-radius: 25px !important;
    padding: 0 20px;
    line-height: 50px;
    height: 50px;
    font-size: 16px;
  }

  .alignCenter {
    text-align: center;
  }

  .btn-change {
    border: 0;
    border-radius: 20px;
    line-height: 40px;
    padding: 0 15px;
    outline: 0;
    cursor: pointer;
    margin-left: 15px;
    width: 100px;
    color: #666666;
    background: #EFF1F3;
    font-size: 16px;
  }

  .btn_blue {
    background: #168DFF;
    color: #fff;
  }

  .djs {
    position: absolute;
    right: 0;
    top: -15px;
    display: block;
    line-height: 50px;
    padding-right: 20px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
  }

  .fsq {
    color: #168EFF;
  }

  .fsh {
    color: #CCCCCC;
  }

  .jy {
    background: #8AC6FF;
  }

  .jmm,
  .xmm{
    position: absolute;
    width: 50px;
    line-height: 50px;
    font-size: 24px;
    right: 10px;
    text-align: center;
    color: #9A9A9A;
  }
  .tip{
    color: #ccc;
    display: block;
  }
  .email{
    position: relative;
    button{
      position: absolute;
      right: 10px;
      background: transparent;
      box-shadow: none;
      color: #1890ff;
      text-shadow: none;
    }
    .ant-btn-primary.disabled,
    .ant-btn-primary[disabled],
    .ant-btn-primary.disabled:hover,
    .ant-btn-primary[disabled]:hover,
    .ant-btn-primary.disabled:focus,
    .ant-btn-primary[disabled]:focus,
    .ant-btn-primary.disabled:active,
    .ant-btn-primary[disabled]:active,
    .ant-btn-primary.disabled.active,
    .ant-btn-primary[disabled].active{
       color: #1890ff!important;
       background: transparent!important;
    }
  }
</style>
