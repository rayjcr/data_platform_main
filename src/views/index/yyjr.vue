<template>
  <div class="yyjrBox flex-column flex">
    <template v-if="!visible">
      <div class="yyjrBox-head">
        <div class="title flex alignCenter justifySpaceBetween">
            <span class="mc">我的应用</span>
            <a-button class="addBtn" type="primary" @click="add('add')">创建应用</a-button>
        </div>
        <img src="../../assets/index/yyjr_banner.png" width="100%"/>
      </div>
      <div class="yyjrBox-content">
        <div class="yyjr-list" :class="{'empty':!loading && (myJoin.length == 0)}">
            <a-row :gutter="30" class="h100">
              <a-col class="gutter-row h100 p0">
                <!-- 我接入的应用 -->
                <div class="yyzx-item bgWhite h100 zjsy wyjjrdyy">
                  <div class="list h100">
                    
                    <template v-if="!loading && myJoin&&myJoin.length > 0">  
                      <div class="zjsy-item flex-column" v-for="(item,index) in myJoin"  :key="index" @click="toDetail(item)">
                        <div class="zjsy-item-list flex">
                          <img class="zjsy-item-icon" :src="'/api/' + item.logo" alt />
                          <div class="zjsy-item-info flex_1">
                            <div class="zjsy-item-info-head flex">
                              <label class="title " :class="item.status == '2'?'unlink color_blue':''" @click.stop="toDetail(item)" :title="item.clientName">{{item.clientName}}</label>
                              <span class="tip" v-if="item.joinType == 2">OAuth2.0</span>
                              <span class="tip" v-else>CAS Client</span>
                              
                            </div>
                            <div class="zjsy-item-info-content">
                              <!-- 接入地址 -->
                              <div class="jrdz">
                                <!-- 应用状态 -->
                                <div class="jrdz-item">
                                  <label class="bt">
                                    <span>应用状态：</span>
                                    <label class="shzt"
                                      v-bind:style="{color:(item.status == '1' || item.status === '0')?'#ffb600':(item.status == '2'?'#00CD86':(item.status == '3'?'#FF5E33':'#1A66FF'))}"
                                    >{{item.status == '1'?'接入审核中':(item.status == '2'?'允许接入':(item.status == '3'?'拒绝接入':'已保存'))}}</label>
                                  </label>
                                </div>
                                <div class="jrdz-item">
                                  <label class="bt">
                                    <span>上架状态：</span>
                                    <span class="shzt" :class="item.publishStatus == 7 ? 'color_green' : ''">{{item.publishStatus == '5'?'待审核':(item.publishStatus == '6'?'已下架':(item.publishStatus == '7'?'已上架':'未上架'))}}</span></label>
                                </div>  


                              </div>
                            
                              
                            </div>
                          </div>
                        </div>
                        <!-- 应用描述 -->
                        <div class="yyms" v-if="item.clientComment">
                          <label class="yyms-mc">应用描述:</label>
                          <label class="yyms-ms">{{item.clientComment}}</label>
                        </div>
                        <!-- 编辑删除 重新申请 -->
                        <div class="editBox flex alignCenter">
                          <!-- 申请授权 -->
                          <!-- <div class="editBox-item flex alignCenter"  v-if="item.status == '2'" @click.stop="toDetail(item)">
                            <span class="iconfont f20">&#xe6a5;</span>
                            <label>接口授权</label>
                          </div> -->
                          
                          
                          <!-- 删除 -->
                          <div class="editBox-item"  v-if="item.publishStatus != '7'" @click.stop="del(item)">
                            <span class="iconfont f20">&#xe619;</span>
                            <label>删除</label>
                          </div>
                          <!-- 编辑
                                上架通过的不可编辑
                           -->
                          <div class="editBox-item"  v-if="item.publishStatus != '7'" @click.stop="add('edit',item)">
                            <span class="iconfont f20">&#xe632;</span>
                            <label>编辑</label>
                          </div>
                          <!-- 申请上架 -->
                          <!-- 
                              1.未申请上架 接入通过
                              2.拒绝上架
                          -->
                          <div class="editBox-item flex alignCenter"  v-if="(item.status == '2' && (!item.publishStatus || item.publishStatus == '6')) " @click.stop="request(item)">
                            <span class="iconfont f20">&#xe6dc;</span>
                            <label>申请上架</label>
                          </div>
                          <!-- 查看日志 -->
                          <div class="editBox-item flex alignCenter" @click.stop="viewLog(item)">
                            <span class="iconfont f20">&#xe8cd;</span>
                            <label>日志</label>
                          </div>
                          <!-- 拒绝显示重新申请 -->
                          <!-- <div class="editBox-item color_blue" v-if="item.status == '3'" @click="refresh(item)">
                            <span class="iconfont">&#xe62a;</span>
                            <label>重新申请</label>
                          </div> -->
                        </div>
                      </div>
                    </template>
                    <Empty :tip="'暂无数据'" v-if="!loading && (myJoin.length == 0)" style="height:100%"/>
                    <a-spin class="loading" v-if="loading"/>
                  </div>
                </div>
              </a-col>
              <a-col :span="9" class="gutter-row jkqkBox h100 flex flex-column" style="display:none!important">
              
                <!-- 授权接口情况 -->
                <div class="yyzx-item jkqk  bgWhite flex flex-column">
                  <!-- 第三方接入 -->
                <div class="jrBox">
                  <label class="title display-block bb1">第三方应用单点接入</label>
                  <div class="jrBox-list">
                    <div class="list-doc" @click="viewMd('\\static/joindoc/casClient.md')">
                        <span class="list-doc-icon"></span>
                        <label class="list-doc-title" title="casClient 接入">casClient 接入</label>
                      </div>
                      <div class="list-doc" @click="viewMd('\\static/joindoc/oauth.md')">
                        <span class="list-doc-icon"></span>
                        <label class="list-doc-title" title="OAuth 接入">OAuth 接入</label>
                      </div>
                      <div class="list-doc" @click="viewMd('\\static/joindoc/openApi.md')">
                        <span class="list-doc-icon"></span>
                        <label class="list-doc-title" title="openApi 接入">openApi 接入</label>
                      </div>
                  </div>
                </div>
                </div>
                <div class="h100 yyzx-item bgWhite mt15">
                  <label class="title display-block bb1">常见问题</label>
                  <div class="jrBox-list">
                    <div class="list-doc" @click="viewMd('\\static/questiondoc/develop.md')">
                        <span class="list-doc-icon"></span>
                        <label class="list-doc-title" title="开发者须知">开发者须知</label>
                      </div>
                      <div class="list-doc" @click="viewMd('\\static/questiondoc/app.md')">
                        <span class="list-doc-icon"></span>
                        <label class="list-doc-title" title="应用接入问题">应用接入问题</label>
                      </div>
                      <div class="list-doc" @click="viewMd('\\static/questiondoc/interface.md')">
                        <span class="list-doc-icon"></span>
                        <label class="list-doc-title" title="接口接入问题">接口接入问题</label>
                      </div>
                      <!-- <Empty :tip="'暂无数据'" style="height:400px"/> -->
                  </div>
                </div>
              </a-col>
              
              
              
            </a-row>
        </div>
      </div>
    </template>
    <add v-else ref="add" :type="type" :schoolList="schoolList" :log="log" :info="info" @cancel="visible = false" @save="save"></add>
    <auditLog :visible="s_vis" :log="log" :info="info" @cancel="s_vis = false"></auditLog>
    <a-modal
        title="查看"
        :visible="v_vis"
        width="80%"
        @cancel="exit"
        destroyOnClose
        :maskClosable="false"
        :keyboard="false"
        :bodyStyle="{'height':'500px','overflowY':'auto','position':'relative'}"
      >
        <RenderMd :local="true" v-if="interfaceInfo" :mdUrl="interfaceInfo.file"></RenderMd>
        <InterfaceInfo class="boxs" v-if="interfaceInfos" :source="'yyjr'" :interfaceData="interfaceInfos" :id="interfaceInfos.id"></InterfaceInfo>
        <div slot="footer">
          <a-button @click="exit">关闭</a-button>
        </div>
      </a-modal>
  </div>
</template>

<script>
import * as API from '@/api/data'
import {interfaceType,clientAuditLog} from '@/api/interface.js'
import add from './components/addYy.vue'
import RenderMd from '../interface/renderMd.vue'
import InterfaceInfo from '../interface/interfaceInfo.vue'
import Empty from '@/components/Empty/Empty.vue'
import auditLog from '../application/auditLog.vue'
export default {
    components:{
      add,RenderMd,InterfaceInfo,Empty,auditLog
    },
    data() {
        return {
            fileList: [],
            visable: false, //控制是否显示AppSecret
            form: this.$form.createForm(this),
            joinType: 2,
            len: 200, //应用简介字数
            sfsc: false, //是否已上传
            headImg: null,
            isHover: false,
            myJoin: [], // 我接入的应用
            visible:false,
            v_vis:false,
            interfaceInfo:null,
            interfaceInfos:null,
            type:'',
            info:{},
            
            loading:false,
            
            log:[],
            s_vis:false,
            schoolList:[]
        }
    },
    async mounted() {
      
       this.init()
       this.getDeptList() 
    },
    methods: {
        // 获取组织机构 
        async getDeptList(){
            let res = await API.getDeptList({type: 2})
            this.schoolList = res.rows.children
        },
        
        init() {
            this.getMyClient()
        },
        // 查看日志
        async viewLog(data){
          await this.clientAuditLog(data.clientId)
          this.info = data
          this.s_vis = true
        },
        // 申请上架
        async request(data){
          this.$confirm({
            centered: true,
            title: '确认提示',
            content: '您确定要上架应用吗?',
            okText: '确认',
            cancelText: '取消',
            onOk: async() => {
              let res = await API.requestPublish({clientId:data.clientId})
              if(res.resultCode == 200){
                /**
                 * status 返回错误成功状态
                 * -1 未找到数据 开两个网页 一个页面删除 一个页面申请上架
                 * 0 成功
                 * 1 重复下架(审核)
                 * 2 重复上架(审核)
                 * 3 已下架不可上架(审核)
                 * 4 数据未修改成功
                 * 5 应用已上架 开两个网页 两个一起上架
                 */
                let {status} = res.value
                let msg = null
                
                if(status === 0){
                   msg = '应用提交申请上架操作成功！'
                    this.$success({
                      centered: true,
                      title: '成功',
                      content: msg,
                      onOk() {}
                    })
                }
                else{
                  if(status == 4) msg = '应用提交申请上架操作失败，请重新提交申请上架！'
                  if(status == -1) msg = '应用不存在或已被删除！'
                  if(status == 5) msg = '应用提交申请上架操作失败，' + res.value.msg +'！'
                  if(!status){
                    msg = '应用提交申请上架操作失败！'
                  }
                  this.$error({
                    centered: true,
                    title: '错误',
                    content: msg,
                    onOk() {}
                  })
                }
               
                this.init()
              }
               
            },
            onCancel: () => {
              console.log('退出')
            }
          })
          

        },
        
        // 个人中心我的应用
        getMyClient() {
           this.loading = true
            API.myClient().then((res) => {
                if (res.resultCode == 200) {
                    this.myJoin = res.value || []
                    this.loading = false
                    // if(this.myJoin && this.myJoin.length > 0){
                    //   // 状态未审核不可显示右侧数据
                    //   let data = this.myJoin.filter(e=>e.status != 1)
                      
                    //   if(data.length > 0){
                    //     this.$nextTick(()=>{
                    //       let index = this.myJoin.findIndex(e=>e.clientId == data[0].clientId)
                    //       this.getClentApi(data[0],index)
                    //     })
                       
                    //   }
                     
                    // }
                }
            })
        },
        // 保存新应用
        save(data) {
          if(this.type == 'edit') data.clientId = this.info.clientId
          API.registerClient(data).then((res) => {
              if(res.resultCode == 200) {
                /**编辑
                 * status 返回错误成功状态
                 * -1 未找到数据
                 * 0 成功
                 * 1 失败
                 * 2 应用已上架
                 */
                  if(this.type == 'edit'){
                    let {status} = res.value
                    let msg = null
                    if(status === 0){
                      this.$success({
                          centered: true,
                          title: '成功',
                          content: '提交成功!',
                          onOk() {},
                      })
                    }else{
                      if(status == -1) msg = '应用不存在或已被删除！'
                      if(status == 1 || !status) msg = '提交失败！'
                      if(status == -1 || this.status ==1){
                        this.$error({
                          centered: true,
                          title: '错误',
                          content: msg,
                          onOk() {}
                        })
                      }
                       if(status == 2){
                         this.$info({
                          centered: true,
                          title: '提示',
                          content: '应用申请上架已审核通过，不能进行应用信息编辑！',
                          onOk() {}
                        })
                       }
                    }
                  }else{
                    this.$success({
                        centered: true,
                        title: '成功',
                        content: '提交成功！',
                        onOk() {},
                    })
                  }
                  
                  
                  this.getMyClient();
                  this.$refs.add.init()
                  this.visible = false
              }
          })  
        },
        refresh(item){
            this.type = 'edit'
            this.info = item
            this.save(item)
        },
        toDetail(data){
          // 已上架
          if(data.status == '2'){
            this.$router.push('/center/detail?clientId=' + data.clientId)
          }
        },
        getFileUrl(obj) {
            let url
            url = window.URL.createObjectURL(obj.files.item(0))
            return url
        },
        // 查询应用详情
        async getClientInfo(clientId){
            let res = await API.getClientInfo(clientId)
            this.info = res.value
        },
        // 新增
        async add(type,item){
          this.type = type
          if(type == 'edit'){
            await this.clientAuditLog(item.clientId)
            await this.getClientInfo(item.clientId)
            if(!this.info){
              this.$info({
                  centered: true,
                  title: '提示',
                  content: '应用不存在或已被删除!',
                  onOk() {},
              })
              this.init()
              return
            }
            if(this.info.publishStatus == 7){
              this.$info({
                centered: true,
                title: '提示',
                content: '应用申请上架已审核通过，不能进行应用信息编辑！',
                onOk() {}
              })
              this.init()
              return
            }
          }
          this.visible = true

        },
        // 应用审核记录
        async clientAuditLog(clientId){
          let res = await clientAuditLog({clientId})
          this.log = res.value
        },
        viewMd(item){
          this.v_vis = true
          this.interfaceInfo = {}
          this.interfaceInfo.file = item;
          
        },
        viewData(item){
          this.interfaceInfos = item
          this.v_vis = true
        },
        exit(){
          this.v_vis = false
          this.interfaceInfos = null
          this.interfaceInfo = null
        },
        async del(item){
          this.$confirm({
            centered: true,
            title: '确认提示',
            content: '您确定要删除选中的数据吗?',
            okText: '确认',
            cancelText: '取消',
            onOk: async() => {
               API.delClient(item.clientId).then(res=>{
                 if(res.resultCode == 200){
                   this.$success({
                      centered: true,
                      title: '成功',
                      content: '删除成功',
                      onOk() {}
                    })
                  this.init()
                 }
               }).catch(err=>{
                 if(err.response.data.resultCode == 500){
                   this.init()
                 }
               })
              
                
            },
            onCancel: () => {
              console.log('退出')
            }
          })
          

        } 
    },
}
</script>

<style lang="less" scoped="scoped">
.yyjrBox{
  height: 100%;
  .yyjrBox-head{
    position: relative;
    .title{
          .mc{
            font-size: .4rem;
            font-family: MicrosoftYaHei-Bold;
            color: #3C485C;
            font-weight: bold;
          }
          width: 14.18rem;
          position: absolute;
          left: 50%;
          margin-left: -7.09rem;
          height: 100%;
          top: 0;  
      }
      .addBtn{
        background: #1A66FF;
        border-radius: 0.28rem !important;
        font-size: 0.2rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 0.56rem !important;
        color: #FFFFFF;
        width: 2rem;
        height: 0.56rem!important;
      }
  }
  .yyjrBox-content{
    flex: 1;
    overflow: hidden;
    background: #fff;
    padding: 0.4rem 0;
    .yyjr-list{
      width: 14.18rem;
      margin: auto;
      height: 100%;
      
    }
    .empty{
      background: #FFFFFF;
      box-shadow: 0px .01rem .1rem rgba(59, 100, 168, 0.1);
      border-radius: .1rem;
      border-radius: .1rem;
      padding: 0.2rem;
      overflow: hidden;
    }
  }
}
/deep/.ant-form-item-label {
    float: left;
    color: #333;
    font-weight: 600;
    position: relative;
    padding-left: 10px;
}
.jkqk-list{
  overflow-y: auto;
  .jkqk-list-item{
    padding: 10px 0 20px 0;
    .head{
      .status{
        padding: 5px 10px;
        // background: turquoise;
        border-radius: 20px;
        color:#fff;
      }
      .request{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span{
          margin-right: 5px;
          cursor: pointer;
        }
        label{
          cursor: pointer;
        }
      }
    }
    .content-item{
      line-height: 25px;
      margin-bottom: 5px;
      .content-item-title{
        min-width: 70px;
      }
    }
    .reason{
      padding: 10px 15px;
      background: #fff7e8;
      border-radius: 10px;
      margin-top: 10px;
      .reason-title{
        min-width: 70px;
      }
    }
    
  }
}
.yyzx-item .title {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    line-height: 50px;
}
/deep/.ant-form-item-required:before {
    position: absolute;
    left: -10px;
    top: 4px;
}

input {
    height: 45px;
}

input,
textarea {
    border-radius: 20px !important;
    border-color: #eee;
}

textarea {
    padding: 15px;
}

.len {
    position: absolute;
    right: 0;
    bottom: 0;
    text-align: right;
    padding: 0 15px;
    color: #999;
}

.len span {
    font-weight: 600;
}

.btn-submit {
    border: 0;
    background: #168dff;
    color: #fff;
    border-radius: 20px;
    line-height: 40px;
    padding: 0 15px;
    outline: 0;
    cursor: pointer;
    margin: auto;
    display: block;
}

.upload {
    display: flex;
    position: relative;
}

.upload-item {
    width: 150px;
    height: 150px;
    background: #f3f5f7;
    border-radius: 15px;
    text-align: center;
    color: #999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 150px;
    position: relative;
    overflow: hidden;
}

.upload-item span {
    font-size: 55px;
    color: #ccc;
    padding: 15px 0;
}
.upload-item img {
    object-fit: contain;
}
.upload-tsxx {
    line-height: 20px;
    /* padding: 50px 0; */
    margin-left: 20px;
    color: #ccc;
}

#file {
    width: 150px;
    height: 150px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    outline: 0;
    border-radius: 15px;
    cursor: pointer;
    opacity: 0;
}

.mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: black;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.mask span {
    color: #fff;
    display: block;
}
.h100{
  height: 100%;
}
.bgWhite{
  background: #fff;
}
.yyzx-item{
  // border-radius: 10px;
  position: relative;
}
.wyjjrdyy {
    // overflow-y: auto;
}
.yyzx-item .list{
  padding: 0.15rem 0;
  overflow-y: auto;
}
  .zjsy .zjsy-item {
    display: flex;
    width: 6.9rem;
    height: 3.5rem;
    background: #FFFFFF;
    box-shadow: 0px .05rem .2rem rgba(59,100,168,10%);
    border-radius: .1rem;
    float: left;
    padding: .3rem;
    margin: 0 0.15rem 0.2rem 0.15rem;
    position: relative;
    &.active{
      background: aliceblue;
    }
}

  .zjsy .zjsy-item .zjsy-item-icon {
    width: 1.2rem;
    height: 1.2rem;
    // background: #ebeef2;
    border-radius: .1rem;
    margin-right: .2rem;
    min-width: 1.2rem;
    object-fit: cover;
}

  .zjsy .zjsy-item .title {
    font-size: .24rem;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: .3rem;
    margin-right: 0.1rem;
}

  .zjsy .zjsy-item .tip {
    display: inline-block;
    background: #F1F2F5;
    padding: 0 0.1rem;
    border-radius: 0.25rem;
    margin-right: 0.1rem;
    line-height: .3rem;
    font-size: .12rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #7787A2;
}
.zjsy-item-info-head{
  margin-bottom: .2rem;
}
  .zjsy .zjsy-item .jrdz-item .bt {
    width: 50%;
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

  .zjsy .zjsy-item .jrdz-item .bt span:nth-child(1),
  .shzt {
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: .3rem;
    color: #333333;
}


//   .zjsy .zjsy-item .jrdz-item .bt span:nth-child(2) {
//     color: #666;
//     font-size: 14px;
// }

  .zjsy .zjsy-item .jrdz-item .bt span:nth-child(3) {
    color: #ccc;
    font-size: 14px;
}

  .zjsy .zjsy-item .shsj {
    margin-top: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

  .zjsy .zjsy-item .shsj .icon {
    width: 20px;
    height: 20px;
}

 .yyzx-item.wyjjrdyy {
    overflow-y: auto;
}

  .zjsy .zjsy-item .shsj .yjsj {
    margin-left: 5px;
    color: #d0d0d0;
    vertical-align: middle;
}

  .zjsy .zjsy-item .shsj .shzt {
    font-size: 16px;
    font-weight: 600;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
}

  .zjsy .zjsy-item .yyms {
    margin-top: .2rem;
}

  .zjsy .zjsy-item .yyms-mc {
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: .3rem;
    display: block;
    color: #333333;
    margin-bottom: .1rem;
}

  .zjsy .zjsy-item .yyms-ms {
    word-break: break-all;
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: .24rem;
    color: #AEB6C1;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
.addBox{
  span,
  label{
    cursor: pointer;
  }
  cursor: pointer;
}

.jkqkBox{
  padding-left: 0!important;
}
.flex_1{
  width: 100%;
}

.viewSecret{
  word-break: break-all;
  width: 300px;
}
.viewSecret-title{
  min-width: 80px;
  font-weight: 600;
  color: #333;
}
.success{
  background: rgb(0, 205, 134);
  color:#fff;
}
.error{
  background:rgb(173, 185, 199);
}
.load{
  background: rgb(255, 182, 0);;
}
.unlink{
  text-decoration: underline;
  cursor: pointer;
}

 .yyzx-item .list-doc {
    position: relative;
    height: 48px;
    margin-top: 15px;
    float: left;
    cursor: pointer;
    width: 50%;
}
.jrBox-list{
  overflow:hidden;
}
 .yyzx-item .list-doc .list-doc-icon {
    width: 48px;
    height: 48px;
    display: inline-block;
    background: url(img/wps.png) center center no-repeat;
    background-size: 100%;
    vertical-align: middle;
    position: absolute;
    cursor: pointer;
}

 .yyzx-item .list-doc .list-doc-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    padding: 0 30px 0 60px;
    cursor: pointer;
}

 .yyzx-item .list-doc .list-doc-dwmc {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 48px;
    display: block;
    cursor: pointer;
}
.zjsy-item-info{
  overflow: hidden;
}
.zjsy-item-info-head{
  position: relative;
}
.editBox{
  position: absolute;
    right: 0;
    bottom: 0;
    z-index: 11;
    height: 0.7rem;
    padding: 0 0.3rem;
  .editBox-item{
    cursor: pointer;
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: .24rem;
    color: #333333;
    padding: 0 0.2rem;
    border-right: 1px solid #E6E6E6;
    label{
      cursor: pointer;
      margin-left: 0.1rem;
    }
    .iconfont{
      font-size: .16rem;
      cursor: pointer;
    }
    &:last-child{
      border: 0;
    }
  }
}
.f20{
  font-size: 20px!important;
}
.display-block{
  display: block;
}

.loading{
  position: absolute;
    left: 50%;
    top: 50%;
}
.view{
  cursor: pointer;
}
// .not-allow{
//   cursor: not-allowed;
//   img,
//   div,
//   span,
//   label{
//     cursor: not-allowed;
//   }
// }
.sqjk{
  border-top: 1px solid #eee;
    margin-top: 1rem;
}
.boxs{
  top: 0;
  bottom: 0;
  /deep/.cell .cell_main{
    height: calc(100% - 48px);
  }
}
.flex{
  display: flex!important;
}
.mt15{
  margin-top: 15px;
}
.p20{
  padding: 20px;
}
.p0{
  padding: 0!important;
}
</style>
