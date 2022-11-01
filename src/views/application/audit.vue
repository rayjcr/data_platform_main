<template>
    <a-modal :title="modalTitle" :visible="visible" width="50%" style="min-width:500px" @cancel="cancel" destroyOnClose :maskClosable="false" :keyboard="false" centered >
        <div class="applicationBox">
           <div class="cell client_info_box flex" v-if="clientInfo">
                <div class="client_logo">
                    <img class="headImg" :src="headImg" @error="error" width="100%" height="100%"/>
                </div>
                <div class="client_info flex_1">
                    <div class="client_name">{{clientInfo.clientName}} <span class="tag">{{clientInfo.joinType == '2'?'OAuth2.0':'CAS Client'}}</span></div>
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
        </div>
        <a-form>
            <a-form-item label="审核" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <!-- 
                    modalType 上下架审核 shelves | audit 接入审核
                -->
                <a-radio-group v-model="status" v-if="modalType == 'audit'">
                    <a-radio :value="0">允许接入</a-radio>
                    <a-radio :value="1">拒绝接入</a-radio>
                </a-radio-group>
                <!-- 上架申请 -->
                <a-radio-group v-model="status" v-else>
                    <a-radio :value="0">允许上架</a-radio>
                    <a-radio :value="1">拒绝上架</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="审核意见" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-textarea v-model="opinion" :maxLength="100" placeholder="请输入审核意见" :rows="6" />
                <label class="len">
                    还可以输入
                <span class="color_blue">{{100 - (opinion?opinion.length : 0)}}</span>字
              </label>
            </a-form-item>
            <!-- <a-form-item label="是否需要回归数据" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-radio-group v-model="isBack">
                    <a-radio :value="0">是</a-radio>
                    <a-radio :value="1">否</a-radio>
                </a-radio-group>
            </a-form-item> -->
        </a-form>
        <div slot="footer">
            
            <a-button @click="cancel">关闭</a-button>
            <a-button type="primary" class="add" :loading="loading" :disabled="getDisabled()" @click="onSave">确定</a-button>
            <!-- <template v-if="modalType == 'audit'">
                <a-button type="primary" class="add" :disabled="info&&info.status == '3'" :loading="type =='refuse' && loading" @click="onSave('refuse')">拒绝</a-button>
                <a-button type="primary"  class="add" :disabled="info&&info.status == '2'" :loading="type =='pass' && loading" @click="onSave('pass')">通过</a-button>    
            </template>
            <template v-else>
                <a-button type="primary" class="add" :disabled="info&&info.publishStatus == '6'" :loading="type =='refuse' && loading" @click="onSave('refuse')">拒绝</a-button>
                <a-button type="primary"  class="add" :disabled="info&&info.publishStatus == '7'" :loading="type =='pass' && loading" @click="onSave('pass')">通过</a-button>
            </template> -->
            
        </div>
         <!-- 组织机构选择 -->
        <SelDept v-if="isShowDept" :clientId="clientId" :visible="isShowDept" :interfaceInfo="onSelInterface" @cancel="isShowDept = false"/>
    </a-modal>
</template>
<script>
import SelDept from '../index/components/selDept.vue'
export default {
    components:{
        SelDept
    },
    props:{
        visible:{},
        info:{},
        modalTitle: {},
        modalType:{},
        clientInfo:{}
    },
    data(){
        return{
            opinion:null,
            loading:false,
            type:'',
            headImg: null,
            status:0,
            isShowDept:false,
            onSelInterface:null,
            clientId:null,
        }
    },
    methods:{
        onSetDept(data, type){
            this.clientId = this.clientInfo.clientId
            if(type == 'backShow') data['showBack'] = true
            this.onSelInterface = data || null
            this.isShowDept = true
        },
        cancel(){
            this.$emit('cancel')
            this.init()
        },
        // 图片报错显示默认图
        error(){
            this.headImg = require('@/assets/default.png')
        },
        init(){
            this.opinion = null
            this.loading = false
            this.status = 0
        },
        onSave(){
            let type = null
            if(this.status == 0) type = 'pass'
            if(this.status == 1) type = 'refuse'
            this.type = type
            this.loading = true
            if(type == 'refuse' && !this.opinion){
                this.$info({
                    centered: true,
                    title: '提示',
                    content: '审核意见不能为空！',
                    onOk() {},
                })
                this.loading = false
                return
            }
            // 上架后再下架应用需进行确认提示
            if(this.modalType == 'shelves' && type == 'refuse' && this.info.publishStatus == '7'){
                this.$confirm({
                centered: true,
                title: '确认提示',
                content: '确认要下架应用吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    this.$emit('onSave',{
                        type,
                        opinion: this.opinion
                    })
                },
                onCancel: () => {
                    console.log('退出')
                },
            })
            }else{
                this.$emit('onSave',{
                    type,
                    opinion: this.opinion
                })
            }
            
        },
        getDisabled(){
            if(this.modalType == 'audit'){
                // 接入审核
                // status 1 待审核 2 审核通过 3 已拒绝
                if(this.info){
                    let {status} = this.info
                    if(status == '2' && this.status == 0) return true
                    if(status == '3' && this.status == 1) return true
                    else return false
                }
            }else{
                // 上下架审核
                if(this.info){
                    // publishStatus 5 待审核  6 已下架 7 已上架
                    let {publishStatus} = this.info
                    if(publishStatus == '7' && this.status == 0) return true
                    else return false
                    
                }
            }
        }
    },
    watch:{
        visible(){
            if(this.visible){
                this.headImg = '/api/' + this.clientInfo.logo
                // 根据info.status/publishStatus
                // if(this.info){
                //     if(this.modalType == 'audit' && this.info.status == 3) this.status = 1
                //     if(this.modalType == 'shelves' && this.info.publishStatus == 6) this.status = 1
                // }
                
                
            }
        }
    }
}
</script>
<style lang="less" scoped>
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