<template>
    <div class="pg_view">
        <!-- <h4 class="cell_title"></h4> -->
        <div class="progress">
            <div class="step_box flex justifyCenter alignCenter">
                <div class="step_item flex justifyCenter alignCenter" :class="{'active': current == item.id , 'complete': current > item.id}" v-for="item in steps" :key="item.id">
                    <div class="num"></div>
                    <div class="value">{{item.title}}</div>
                </div>
            </div>
        </div>
        <div class="forgot_cell">
            <div class="cell_form">
                <h4 class="cell_title">重置密码</h4> 
                <div class="step_cell">
                    <div class="step_cell_item" v-if="current == 0">
                        <div class="step_cell_title">输入您的登录账号</div>
                        <div class="step_cell_body">
                            <a-row type="flex" justify="center" class="mb10">
                                <a-col :span="12">
                                    <div class="input_cell flex alignCenter">
                                        <span class="w80">登录账号</span>
                                        <a-input v-model="username" placeholder="请输入登录账号" @focus="onFocus" />
                                    </div>
                                    <div class="err_tip" v-if="errTip">
                                        <span>{{errTip}}</span>
                                    </div>
                                </a-col>
                                
                            </a-row>
                            <a-row type="flex" justify="center">
                                <a-col :span="12">
                                    <div class="input_cell flex alignCenter">
                                        <span class="w80">验证码</span>
                                        <div class="codeBox">
                                            <a-input v-model="captcha" placeholder="请输入验证码" />
                                            <img class="img" :src="headImg" @click="refresh"/>    
                                        </div>
                                        
                                    </div>
                                    
                                </a-col>
                                
                            </a-row>
                            
                        </div>
                    </div>
                    <div class="step_cell_item" v-if="current == 1">
                        <div class="step_cell_title">请选择验证方式，我们已向您的手机/邮箱发送了密码重置的验证码</div>
                        <div class="step_cell_body">
                            <a-row type="flex" justify="center">
                                <a-col :span="12">
                                    <a-radio-group v-model="radioValue">
                                        <a-radio v-if="contact['email']" :style="radioStyle" :value="'email'">
                                            邮箱验证（{{contact['email']}}）
                                        </a-radio>
                                        <a-radio v-if="contact['mobile']" :style="radioStyle" :value="'mobile'">
                                            手机验证（{{contact['mobile']}}）
                                        </a-radio>
                                    </a-radio-group>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                    <div class="step_cell_item" v-if="current == 2">
                        <div class="step_cell_title">请填写验证码，重置密码</div>
                        <div class="step_cell_body">
                            <a-row type="flex" justify="center">
                                <a-col :span="12">
                                    <a-form class="form_cell" :form="form">
                                        <a-form-item label="验证码" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
                                            <a-input v-decorator="['code', { rules: [{ type: 'string', message: '请输入验证码' }] }]" placeholder="请输入验证码" />
                                        </a-form-item>
                                        <a-form-item label="新密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
                                            <a-input type="password" v-decorator="['password',{rules: [{ pattern: /^[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/, message: '请输入新密码! 数字字母或符号，长度6-20' }]}]" placeholder="请输入新密码！数字字母或符号，长度6-20" />
                                        </a-form-item>
                                        <a-form-item label="确认新密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
                                            <a-input type="password" v-decorator="['confirmpassword', {rules:[{message: '两次密码输入不一致', validator: onHandlePassword }]}]" placeholder="请再次确认新密码" />
                                        </a-form-item>
                                    </a-form>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                    <div class="step_cell_item" v-if="current == 3">
                        <div class="step_cell_title">
                            <div class="success"></div>
                        </div>
                        <div class="step_cell_body">
                            <a-row type="flex" justify="center">
                                <a-col :span="12">
                                    <div class="success_box">
                                        <div class="title">密码重置成功！</div>
                                        <div>密码已重置，{{count}} 秒后进入 <span class="link" @click="toLogin">重新进入</span></div>
                                    </div>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                    <div class="step_next flex justifyCenter alignCenter">
                        <a-button type="primary" :loading="loading" @click="onNext">{{ btnMsg }}</a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { forgetPassword, sendUserEmail, sendUserMobile, resetPassword } from '@/api/login.js'
import Identify from '@/components/identity/index.vue';
import { getEncryptCode } from '@/api/common.js'
export default {
    components:{
        Identify
    },
    data(){
        return {
            current: 0,
            steps: [
                { id: 0, title: '账号信息' },
                { id: 1, title: '验证方式' },
                { id: 2, title: '密码重置' },
                { id: 3, title: '完成' },
            ],
            username: undefined,
            radioStyle: {
                display: 'block',
                height: '40px',
                lineHeight: '40px',
            },
            radioValue: 'email',
            form: this.$form.createForm(this),
            errTip: null,
            contact: {
                email: '',
                mobile: ''
            },
            count: 5,
            timer: null,
            loading: false,
            identifyCode:null,
            identifyCodes:[],
            headImg:'/api/auth/kaptcha.jpg',
            captcha:null
        }
    },
    computed: {
        btnMsg(){
            return this.current == 3 ? '完成' : '下一步'
        }
    },
    mounted(){
        this.identifyCode = "";
        this.makeCode(this.identifyCode, 4);
    },
    methods: {
        // 刷新验证码
        refresh(){
             this.headImg =  '/api/auth/kaptcha.jpg?id=' + (new Date() + Math.floor(Math.random() * 24))
        },
        //验证码abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        refreshCode() {
            this.identifyCode = "";
            this.makeCode(this.identifyCodes, 4);
        },
        makeCode(o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[
                this.randomNum(0, this.identifyCodes.length)
                ];
            }
            console.log(this.identifyCode);
        },
        onNext(){
            if(this.current == 3) {
                return
            }else{
                switch(this.current){
                    case 0: 
                        this.onCheckUser()
                        break;
                    case 1: 
                        this.sentCode()
                        break;
                    case 2: 
                        this.resetPwd()
                        break;
                    case 3:
                        this.toLogin()
                        break;
                    default:
                        break;
                }
            }
        },
        onHandlePassword(rule, value, callback){
            if (value) {
                let password = this.form.getFieldValue('password')
                if(value === password) {
                    if(callback) callback()
                }else {
                    if(callback) callback(new Error("两次密码输入不一致"))
                }
            }
        },
        onFocus(){
            if(this.errTip) this.errTip = null
        },
        onCheckUser(){
            if(!this.username){
                this.errTip = '请输入登录账号'
                return
            }
            forgetPassword({
                username:  getEncryptCode(this.username),
                captcha: this.captcha,
            }).then(res => {
                if(res.resultCode == '200'){
                    this.contact = res.value
                    this.radioValue = Object.keys(res.value)[0]
                    this.current++
                }
            }).catch(err => {
                if(err.response.status == 400){
                    this.errTip = err.response.data.resultMessage
                }
            })
        },
        sentCode(){
            this.loading = true
            let reqMethod = this.radioValue == 'email' ? sendUserEmail : sendUserMobile
            reqMethod({ username: getEncryptCode(this.username) }).then(res => {
                this.loading = false
                this.current++
            })
            
        },
        resetPwd(){
            this.loading = true
            let data = this.form.getFieldsValue()
            this.form.validateFields(err => {
                if(!err) {
                    resetPassword({
                        code: data.code,
                        email: getEncryptCode(this.contact[this.radioValue]),
                        password: getEncryptCode(data.password),
                        username: getEncryptCode(this.username)
                    }).then(res => {
                        this.loading = false
                        this.current++
                        this.timer = setInterval(() => {
                            if(this.count <= 0){
                                window.location.href = this.common.url + "/casLogin";
                                clearInterval(this.timer)
                                return
                            }
                            this.count--
                        }, 1000)
                    }).catch(err=>{
                        this.loading = false
                    })
                }
            })
        },
        toLogin(){
            window.location.href = this.common.url + "/casLogin";
        }
    },
    beforeDestroy(){
        clearInterval(this.timer)
    }
}
</script>

<style lang="less" scoped>
.pg_view {
    width: 100%;
    height: 100%;
    background: url('../../assets/reset_register/reset_bg.png') no-repeat;
    background-size: 100% 100%;
    background-position: bottom;
    .forgot_cell {
        width: 900px;
        height: 100%;
        padding-top: 120px;
        margin: 0 auto;
        .cell_title {
            font-size: 36px;
            font-weight: 700;
            text-align: center;
            background: #FAFAFA;
            margin-bottom: 40px;
        }
    }
}

.progress {
    width: 100%;
    margin-bottom: 30px;
}   
.step_box {
    width: 100%;
    height: 120px;
    background: #FAFAFA;
    .step_item {
        font-size: 24px;
        line-height: 24px;
        color: #999999;
        font-weight: bold;
        margin-right: 100px;
        padding-left: 20px;
        position: relative;
        .num {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            margin-right: 20px;
            text-align: center;
            line-height: 20px;
            background: #DADFE6 url('../../assets/reset_register/account.png') no-repeat;
            background-size: auto;
            background-position: center;
        }
        &::after {
            content: "";
            width: 80px;
            height: 0;
            border-bottom: 2px solid #E6E6E6;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(-100%, -50%);
        }
        &.active {
            color: #168DFF;
            .num {
                background-color: #168DFF !important;
                box-shadow: 0px 6px 20px 0 rgba(22, 141, 255, 0.3);
            }
        }
        &.complete {
            color: #333333;
            .num {
                background-color: #B4DAFF !important;
            }
        }
        &:nth-of-type(2) {
            .num {
                background: #DADFE6 url('../../assets/reset_register/validation.png') no-repeat;
                background-size: auto;
                background-position: center;
            }
        }
        &:nth-of-type(3) {
            .num {
                background: #DADFE6 url('../../assets/reset_register/resetPwd.png') no-repeat;
                background-size: auto;
                background-position: center;
            }
        }
        &:nth-of-type(4) {
            .num {
                background: #DADFE6 url('../../assets/reset_register/complete.png') no-repeat;
                background-size: auto;
                background-position: center;
            }
        }
        &:first-child {
            padding-left: 0;
            &::after {
                border: 0;
            }
        }
    }
}
.step_cell {
    padding: 0 50px;
    .step_cell_item {
        margin-bottom: 50px;
        .step_cell_title {
            font-size: 16px;
            color: #707070;
            padding: 10px 0 0;
            // border-bottom: 1px solid #c1c1c1;
            text-align: center;
            .success {
                display: inline-block;
                width: 194px;
                height: 194px;
                border-radius: 50%;
                background: url('../../assets/reset_register/success.png') no-repeat;
                background-size: 100% 100%;
                margin-bottom: -40px
            }
        }
        .step_cell_body {
            padding: 20px 50px;
            .input_cell {
                span {
                    width: 100px;
                    min-width: 100px;
                    font-size: 16px;
                    color: #333333;
                    display: inline-block;
                }
            }
        }
    }
    .step_next {
        /deep/ .ant-btn {
            width: 200px;
            height: 56px !important;
            font-size: 20px;
            border-radius: 56px !important;
            box-shadow: 0px 6px 30px 0 rgba(57, 140, 249, 0.3);
        } 
    }
}
.err_tip {
    font-size: 12px;
    line-height: 17px;
    padding: 5px 70px;
    color: red;
}
.form_cell {
    .tip {
        font-size: 14px;
        padding-left: 30px;
        margin-bottom: 10px;
    }
    /deep/ .ant-form-item {
        margin-bottom: 10px;
        .ant-form-item-label label {
            color: rgba(0,0,0,0.65) !important;
        }
        .ant-input {
            color: #333333;
        }
    }
}
.success_box {
    text-align: center;
    font-size: 16px;
    color: #707070;
    .title {
        font-size: 36px;
        font-weight: 700;
        color: #333333;
        margin: 0 0 40px;
    }
    .link {
        color: #6699FF;
        margin-left: 10px;
        cursor: pointer;
    }
}
.codeBox{
    display: flex;
}
.w80{
    width: 80px;
}
</style>