<template>
    <div class="pg_view">
        <div class="register_cell" v-if="!registerComplete">
            <h4 class="cell_title">开放平台账号注册</h4>
            <div class="cell_form">
                <a-form :form="form">
                    <a-form-item label="账号" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }" >
                        <a-input :maxLength="20" v-decorator="['username',{rules: [{ required: true, message: '请输入账号,6～12位字母或数字' },{pattern: /^[A-Za-z0-9]{6,12}$/, message: '请输入账号,6～12位字母或数字' }]}]" placeholder="请输入账号,6～12位字母或数字" />
                    </a-form-item>
                    <a-form-item label="密码" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }" >
                        <a-input type="password" :maxLength="20" v-decorator="['password',{rules: [{ required: true, message: '设置密码,8～20位数字或字母' },{ pattern: /^[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,20}$/, message: '设置密码,8～20位数字或字母' }]}]" placeholder="设置密码,8～20位数字或字母" />
                    </a-form-item>
                    <a-form-item label="确认密码" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }" >
                        <a-input type="password" :maxLength="20" v-decorator="['confirmpassword', {rules:[{ required: true, message: '请再次确认密码' },{ validator: onHandlePassword,message: '两次密码输入不一致' }]}]" placeholder="请再次确认密码" />
                    </a-form-item>
                    <a-form-item label="手机号" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }" >
                        <a-input v-decorator="['mobile',{rules: [{ required: true, message: '请输入手机号' },{ pattern: /^1[34578]\d{9}$/ , message: '手机号码格式错误！' }]}]" :maxLength="11" placeholder="请输入手机号" />
                    </a-form-item>
                    <a-form-item label="邮箱" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }" >
                        <div class="flex alignCenter mb10">
                            <a-input  :maxLength="50" v-decorator="['email',{rules: [{ required: true, message: '请输入邮箱' },{ type: 'email', message: '电子邮箱格式错误！' }]}]" placeholder="请输入邮箱" />
                            <a-button class="ml10" type="primary" :disabled="isSent" @click="onSent">{{sentMsg}}</a-button>
                        </div>
                    </a-form-item>
                    <a-form-item label="邮箱验证码" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }" >
                        <a-input v-decorator="['tmpCode',{rules: [{ required: true, message: '请输入邮箱中接收到的验证码' }]}]" placeholder="请输入邮箱中接收到的验证码" />
                    </a-form-item>
                    <div class="footer">
                        <a-button type="primary" @click="onRegister">注册</a-button>
                    </div>
                </a-form>
            </div>
        </div>
        <div class="register_cell flex flex-column alignCenter" v-else>
            <div class="success_img"></div>
            <div class="tip">注册成功</div>
            <div class="success_box"><span class="seconds">{{turnSeconds}}</span>秒后自动进入开放平台 </div>
            <div class="footer">
                <a-button type="primary" @click="toUrl">完成</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import {  sentEmailCode, creatUser } from '@/api/login.js'
import { getEncryptCode } from '@/api/common.js'
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            userType:'1',
            len:0,
            sentMsg: '发送验证码',
            count: 60,
            isSent: false,
            timer: null,
            timer2: null,
            registerComplete: false,
            turnSeconds: 5
        }
    },
    methods: {
        onHandlePassword(rule, value, callback){
            if(!value) callback()
            if (value) {
                let password = this.form.getFieldValue('password')
                if(value === password) {
                    callback()
                }else {
                    callback(new Error("两次密码输入不一致"))
                }
            }
        },
        onSent(){
            let email = this.form.getFieldValue('email')
             // 触发表单验证去掉弹窗提示
            // 邮箱未通过验证 return
            this.form.validateFields(['email'], (errors) => {
               if(!errors){
                    this.isSent = true
                    email = getEncryptCode(email)
                    sentEmailCode({ email }).then(res => {
                        if(res.resultCode == 200){
                            this.sentMsg = (--this.count) + 's后再次发送'
                            
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
                        
                    }).catch(err=>{
                        if(err.response.status == 500){
                            this.isSent = false
                        }
                    })
               }
            })
            
        },
        onRegister(e){
            let _this = this
            e.preventDefault();
            let data = this.form.getFieldsValue()
            this.form.validateFields(err => {
                if(!err) {
                    /**
                     *  type
                     *  0  开发商
                        1  系统用
                        2  教师
                        3  学生
                    */
                    //注册账号 用户名加密
                    data = {
                        ...data,
                        username: getEncryptCode(data.username),
                        password: getEncryptCode(data.password),
                        confirmpassword: getEncryptCode(data.confirmpassword),
                        mobile: getEncryptCode(data.mobile),
                        email: getEncryptCode(data.email),
                    } 
                    creatUser({...data, type: 0}).then(res => {
                        this.registerComplete = true
                        this.timer2 = setInterval(() => {
                            if(this.turnSeconds <= 0){
                                clearInterval(this.timer2)
                                this.toUrl()
                                return
                            }
                            this.turnSeconds--
                        }, 1000)
                    })
                }
            })
        },
        toUrl(){
            window.location.href = this.common.url + "/casLogin";
        }
    }
}
</script>

<style lang="less" scoped>
.pg_view {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background: url('../../assets/reset_register/register_bg.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .register_cell {
        width: 1020px;
        height: 100%;
        padding-top: 120px;
        margin: 0 auto;
        .cell_title {
            font-size: 36px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 60px;
        }
        .cell_form {
            /deep/ .ant-form-item {
                margin-bottom: 20px;
                .ant-input {
                    color: #333333;
                }
                label {
                    font-size: 16px;
                }
            }
        }
        .footer {
            width: 100%;
            text-align: center; 
            margin-top: 60px; 
            padding-bottom: 20px;
            /deep/ .ant-btn {
                width: 200px;
                height: 56px !important;
                font-size: 20px;
                border-radius:  56px !important;
                box-shadow: 0px 6px 30px 0 rgba(57, 140, 249, 0.3);
            }   
        }
        /deep/ .ant-btn-primary[disabled] {
            background-color: #1890ff !important;
        }
    }
    input:-webkit-autofill {
		// -webkit-text-fill-color: #ededed !important;
		box-shadow: 0 0 0px 1000px transparent inset !important;
		background-color: transparent;
		background-image: none;
		transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
	}
}
.ml10 {
    margin-left: 10px !important;
}
.mb10 {
    margin-bottom:10px !important;
}
.sbtztp,
.sfz{
    /deep/.ant-upload.ant-upload-select-picture-card{
        width: 240px;
        height: 150px;
    }
}
.pr8{
    padding-right: 8px;
}
.required{
    font-size: 14px;
    color: #f5222d;
    margin-right: 4px;
    font-family: SimSun;
    line-height: 1;
}
.req{
    color: rgba(0, 0, 0, 0.85);
}
.ml2{
    margin-left: 2px;
}
.flex{
    display: flex;
}
.success_img {
    width: 194px;
    height: 194px;
    background: url('../../assets/reset_register/success.png') no-repeat;
    background-size: 100% 100%;
    display: inline-block;
}
.tip {
    font-size: 36px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 40px;
}
.success_box {
    font-size: 16px;
    color: #707070;
    .seconds {
        color: #E86542;
    }
}
</style>