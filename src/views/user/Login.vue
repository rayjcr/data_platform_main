<template>
  <div class="main">
    <div class="login">
      <label class="login_name">登录</label>
      <label class="login_err_tip" v-if="login_err_tip_status">{{login_err_tip}}</label>
      <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input size="large" type="text" placeholder="请输入用户名" v-decorator="[
                    'username',
                    {rules: [{ required: true, message: '请输入用户名' }]}
                  ]"
            @change="yhmChange">
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input size="large" type="password" autocomplete="false" placeholder="请输入密码" v-decorator="[
                    'password',
                    {rules: [{ required: true, message: '请输入密码' }]}
                  ]" @change="mmChange">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <a-form-item style="margin-top:35px">
          <a-button size="large" type="primary" htmlType="submit" class="login-button">确定</a-button>
        </a-form-item>
      </a-form>
    </div>


  </div>
</template>

<script>
  import md5 from 'md5'
  import {
    mapActions
  } from 'vuex'
  import {
    timeFix
  } from '@/utils/util'
  import * as API from '@/api/login'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  export default {
    data() {
      return {
        form: this.$form.createForm(this),
        login_err_tip: '', //登录错误提示,
        login_err_tip_status: false, //控制登录错误提示显隐
      }
    },
    created() {
    },
    methods: {
      handleSubmit(e) {
        var that = this;
        e.preventDefault()
        //var that = this;
        const formData = this.form.getFieldsValue();
        this.form.validateFields(err => {
          if (!err) {
            API.login(formData)
              .then(res => {
                    const time = new Date(); //获取时间
                    const cahe_time =30 * 60 * 1000; //设置缓存时间
                    localStorage.setItem('login_all',  JSON.stringify(res.data));
                    localStorage.setItem('login_user',  JSON.stringify(res.data.user));
                    localStorage.setItem('permissions',JSON.stringify(res.data.permissions))
                    localStorage.setItem('token', res.data.token);
                    let obj={
                        time:Date.now(),
                        expire:cahe_time
                    };
                    localStorage.setItem('time',JSON.stringify(obj));
                    that.$router.push({path:'/'})
                
              }).catch(e=>{
                this.$error({
                  centered: true,
                  title: '失败',
                  content: e.response.data.resultMessage,
                  onOk() {}
                })
              })
          }
        })
      },
      yhmChange(value) {
        //检测输入内容(获取焦点隐藏错误提示)
        this.login_err_tip_status = false;
      },
      mmChange(value){
        //检测输入内容(获取焦点隐藏错误提示)
        this.login_err_tip_status = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
      margin-bottom: 35px;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }

  .login {
    width: 400px;
    // height: 500px;
    background: #fff;
    border-radius: 4px;
    padding: 10px 30px;
    position: absolute;
    right: 300px;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    -ms-transform:translateY(-50%);
    -moz-transform:translateY(-50%);
  }

  .login_name {
    font-size: 25px;
    font-weight: bold;
    display: block;
    line-height: 50px;
    height: 50px;
    text-align: center;
    margin: 10px 0 30px 0;
  }

  .login_err_tip {
    color: red;
    line-height: 40px;
    display: block;
    height: 40px;
  }
</style>
