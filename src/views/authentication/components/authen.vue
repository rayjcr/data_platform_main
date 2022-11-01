<template>
    <div class="pg_view">
        <div class="register_cell">
            <h4 class="cell_title">第三方认证信息
                <!-- status 2 审核中 3 拒绝 -->
                <div v-if="currInfo&&currInfo.status == 3" class="certification"></div>
                <div v-if="currInfo&&currInfo.status == 2" class="certification auditing"></div>
            </h4>
            <!-- 认证被拒绝 显示拒绝理由 -->
            <div class="reson" v-if="currInfo&&currInfo.status == 3">
                <div class="content flex"><div class="title">拒绝理由: </div><div class="msg">{{currInfo.msg}}</div></div>
            </div>
            <div class="cell_form">
                <a-form :form="form">
                    <!-- 第三方认证打回编辑不可编辑类型 -->
                    <a-form-item :wrapper-col="{ span: 24 }" >
                        <label class="ant-col-7 req ant-form-item-label pr8"><span class="required">*</span>类型<span class="ml2">:</span></label>
                        <a-radio-group name="radioGroup" v-model="userType" @change="typeChange" :disabled="type == 'view' || type == 'edit'">
                            <a-radio :value="1">企业</a-radio>
                            <a-radio :value="2">个人</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <!-- 企业 -->
                    <a-form-item label="公司名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" v-if="userType == 1">
                        <a-input  :maxLength="30" v-decorator="['company',{rules: [{ required: true, whitespace: true, message: '请输入公司名称' }]}]" placeholder="请输入公司名称" :disabled="type == 'view'" />
                    </a-form-item>
                    <a-form-item label="税务识别号" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" v-if="userType == 1">
                        <a-input :maxLength="20" v-decorator="['unionId',{rules: [{ required: true, whitespace: true, message: '请输入税务识别号' },{validator: checkUnionId,message: '税务识别号格式不正确,长度为16~20位'}]}]" placeholder="请输入税务识别号" :disabled="type == 'view'" />
                    </a-form-item>
                     <a-form-item :wrapper-col="{ span: 24 }"  v-if="userType == 1">
                        <label class="ant-col-7 req ant-form-item-label pr8"><span class="required">*</span>社保统征图片<span class="ml2">:</span></label>
                        <div class="ant-col-17">
                            <upload ref="sbtz" :type="type" :maxSize="5" @handleUpload="sbTzUpload" class="sbtztp" :tip="tips['sbtz']"></upload>
                            <div class="tip" v-if="isUploadSbtz">请上传社保统征图片</div>
                        </div>
                    </a-form-item>
                     <!-- <a-form-item :wrapper-col="{ span: 24 }"  v-if="userType == 1">
                         <label class="ant-col-7 req ant-form-item-label pr8"><span class="required">*</span>上传logo<span class="ml2">:</span></label>
                        <upload ref="logo" :maxSize="2" @handleUpload="logoUpload" class="logo ant-col-17" :tip="tips['logo']"></upload>
                    </a-form-item> -->
                    <a-form-item label="负责人" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" v-if="userType == 1">
                        <a-input :maxLength="30" v-decorator="['nickname',{rules: [{ required: true, whitespace: true, message: '请输入负责人' }]}]" placeholder="请输入负责人" :disabled="type == 'view'" />
                    </a-form-item>
                    <!-- 个人 -->
                    <a-form-item label="姓名" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" v-if="userType == 2">
                        <a-input :maxLength="30" v-decorator="['nickname',{rules: [{ required: true, whitespace: true, message: '请输入姓名', }]}]" placeholder="请输入姓名" :disabled="type == 'view'" />
                    </a-form-item>
                    <a-form-item label="身份证件号" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" v-if="userType == 2">
                        <a-input :maxLength="18" v-decorator="['unionId',{rules: [{ required: true, message: '请输入身份证件号', whitespace: true },{validator: checkSfzGs,message: '身份证号码不正确'}]}]" placeholder="请输入身份证件号" :disabled="type == 'view'" />
                    </a-form-item>
                    <a-form-item  :wrapper-col="{ span: 24 }" v-if="userType == 2">
                        <label class="ant-col-7 req ant-form-item-label pr8"><span class="required">*</span>身份证件图片<span class="ml2">:</span></label>
                       <div class="ant-col-17">
                            <div class="flex" :class="type == 'view' ? 'mask' : ''">
                                <upload :maxSize="5" :type="type" ref="sfzz" @handleUpload="sfzzUpload" class="sfz" :tips="tips['sfzz']"></upload>
                                <upload :maxSize="5" :type="type" ref="sfzf" @handleUpload="sfzfUpload" class="sfz" :tips="tips['sfzf']"></upload>
                            </div>
                            <div class="tip" v-if="isUploadCard">请上传身份证照片</div>
                       </div>
                    </a-form-item>
                    <a-form-item :label="userType == 1 ? '公司简介' : '个人简介'" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                        <a-textarea :placeholder="userType == 1 ? '请输入公司简介' : '请输入个人简介'" :rows="8" :maxLength="100" v-decorator="['descripInfo', {rules: [{required: true, whitespace: true, message:`${userType == 1 ? '请输入公司简介' : '请输入个人简介'}`}]}]" @change="infoChange" :disabled="type == 'view'" />
                        <label class="len">
                            还可以输入 <span class="color_blue">{{100 - len}}</span>字
                        </label>
                    </a-form-item>
                     <!-- <a-form-item label="个人简介" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                        <a-textarea placeholder="请输入个人简介" :rows="8" :maxLength="100" v-decorator="['descripInfo', {rules: [{required: true, whitespace: true, message:'请输入个人简介'}]}]" @change="infoChange" :disabled="type == 'view'" />
                        <label class="len">
                            还可以输入
                            <span class="color_blue">{{100 - len}}</span>字
                        </label>
                    </a-form-item> -->
                    <div class="footer" v-if="type != 'view'">
                        <a-button :class="currInfo&&currInfo.status == 3 ? 'reset' : ''" type="primary" @click="onRegister">{{currInfo&&currInfo.status == 3 ? '重新认证' : '提交认证'}}</a-button>
                    </div>
                    <div class="footer" v-else>
                        <a-button class="back" type="primary" @click="$parent.visible = false">返回</a-button>
                        
                    </div>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script>
import { uploadPic } from '@/api/login.js'
import {fileUpload} from '@/api/data'
import upload from './upload.vue'
export default {
    props:{
        type:{},
        currInfo:{}
    },
    data() {
        return {
            form: this.$form.createForm(this),
            // 上传logo
            fileList:[],
            imageUrl:'',
            loading:false,
            tips:{
                'logo': '(请上传150*150的图片)',
                'sbtz': '(请上传社保统征图片)',
                'sfzz':'上传身份证正面（人像）',
                'sfzf':'上传身份证反面（国徽）',
                'person': '建议上传尺寸200*200，JPG、JPEG、PNG格式，使用直角图标，大小2M以内',
            },
            userType:1,
            len:0,
            descripInfo:null,
            isUploadCard: false,
            isUploadSbtz: false
        }
    },
    components:{
        upload
    },
    mounted(){
        // 查看编辑 回显信息
        if(this.type != 'add'){
            this.$nextTick(()=>{
                console.log(this.currInfo)
                this.userType = this.currInfo.userType
                setTimeout(()=>{
                    this.form.setFieldsValue({
                        company: this.currInfo.company || '',
                        unionId: this.currInfo.unionId,
                        nickname: this.currInfo.nickname,
                        descripInfo: this.currInfo.descripInfo,
                    })
                    this.len = this.currInfo.descripInfo.length
                    // this.descripInfo = this.currInfo.descripInfo
                    if(this.currInfo.userType == 1){
                        //  企业
                        if(this.$refs.sbtz){
                            this.$refs.sbtz.imageUrl = this.currInfo.pic1
                            this.$refs.sbtz.headImg = '/api/' +  this.$refs.sbtz.imageUrl
                        }
                         if(this.$refs.logo){
                              this.$refs.logo.imageUrl = this.currInfo.pic2
                              this.$refs.logo.headImg = '/api/' +  this.$refs.logo.imageUrl
                         }
                    }else{
                        // 个人
                        if(this.$refs.sfzz){
                             this.$refs.sfzz.imageUrl = this.currInfo.pic1
                             this.$refs.sfzz.headImg = '/api/' +  this.$refs.sfzz.imageUrl
                        }
                        if(this.$refs.sfzf){
                             this.$refs.sfzf.imageUrl = this.currInfo.pic2
                             this.$refs.sfzf.headImg = '/api/' +  this.$refs.sfzf.imageUrl
                        }
                    }
                },0)
                
            })
        }
    },
    methods: {
        init(){
            this.form.resetFields()
        },
        infoChange(e){
            this.len = e.target.value.length
        },
        // logo上传
        logoUpload(formdata){
            fileUpload(formdata).then(res => {
                this.$nextTick(() => {
                    this.$refs.logo.loading = false
                    this.$refs.logo.imageUrl = (res.value) || null
                    this.$refs.logo.headImg = '/api/' +  this.$refs.logo.imageUrl
                })
            })
        },
        // 社保统征上传
        sbTzUpload(formdata){
            uploadPic(formdata).then(res => {
                this.$nextTick(() => {
                    this.$refs.sbtz.loading = false
                    this.$refs.sbtz.imageUrl = (res.value) || null
                    this.$refs.sbtz.headImg = '/api/' +  this.$refs.sbtz.imageUrl
                })
            })
        },
        // 身份证正面
        sfzzUpload(formdata){
            uploadPic(formdata).then(res => {
                this.$nextTick(() => {
                    this.$refs.sfzz.loading = false
                    this.$refs.sfzz.imageUrl = (res.value) || null
                    this.$refs.sfzz.headImg = '/api/' +  this.$refs.sfzz.imageUrl
                })
            })
        },
        // 身份证反面
        sfzfUpload(formdata){
            uploadPic(formdata).then(res => {
                this.$nextTick(() => {
                    this.$refs.sfzf.loading = false
                    this.$refs.sfzf.imageUrl = (res.value) || null
                    this.$refs.sfzf.headImg = '/api/' +  this.$refs.sfzf.imageUrl
                })
            })
        },
        // 个人头像
        personUpload(formdata){
            fileUpload(formdata).then(res => {
                this.$nextTick(() => {
                    this.$refs.person.loading = false
                    this.$refs.person.imageUrl = (res.value) || null
                    this.$refs.person.headImg = '/api/' +  this.$refs.person.imageUrl
                })
            })
        },
        typeChange(e){
            this.$nextTick(()=>{
                 this.form.setFieldsValue({
                    unionId:null,
                    // descripInfo:''
                })
                this.descripInfo = ''
                this.len = 0
            })
           
        },
        // 检测税务识别号长度 >15 <= 20
        checkUnionId(rule, value, callback){
            if(!value) callback()
            let reg = /^.{16,20}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error("税务识别号格式不正确,长度为16~20位"));
            }
        },
        async checkSfz(e) {
            if (e.target.value) {
                await this.checkSfzGs('', e.target.value)
                // this.checkSfzCode( e.target.value, this.xsJbxx ? this.xsJbxx.id : null );
            }
        },
        // 检验身份证号码是否正确
        async checkSfzGs(rule, value, callback) {
            if(!value) callback()
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (reg.test(value)) {
                // await this.go(value.length, value);
        
                callback();
            } else {
                callback(new Error("身份证号码不正确"));
            }
        },
        onRegister(e){
            let _this = this
            e.preventDefault();
            let data = this.form.getFieldsValue()
            this.form.validateFields(err => {
                if(!err) {
                    if(this.userType == 1){
                        if(!this.$refs.sbtz.imageUrl){
                            this.isUploadSbtz = true
                            return
                        }else{
                            this.isUploadSbtz = false
                        }
                        // 企业
                        data = {
                            ...data,
                            userType:this.userType,
                            // pic2: this.$refs.logo.imageUrl,
                            pic1: this.$refs.sbtz.imageUrl,
                            userId: this.type == 'edit'?this.currInfo.userId:null,
                            status: this.type == 'edit'?2:null,
                            // descripInfo: this.descripInfo,
                        }
                    }
                    if(this.userType == 2){
                        if(!this.$refs.sfzz.imageUrl && !this.$refs.sfzf.imageUrl){
                            this.isUploadCard = true
                            return
                        }else{
                            this.isUploadCard = false
                        }
                        // 个人
                        data = {
                            ...data,
                            userType:this.userType,
                            // pic: this.$refs.person.imageUrl,
                            pic1: this.$refs.sfzz.imageUrl,
                            pic2: this.$refs.sfzf.imageUrl, 
                            userId: this.type == 'edit'?this.currInfo.userId:null,
                            status: this.type == 'edit'?2:null,
                            //  descripInfo: this.descripInfo,
                        }
                    }
                    
                    this.$emit('save',data)
                }
            })
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
    .register_cell {
        width: 1020px;
        height: 100%;
        padding-top: 60px;
        margin: 0 auto;
        .cell_title {
            font-size: 28px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            .certification {
                width: 80px;
                height: 80px;
                background: url('../../../assets/reset_register/no-pass.png') no-repeat;
                background-size: 100% 100%;
                position: absolute;
                top: 50%;
                right: 50%;
                transform: translate(260%, -50%);
                &.auditing{
                     background: url('../../../assets/reset_register/auditing.png') no-repeat;
                     background-size: 100% 100%;
                }
            }
        }
        .cell_form {
            /deep/ .ant-form-item {
                margin-bottom: 10px;
                .ant-input {
                    color: #333333;
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
                    &.reset {
                        background: #FFB600 !important;
                    }
                }   
            }
            /deep/ .ant-btn-primary[disabled] {
                background-color: #1A66FF !important;
            }
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
.reson {
    padding-left: 20%;
    .content {
        // display: inline-block;
        width: 75%;
        background: #FFF0C9;
        border: 1px solid #FFB600;
        font-size: 16px;
       line-height: 25px;
        padding: 10px 20px;
        .title{
            min-width: 80px;
        }
    }

}
.ml10 {
    margin-left: 10px !important;
}
.mb10 {
    margin-bottom:10px !important;
}
.sbtztp {
    /deep/.ant-upload.ant-upload-select-picture-card,
    /deep/.ant-upload.ant-upload-select-picture-card .ant-upload-btn{
        width: 240px;
        height: 135px;
        background: url('../../../assets/reset_register/shbxdjz.png') no-repeat;
        background-size: 100% 100%;
    }
}
.sfz{
    /deep/.ant-upload.ant-upload-select-picture-card,
    /deep/.ant-upload.ant-upload-select-picture-card .ant-upload-btn{
        width: 240px;
        height: 135px;
        background: url('../../../assets/reset_register/idCard.png') no-repeat;
        background-size: 100% 100%;
    }
    &:nth-of-type(2) {
        /deep/.ant-upload.ant-upload-select-picture-card .ant-upload-btn{
            background: url('../../../assets/reset_register/idCard_n.png') no-repeat;
            background-size: 100% 100%;
        }
    }
}
.logo{
    /deep/.ant-upload.ant-upload-select-picture-card,
    /deep/.ant-upload.ant-upload-select-picture-card .ant-upload-btn{
        width: 90px;
        height: 90px;
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
.back {
   
    box-shadow: 0px 6px 30px 0 rgba(57, 140, 249, 0.3);
    background: #1A66FF;
       
}
.msg{
    word-break: break-all;
}
.tip {
    color: #f5222d;
    font-size: 14px;
    line-height: 14px;
}
.mask {
    position: relative;
    &::before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>