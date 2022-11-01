<template>
    <!-- 添加新应用 -->
    <div class="addYyBox">
      <div class="addYyForm">
          <div class="addYyForm-head">{{title}}</div>
          <div class="addYyForm-content">
            <a-form :form="form">
                <a-form-item label="应用名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-input
                    :maxLength="20"
                    v-decorator="['clientName',{rules: [{ required: true, message: '请输入应用名称！' }]}]"
                    placeholder="请输入应用名称"
                  />
                </a-form-item>
                <a-form-item label="应用图标" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" required>
                  <div class="flex">
                    <a-upload
                      name="avatar"
                      ref="upload"
                      list-type="picture-card"
                      class="avatar-uploader"
                      :show-upload-list="false"
                      accept="image/*"
                      :file-list="fileList"
                      :beforeUpload="beforeUpload"
                  >
                          <img v-if="imageUrl" :src="'/api'+imageUrl" alt="avatar" width="100"/>
                          <div v-else>
                              <a-icon :type="loading ? 'loading' : 'plus'" class="icon"/>
                              
                          </div>
                  </a-upload>
                  <div class="upload-tsxx flex alignCenter justifyCenter">(请上传150*150像素图片)</div>
                  </div>
                  
                </a-form-item>
                <!-- 2022-3-2 新增 应用级别 应用对象-->
                <!-- 学校应用创建不需要审核，自动通过 -->
                <a-form-item label="应用级别" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                    <a-radio-group v-model="levelType" :disabled="type == 'edit'" @change="levelChange">
                      <a-radio :value="1">局端应用</a-radio>
                      <a-radio :value="2">学校应用</a-radio>
                    </a-radio-group>
                 </a-form-item> 
                 <a-form-item label="授权对象" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-show="levelType == 2">
                    <div class="application">
                        <div class="schoolBox">
                            <!-- 
                              局端采购 局内部门 + 学校
                              学校自购 学校 必填
                             -->
                             <a-select mode="multiple" show-search option-filter-prop="children" :filter-option="filterOption" v-decorator="['school',levelType == 2?{rules: [{ required: true, message: '请选择学校！' }]}:{}]" allowClear placeholder="请选择学校" :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}">
                                <a-select-option v-for="(item, index) in list" :key="index" :value="item.id">
                                    {{item.title}}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                 </a-form-item>
                 <!-- 
                   是否单点认证 
                   -----------------是-------------
                   1.接入方式、服务域名、首页地址 必填
                   -----------------否-------------
                   1.接入方式、服务域名、首页地址 隐藏
                   2.接入方式 传 OAuth2.0(推荐)
                   3.服务域名、首页地址不传
                   isClientType() 判断单点认证 是 否
                  -->
                 <a-form-item label="是否单点认证" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-radio-group v-decorator="['clientType',{initialValue:1}]" @change="clientTypeChange">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="2">否</a-radio>
                </a-radio-group>
                </a-form-item> 
                <a-form-item label="接入方式" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-if="isClientType()">
                  <a-radio-group v-decorator="['joinType',{rules: [{ required: true,  message: '请选择接入方式' }]},{initialValue:2}]">
                    <a-radio :value="2">OAuth2.0(推荐)</a-radio>
                    <a-radio :value="1">CAS Client</a-radio>
                </a-radio-group>
                </a-form-item>
                <a-form-item label="服务域名" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-if="isClientType()">
                  <a-input v-decorator="['serviceUrl',{rules: [{ required: true, pattern: '[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?', message: '请输入服务域名' }]}]" placeholder="请输入应用主域名，如open.hzgsedu.cn" />
                </a-form-item>
                <a-form-item label="首页地址" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-if="isClientType()">
                  <a-input v-decorator="['loginUrl',{rules: [{ required: true, message: '请输入服务域名' }]}]" placeholder="请输入应用主页地址，如http://open.hzgsedu.cn/index" />
                  <!-- <a-input v-decorator="['loginUrl',{rules: [{ required: true, pattern: 'http[s]?://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?', message: '请输入首页地址！' }]}]" placeholder="请输入应用主页地址，如http://open.hzgsedu.cn/index" /> -->
                </a-form-item>
                <a-form-item label="IP白名单" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                    <a-textarea v-decorator="['ipStr']" :placeholder="`留空表示无IP限制\n添加IP白名单后，只有白名单中的IP可访问服务\n如:192.168.0.1,192.168.0.2, 多个IP请逗号隔开`" :rows="4"/>
                </a-form-item>
                <a-form-item label="应用简介" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                  <a-textarea placeholder="请输入应用简介" maxlength="200" :rows="10" v-model="clientComment" />
                  <label class="len">
                    还可以输入
                    <span class="color_blue">{{len - (clientComment?clientComment.length : 0)}}</span>字
                  </label>
                </a-form-item>
                <a-form-item label="应用审核记录" class="flex audit" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-if="type == 'edit'">
                    <div class="timeLine">
                        <a-timeline>
                          <a-timeline-item v-for="(item,index) in log" :key="index">
                            <div slot="dot" class="status" >
                              {{(item.status == 1 || item.status == 5)?'提交':((item.status == 2 || item.status == 7)?'通过':((item.status == 3 || item.status == 6)?'拒绝':''))}}
                            </div>
                            <!-- 
                              status
                              -------------应用申请------------
                              0 暂存(不进流程)
                              1 提交
                              2 管理员审核 通过
                              3 管理员审核 拒绝
                              -------------应用上架申请------------
                              5 待审核
                              6 管理员审核 拒绝
                              7 管理员审核 通过
                            -->
                            <div class="color_3" v-if="item.status == 1">用户提交了应用接入申请</div>
                            <div class="color_3" v-if="item.status == 2">
                              <span>{{item.nickname}}通过了应用接入申请</span>
                              <span class="success">同意</span>
                            </div>
                            <template v-if="item.status == 3">
                              <div class="color_3" >{{item.nickname}}拒绝了应用接入申请 ({{item.comment}})</div>
                            </template>
                            
                            <div class="color_3" v-if="item.status == 5">用户提交了应用上架申请</div>
                            <template v-if="item.status == 6">
                              <div class="color_3" >{{item.nickname}}拒绝了应用上架申请 ({{item.comment}})</div>
                            </template>
                            <div class="color_3" v-if="item.status == 7">
                              <span>{{item.nickname}}通过了应用上架申请</span>
                              <span class="success">同意</span>
                            </div>

                            <div class="color_gray">时间: {{item.time}}</div>
                          </a-timeline-item>
                    </a-timeline>
                    </div>
                    
                </a-form-item>
                
              </a-form>
              <div class="footer flex alignCenter justifyCenter">
                <a-button class="back btn" @click="cancel">关闭</a-button>
                <!-- <a-button class="save btn" type="primary" @click="save(0)">保存</a-button> -->
                <a-button class="submit btn" type="primary" @click="save(1)">提交</a-button>
              </div>
            </div>
        </div>
    </div>

</template>
<script>
import cookie from 'js-cookie'
import * as API from '@/api/data'
export default {
    props:{

        visible:{},
        type:{},
        info:{},
        log:{},//应用审核记录
        schoolList:{}
    },
    data(){
        return{
            form: this.$form.createForm(this),
            fileList:[],
            len: 200, //应用简介字数
            title:'',
            token: cookie.get('JSESSIONID'),
            clientComment:null,
            imageUrl:null,
            loading:false,
            levelType:1,
            school:[],
            list:[],
            // 编辑存应用对象数据
            editSchoolData:[]
        }
    },
    mounted(){
        this.title = this.type == 'add'?'添加应用':'编辑应用'
        this.list = _.cloneDeep(this.schoolList)
        if(this.type == 'edit'){
            this.$nextTick(()=>{
                let info = this.info
                this.levelType = info.levelType
                let school = []
                if(this.levelType == 1){
                  this.list = _.cloneDeep(this.schoolList)
                }else{
                  this.list = _.cloneDeep(this.schoolList).filter(item=>item.id != 1)
                }
                info.clientDept.forEach(item => {
                  school.push(item.deptId)
                })

                info = {
                  ...info,
                  school,
                }
                this.form.setFieldsValue(info)
                this.clientComment = info.clientComment
                this.imageUrl = info.logo?(info.logo) : null
            })
            
        }else{
          this.$nextTick(()=>{
            this.form.setFieldsValue({
              joinType:2,
            })
          })
        }
    },
    methods:{
        // 单点认证切换
        clientTypeChange(e){
          let value = e.target.value
          if(value == 1){
            this.$nextTick(()=>{
              this.form.setFieldsValue({
                joinType:2,
              })
            })
          }
        },
        cancel(){
            this.$emit('cancel')
            this.init()
        },
        // 局校切换
        levelChange(e){
          let value = e.target.value
          if(value == 1){
             this.list = _.cloneDeep(this.schoolList)
          }else{
            this.list = _.cloneDeep(this.schoolList).filter(item=>item.id != 1)
          } 
          this.form.setFieldsValue({
            school:[]
          })
          
        },
        init(){
            this.clientComment = '';
            this.imageUrl = null
            this.form.resetFields();
        },
        save(status){
           if(!this.imageUrl) {
                this.$error({
                    centered: true,
                    title: '失败',
                    content: '请上传应用图标',
                    onOk() {},
                })
                return;
            }
            let data = this.form.getFieldsValue();
            // 是否单点认证 否 只传接入方式 OAuth2.0(推荐)
            if(data.clientType == 2){
              data = {
                ...data,
                joinType: 2,
                serviceUrl:'',
                loginUrl:''
              }
            }
            let clientDept = []
             data.school && data.school.forEach(item => {
              clientDept.push({
                deptId: item
              }) 
            })
            
            data = {
              ...data,
              logo: this.imageUrl || null,
              clientComment: this.clientComment,
              status,
              levelType: this.levelType,
              clientDept
            }
            console.log(data,12)
            this.form.validateFields((err) => {
                if (!err) {
                    this.$emit('save',data)
                } 
            })     
        },
        beforeUpload(file, fileList){
          //限制图片 格式、size、分辨率
          const isJPG = file.type === 'image/jpg';
          const isJPEG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < 5;
          if (!(isJPG || isJPEG || isPNG)) {
            this.$error({
              title: '只能上传JPG、JPEG、PNG格式的图片~',
            });
            return
          } else if (!isLt2M) {
            this.$error({
              title: '图片超过5M限制，不允许上传~',
            });
            return
          }
            this.handleUpload(file);
            this.fileList = [];
            this.fileList.push(file);
          
            
           
		    },
        async handleUpload(file){
            this.loading = true
            let formdata = new FormData()
			      formdata.append('file', file);
            API.fileUpload(formdata).then(res => {
                this.$nextTick(() => {
                    this.loading = false
                    this.imageUrl = (res.value) || null
                })
            })
           
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        isClientType(){
          let data = this.form.getFieldValue('clientType')
          if(data == 1) return true
          else return false
        }
    },
    
}
</script>
<style lang="less" scoped>
.addYyBox{
  background: url('../../../assets/reset_register/register_bg.png') no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  padding: 0.2rem 0;
  .addYyForm{
    width: 14.18rem;
    margin: auto;
    height: 100%;
    overflow-y: auto;
    background: #FFFFFF;
    box-shadow: 0px .01rem .1rem rgba(59, 100, 168, 0.1);
    border-radius: .1rem;
    padding: 0.48rem;
    .addYyForm-head{
      font-size: .2rem;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      margin-bottom: .3rem;
    }
    .addYyForm-content{
      width: 7rem;
      margin: auto;
      /deep/.ant-form-item-label{
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}
  .resonBox{
    background: #fff7e8;
    border-radius: 10px;
    line-height: 40px;
    margin-bottom: 10px;
    font-size: 14px;
    padding: 0 20px;
    align-items: baseline;
    .reason-title{
      text-align: end;
      padding-right: 20px;
      font-weight: 600;
    }
    .reason-value{
      line-height: 25px;
    }
  }
  .status{
    width: .48rem;
    height:.48rem;
    line-height:.48rem;
    font-size: .14rem;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    background: #1A66FF;
  }
  .success{
    background: rgba(0, 205, 134,10%);
    margin-left: 0.1rem;
    min-width: 0.48rem;
    line-height: .24rem;
    display: inline-block;
    border-radius: 0.2rem;
    font-size: .12rem;
    color: #00cd86;
    text-align: center;
    font-weight: bold;
  }
  .error{
    background:rgb(173, 185, 199)
  }
  .loading{
    background: #ffb600;
  }
  /deep/.ant-timeline-item-content{
    min-height: .7rem;
    margin: 0 0 0 0.5rem;
    top: -.25rem;

  }
  .timeLine{
    padding: 20px;
  }
  .color_3{
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    margin-bottom: .05rem;
    // height: .3rem;
    line-height: .3rem;
  }
  .color_gray{
    font-size: .12rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
  }
  .color_red{
    color: red !important;
  }
  /deep/.ant-upload.ant-upload-select-picture-card{
    background: #fff!important;
    width: 90px;
    height: 90px;
    text-align: center;
    border: 1px dashed #D8DADD;
    border-radius: 4px;
    color: #a7a7a7;
    position: relative;
    float: left;
    overflow: hidden;
    margin-bottom: 0;
    img{
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  /deep/.ant-upload.ant-upload-select-picture-card>.ant-upload{
    height: 90px;
  }
  .icon{
    font-size: 24px;
    color: #909399;
  }
  .upload-tsxx{
   font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #CCCCCC;
    margin-left: 15px;
  }
  .btn{
    font-size: .2rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: .34rem!important;
    color: #333333;
    width: 2rem;
    height: .56rem!important;
    background: #EFF1F3;
    border-radius: .28rem!important;
    border: 0!important;
    &.save{
      background: #00CD86;
      color: #fff;
    }
    &.submit{
      background: #1A66FF;
      color: #fff;
    }
  }
  .ant-btn-default:hover,
  .ant-btn-default.ant-btn:focus{
    background: #EFF1F3;
    color: #333333;
    border: 0!important;
  }
  .audit{
    padding-top: 0.2rem;
    border-top: 1px solid #eee;
  }
  /deep/.ant-timeline-item-tail {
    border-left: 2px dashed rgba(26,102,255,23%);
    &::before{
      content:'';
      position: absolute;
      width: 0.16rem;
      height: 0.08rem;
      background: url(../../../assets/index/yyjr-arrow.png) no-repeat;
      background-size: 100%;
      left: 0;
      top: 50%;
      margin: -0.08rem -0.085rem;
    }
  }
</style>