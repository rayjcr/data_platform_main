<template>
    <div class="pg_view">
        <div class="register_cell">
            
            <div class="authenBox">
                <!-- 根据认证信息status 1 通过 2审核中 3拒绝显示拒绝 审核中 未认证的数据 -->
                <!-- 未认证 -->
                <authen ref="authen" :type="type" :currInfo="currInfo" v-if="(!status || visible) && !loading" @save="save"></authen>
                <!-- 查看认证信息 -->
                <!-- <a-button class="back" type="primary" v-if="visible && status && status == 2" @click="visible = false">返回</a-button> -->
                <!-- 审核中 -->
                <div class="authening flex flex-column alignCenter" v-if="status && status == 2 && !loading && !visible">
                    <div class="cell_title"></div>
                    <label class="label">认证信息提交成功，等待审核！</label>
                    <div class="btnBox flex alignCenter justifyCenter mt10">
                        <label class="mr10 btnBox-item" @click="viewInfo">查看认证信息</label>
                        <label class="ml10 btnBox-item" @click="$router.push('/')">进入开放平台</label>
                    </div>
                </div>
                
                <a-spin class="loading" v-if="loading"/>
            </div>
        </div>
    </div>
</template>

<script>
import authen from './components/authen.vue'
import { registerUser,registerUserUpdate} from '@/api/login.js'
import {getLoginAuthUser,getAuthUser} from '@/api/data.js'
export default {
    data() {
        return {
            status: null,
            info:null,
            loading:false,
            type:'',
            visible:false,
            currInfo:{}
        }
    },
    components:{ authen },
    mounted(){
        this.getLoginAuthUser()
    },
    methods: {
        // 保存认证
        save(data){
            let api = null
            if(this.type=='edit'){
                api = registerUserUpdate({...data, type: 1})
            }else{
                api = registerUser({...data, type: 1})
            }
            api.then(res => {
                if(res.resultCode == 200){
                    // this.$success({
                    //     centered: true,
                    //     title: '成功',
                    //     content: '注册成功',
                    //     onOk() {
                    //     }
                    // })
                    // 清空认证表单数据
                    this.$refs.authen.init()
                    this.visible = false
                    // 获取应用授权接口认证信息
                    this.getLoginAuthUser()
                }
                
                
            })
        },
        // 获取登录人信息
        async getLoginAuthUser(){
            this.loading = true
            let res = await getLoginAuthUser()
            this.info = res.value
            // 修改应用授权认证状态
            this.status = this.info?this.info.status:null
            if(!this.status) this.type = 'add'
            else if(this.status == 2) this.type = 'view'
            else if(this.status == 3){
                 this.type = 'edit'
                 this.viewInfo()
            }else if(this.status == 1) this.$router.push('/center/yyjr')
            this.loading = false
        },
        // 查看认证信息
        async viewInfo(){
            // 获取认证信息
            await this.getAuthUser(this.info.userId)
            this.visible = true
        },
        async getAuthUser(userId){
            let res = await getAuthUser({userId})
            this.currInfo = res.value
        }
    }
}
</script>

<style lang="less" scoped>
.pg_view {
    width: 100%;
    height: 100%;
    background: url('../../assets/reset_register/register_bg.png') no-repeat;
    background-size: auto;
    background-position: bottom;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
   .cell_title {
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 20px;
    }
    .register_cell, .authenBox {
        width: 100%;
        height: 100%;
    }
    .authening{
        width: 100%;
        height: 100%;
        padding-top: 150px;
        .cell_title {
            width: 194px;
            height: 194px;
            background: url('../../assets/reset_register/success.png') no-repeat;
            background-size: 100% 100%;
            display: inline-block;
        }
        .label {
            font-size: 36px;
            color: #333333;
            font-weight: 700;
            margin-bottom: 100px;
            margin-top: -40px;
        }
        .btnBox {
            .btnBox-item{
                cursor: pointer;
                width: 200px;
                height: 56px;
                font-size: 20px;
                line-height: 56px;
                background: #ffffff;
                color: #1A66FF;
                border: 1px solid #1587F5; 
                border-radius: 56px;
                text-align: center;
                margin: 0 15px;
                &:nth-of-type(2) {
                    background: #1A66FF;
                    color: #ffffff;
                }
            }
        }
    }
    .loading{
        position: absolute;
        left: 50%;
        top: 50%;
    }
}


</style>