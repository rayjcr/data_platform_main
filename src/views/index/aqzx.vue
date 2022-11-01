<template>
  <div class="yyzx">
    <div class="yyzx-box">
      <div class="yyzx-item zjsy">
        <div class="title">基本信息</div>
        <div class="list">
          <div class="list-info">
            <div class="list-info-item">
              <!-- 头像 -->
              <div class="headImg">
                <img :src="headImg" width="100%" @error="error"/>
              </div>
              <button type="button" class="btn-change btn-head">
                <label>修改头像</label>
                <input
                  type="file"
                  ref="file"
                  name="file"
                  id="file"
                  @change="fileChange($event)"
                  accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
                />
              </button>
            </div>
            <div class="list-info-item info">
              <!-- 基本信息 -->
              <div class="username">{{list?list[0].value:(login_user?login_user.username:'')}}</div>
              <div class="info-list flex">
                <div class="info-list-item flex" v-for="(item,index) in list" :key="index">
                  <span class="line" v-if="index % 2 == 0 && index > 0"></span>
                  <div>
                    <label class="btt">{{item.mc}}</label>
                    <label class="btv" v-if="item.bm != 'status'">{{item.value}}</label>
                    <label
                      class="btv"
                      :class="[item.value == '0'?'bzczt':'zczt']"
                      v-else
                    >{{item.value == '0'?'异常':'正常'}}</label>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="yyzx-item zjsy zhaq">
        <div class="flex alignCenter">
          <label class="title">账号安全</label>
          <div class="aqcd">
            <label class="aqcd-title">您当前的帐号安全程度</label>
            <a-progress :percent="30" size="small" :showInfo="false" style="width:200px" />
            <label class="aqcd-status">低</label>
          </div>
        </div>
        <div class="list">
          <div class="list-aqcd">
            <a-row :gutter="15">
              <a-col class="gutter-row" :span="12" v-for="(item,key,index) in listItem" :key="index">
                <div class="list-aqcd-item" :class="['aqcd_' + (index + 1)]">
                  <div class="left" v-bind:style="{background:background[index]}">
                    <span></span>
                  </div>
                  <div class="right">
                    <label class="title">{{item.mc}}</label>
                    <label class="ms">{{item.ms}}</label>
                    <div class="szxg">
                      <label
                        class="tsxxx"
                        v-if="(item.bm == 'bdsj' || item.bm == 'mbwt'|| item.bm == 'xgmm'||item.bm == 'bdyx') && item.status == '0'"
                      >
                        <span class="iconfont">&#xe715;</span>
                        <label>{{item.warning}}</label>
                      </label>
                      <button
                        type="button"
                        class="btn-change"
                        v-bind:style="{background:item.disabled?'#CDD5DD':''}"
                        :disabled="item.disabled"
                        v-if="item.bm == 'xgmm'"
                        @click="set(item)"
                      >{{item.status == '0'?'设置':'修改'}}</button>
                      <!-- 绑定邮箱 -->
                      <button
                        type="button"
                        class="btn-change"
                        v-if="item.bm == 'bdyx'"
                        @click="bindSb(item)"
                      >{{item.status == '0'?'绑定':'修改'}}</button>
                      <!-- 绑定钉钉 解绑 -->
                      <button
                        type="button"
                        class="btn-change"
                        v-if="item.bm == 'bddd'"
                        @click="bindSb(item)"
                      >{{item.status == '0'?'绑定':'解绑'}}</button>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
            <!-- 弹窗 -->
            <mlog :visible="visible" :info="info" @exit="exit" @save="save" :type="type"></mlog>
          </div>
        </div>
      </div>
      <!-- 第三方认证信息 -->
      <div class="yyzx-item rzxx" v-if="currInfo">
        <div class="title">认证信息</div>
        <div class="list" v-if="currInfo">
            <div class="rzxx-item">
                <div class="rzxx-item-info">
                    <div class="info-item">
                        <label class="info-item-title">用户账号</label>
                        <label class="info-item-value">{{currInfo.username || ''}}</label>
                    </div>
                    <div class="info-item">
                        <label class="info-item-title">类型</label>
                        <label class="info-item-value">{{currInfo.userType == 2?'个人':'企业'}}</label>
                    </div>
                    <div class="line"></div>
                    <div class="info-item">
                        <label class="info-item-title">姓名</label>
                        <label class="info-item-value">{{currInfo.nickname || currInfo.username}}</label>
                    </div>
                    <div class="info-item">
                        <label class="info-item-title">手机号</label>
                        <label class="info-item-value">{{currInfo.mobile || ''}}</label>
                    </div>
                    <div class="info-item">
                        <label class="info-item-title">邮箱</label>
                        <label class="info-item-value">{{currInfo.email || ''}}</label>
                    </div>
                    <div class="line"></div>
                    <div class="info-item" v-if="currInfo.userType == 2">
                        <label class="info-item-title">
                           <span>个人身份证</span>
                            <span class="view" @click="viewImg">查看大图</span>
                        </label>
                        <div class="flex">
                          <img v-if="headImg2" :src="headImg2" class="headImg" @error="error1"/>
                          <img v-if="headImg1" :src="headImg1" class="headImg" @error="errors"/>
                        </div>
                        
                    </div>
                    <div class="info-item" v-if="currInfo.userType == 1">
                        <label class="info-item-title">
                          <span>社保登记证</span>
                          <span class="view" @click="viewImg">查看大图</span>
                        </label>
                        <img v-if="headImg2" :src="headImg2" class="headImg" @error="error1"/>
                    </div>
                </div>
                <div class="rzxx-item-info mt60">
                    <div class="info-item grjj">
                        <label class="info-item-title">{{currInfo.userType == 2?'个人':'企业'}}简介</label>
                        <label class="info-item-value">{{currInfo.descripInfo || ''}}</label>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
    <!-- 查看大图 -->
    <viewImg :visible="imgVisible" :currInfo="currInfo" @cancel="imgVisible = false"></viewImg>
  </div>
</template>

<script>
import * as API from '@/api/data'
import viewImg from './components/viewImg.vue'
import mlog from './mlog.vue'
export default {
    components: {
        mlog, viewImg
    },
    data() {
        return {
            headImg:'',
            login_user: JSON.parse(localStorage.getItem('login_user')),
            list: [
                {
                    mc: '登录帐号',
                    bm: 'nickname',
                    value: '',
                },
                {
                    mc: '帐号状态',
                    bm: 'status',
                   value: '',
                },
                {
                    mc: '手机号码',
                    bm: 'mobile',
                    value: '',
                },
                
                {
                    mc: '邮箱',
                    bm: 'email',
                   value: '',
                },
                // {
                //     mc: '登录别名',
                //     bm: 'nickname',
                //     value: '',
                // },
                {
                    mc: '公司名称',
                    bm: 'company',
                    value: '',
                },
            ],
            listItem:{
              "xgmm":{
                    status: '1',
                    bm: 'xgmm',
                    mc: '修改密码',
                    disabled: false,
                    warning: '未设置',
                    ms: '不定期修改密码提升账号安全性',
              },
              "bdyx":{
                    status: '0',
                    bm: 'bdyx',
                    mc: '绑定邮箱',
                    warning: '未设置',
                    ms: '用于账号登录，客服咨询及其他信息提醒',
              },
              'bddd':{
                 status: '0',
                    bm: 'bddd',
                    mc: '绑定钉钉',
                    ms: '用于账号登录，客服咨询及其他信息提醒',
              }
            },
            aqcd: [
                {
                    status: '1',
                    bm: 'xgmm',
                    mc: '修改密码',
                    disabled: false,
                    warning: '未设置',
                    ms: '不定期修改密码提升账号安全性',
                },
                {
                    status: '0',
                    bm: 'bdyx',
                    mc: '绑定邮箱',
                    warning: '未设置',
                    ms: '用于账号登录，客服咨询及其他信息提醒',
                },
                {
                    status: '0',
                    bm: 'bddd',
                    mc: '绑定钉钉',
                    ms: '用于账号登录，客服咨询及其他信息提醒',
                },
                
            ], //账号安全
            background: ['#168DFF', '#8080FF', '#00CD86', '#168DFF', '#168DFF', '#00CD86', '#FF7B12'],
            info: {},
            visible: false,
           
            dept:[],
            type:'',
            userInfo:{},
            bindInfo:{},
            currInfo:null,
            headImg1:null,
            headImg2:null,
            title:'',
            imgVisible:false,
        }
    },
    async mounted() {
        await this.init()
        // 修改邮箱状态
        if(this.login_user.email) this.listItem['bdyx'].status = '1'
        // 接受钉钉返回的code
        let query = this.$route.query
        if(query && query.code){
          // 钉钉绑定返回
          // 查询绑定状态，避免重复绑定
          if(this.listItem['bddd'].status == '0') this.dingBind(query.code)
        }

    },
    methods: {
      viewImg(){
        this.imgVisible = true
      },
      error1(){
        this.headImg2 = require('@/assets/default.png')
      },
      errors(){
        this.headImg1 = require('@/assets/default.png')
      },
      // 查看认证信息
       async getAuthUser(userId){
            let res = await API.getAuthUser({userId})
            if(res.value){
              this.currInfo = res.value
              if(this.currInfo.pic1) this.headImg2 = '/api/' + this.currInfo.pic1
              if(this.currInfo.pic2) this.headImg1 = '/api/' + this.currInfo.pic2
            }
            
        },
     async init() {
       //  查询所有第三方绑定信息修改邮箱.钉钉状态
        await this.getUserInfo()
        await this.userBindInfo()
        this.getAuthUser(this.login_user.userId)
        
     },
     error(e){
       this.headImg = require('@/assets/default.png')
     },
     async dingBind(oauth_token){
        let res = await API.dingBind({oauth_token})
        if(res.resultCode == 200){
          this.$success({
            	centered: true,
            	title: '成功',
            	content: '绑定成功！',
            	onOk() {}
            })
            // 修改状态
            this.userBindInfo()
        }
     },
    //   查询所有第三方绑定信息修改邮箱.钉钉状态
     async userBindInfo(){
        let res = await API.userBindInfo()
        this.bindInfo = res.value
        if(res.value &&res.value.length > 0){
          res.value.forEach(item=>{
            let type = item.authType == 2?'bddd':'bdwx'
            this.listItem[type].status = '1'
          })
        }else{
          // 重置状态
          let type = 'bddd'
          this.listItem[type].status = '0'
        }
     },
     // 获取个人信息
     getUserInfo(){
       let userId = JSON.parse(localStorage.getItem('login_user')) ? JSON.parse(localStorage.getItem('login_user')).userId:''
       API.getUserInfo(userId).then(res => {
         if(res.value){
           
           this.userInfo = res.value
           let user = JSON.parse(localStorage.getItem('login_user'))
           if(user.pic != res.value.pic){
             user = {
              ...user,
              pic:res.value.pic
            }
            localStorage.setItem('login_user',JSON.stringify(user))
            this.$store.commit('SET_INFO',localStorage.getItem('login_user'))
           }
           
           if(res.value.pic && res.value.pic.length>0){
             this.headImg = '/api/' +res.value.pic
           }
           this.list.forEach((e,index)=>{
             if(index <= this.list.length - 1){
               if(e.bm == 'nickname'){
                  this.$set(e,'value',!res.value[e.bm] ? res.value['username'] : res.value[e.bm])
               }else{
                 this.$set(e,'value',res.value[e.bm])
               }
               
             }
             
           })
         }
       })
     },
     // 修改信息
     changeInfo(){
       this.$set(this.info,'mc','修改用户信息')
       this.$set(this.info,'bm','xgyhxx')
       this.$set(this.info,'dept',this.dept)
       this.$set(this.info,'form',this.userInfo)
       this.type = 'edit'
       this.visible = true
     },
     // 上传头像
      fileChange(e) {
        let file = e.target.files[0]
        	let data = new FormData()
        	data.append('file', file)
        	API.fileUpload(data).then(res => {
        		if (res.resultCode == 200) {
              this.headImg = res.value
              this.updateHead(res.value)
              // 调用修改头像接口
        		}
        	}).catch((r) => {
        		this.$error({
        			centered: true,
        			title: '失败',
        			content: '上传失败！',
        			onOk() {}
        		})
        	})
      },
      // 更新头像
      updateHead(avatar){
        API.uploadAvatar({
          avatar:avatar
        }).then(res => {
          if(res.resultCode == 200){
            this.$success({
            	centered: true,
            	title: '成功',
            	content: '头像已更新！',
            	onOk() {}
            })
            this.init()
          }
        })
      },
      // 设置密码，设置密保问题
      set(data){
        if(data.bm == 'xgmm'){
             this.info = data
             this.visible = true
        }
      },
      // 绑定手机等
      async bindSb(data){
        if(data.bm == 'bdyx'){
          this.info = data
          this.visible = true
        }
        if(data.bm == 'bddd'){
          if(data.status == '0'){
            // 绑定
             this.jumpDing()
          }else{
            // 解绑
            // authType 2 钉钉
            this.removeDingBind(2)
          }
         
        }
      },
      async removeDingBind(authType){
        let res = await API.removeDingBind({authType})
        if(res.resultCode == 200){
          this.$success({
            	centered: true,
            	title: '成功',
            	content: '解绑成功！',
            	onOk() {}
            })
            // 修改状态
            this.userBindInfo()
        }
      },
      async jumpDing(){
        let res = await API.jumpDing()
        window.location.href = res.value
      },
      exit(){
        this.visible = false
        this.info = {}
      },
      async save(data){
         
         let api = null
         if(this.info.bm == 'xgmm'){
            api = API.changePassword({
              newPassword: data.xmm,
              oldPassword: data.jmm
            })
         }
         if(this.info.bm == 'bdyx'){
            api = API.bindEmail({
              email: data.email,
              code: data.emailCode
            })

         }
         let res = await api
         if(res.resultCode == 200){
           this.$success({
                centered: true,
                title: '成功',
                content: this.info.bm == 'bdyx'?'绑定成功！':'保存成功！',
                onOk() {},
            })
         }
          this.visible = false
          this.init()
      },
      
      
    },
}
</script>

<style scoped="scoped" lang="less">
.title {
    margin-right: .4rem;
}
/deep/.box{
  padding: 20px;
}
.btn-change {
    border: 0;
    font-size: .14rem;
    color: #fff;
    border-radius: .2rem;
    line-height: .4rem;
    padding: 0 .15rem;
    outline: 0;
    cursor: pointer;
    margin-left: .15rem;
}

.btn-head {
    color: #666;
    margin-left: 0;
    position: relative;
    min-width: 0.8rem;
    font-size: .14rem;
    background: #FFFFFF;
    border: 1px solid #E6E6E6;
    padding: 0;
    border-radius: 0.18rem;
    line-height: .35rem;
    height: 0.35rem;
}

.list-info {
    overflow: hidden;
    display: flex;
}

.list-info-item {
    float: left;
}

.headImg {
    width: .88rem;
    height: .88rem;
    display: block;
    margin: 0 auto .1rem auto;
    border-radius: 50%;
    border: 1px solid #f5f5f5;
    overflow: hidden;
}

.headImg img {
    object-fit: cover;
    display: block;
    width: 100%;
    height: 100%;
}

.tip {
    color: #666;
}

#file {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    outline: 0;
    border-radius: 15px;
    cursor: pointer;
    opacity: 0;
}

.username {
    font-size: .2rem;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    margin-bottom: .3rem;
}

.info {
    padding-left: .48rem;
    flex-grow: 1;
}

.info-list {
    overflow: hidden;
}

.info-list-item {
    float: left;
    padding-right: .48rem;
    .line{
      width: .01rem;
      height: .4rem;
      background: #E6EBF2;
      margin: 0.08rem 0.48rem 0 0;
    }
}

.info-list-item:nth-child(2n + 1) {
    clear: both;
}

.btt {
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: .2rem;
    height: .2rem;
    color: #999999;
    display: block;
    margin-bottom: .1rem;
}

.btv {
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: .24rem;
    color: #333333;
     display: block;
}

.zczt,
.bzczt {
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 15px;
}

.zczt {
    color: #00cd86;
    background: #e5faf3;
    width: 0.48rem;
    height: 0.24rem;
    border-radius: 0.12rem;
    font-size: 0.12rem;
    line-height: 0.24rem;
    padding: 0;
    text-align: center;
    display: block;
    margin: auto;
}

.bzczt {
    color: #ff7b12;
    background: #fff2e7;
}

.aqcd,
.aqcd-status {
    display: inline-block;
}

.aqcd-title {
    margin-right: .1rem;
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: .2rem;
    color: #999999;
}

.aqcd-status,
.tsxxx label {
    color: #ff7b12;
    font-weight: 600;
    margin-left: 15px;
}
.aqcd-status{
  font-size: .16rem;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: .2rem;
  color: #FF5E33;
}
/deep/.ant-progress-bg {
    background: #ff7b12;
}
.ant-progress-inner{
  margin-top: -.05rem;
}
.list-aqcd-item {
    background: #F7F7F7;
    margin-bottom: .2rem;
    display: flex;
    padding: 0.2rem;
    height: 1.2rem;
    border-radius: .1rem;
}

.left {
    width: .8rem;
    height: .8rem;
    background: #eee;
    border-radius: .1rem;
    min-width: .8rem;
}

.right {
    flex-grow: 1;
    padding: 0.1rem 0 0 0.2rem;
    position: relative;

}

.right .title {
    display: block;
    line-height: 40px !important;
}

.right .ms {
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
    margin-top: .13rem;
    display: block;
}

.right .btn-change {
    line-height: .36rem;
    background: #1A66FF;
}

.right .szxg {
    position: absolute;
    right: 0.2rem;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;
}

.tsxxx span {
    font-size: 20px;
    vertical-align: middle;
}

.tsxxx {
    color: #ff7b12;
}

.tsxxx label {
    margin-left: 5px;
}
.list-aqcd-item .left span {
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    margin: 0.15rem auto;
}
.aqcd_1 .left span {
    background: url(img/bdsj.png) center center no-repeat;
    background-size: contain;
}
.aqcd_2 .left span {
    background: url(img/mm.png) center center no-repeat;
    background-size: contain;
}
.aqcd_3 .left span {
    background: url(img/mbwt.png) center center no-repeat;
    background-size: contain;
}
.aqcd_4 .left span {
    background: url(img/yx.png) center center no-repeat;
    background-size: contain;
}
.aqcd_5 .left span {
    background: url(img/dd.png) center center no-repeat;
    background-size: contain;
}
.aqcd_6 .left span {
    background: url(img/wx.png) center center no-repeat;
    background-size: contain;
}
.aqcd_7 .left span {
    background: url(img/qq.png) center center no-repeat;
    background-size: contain;
}


 .yyzx .yyzx-item {
    // cursor: pointer;
    margin-top: .2rem;
    background: #FFFFFF;
    box-shadow: 0px .01rem .1rem rgba(59, 100, 168, 0.1);
    border-radius: .1rem;
    padding: .48rem;
    .list{
      margin-top: .3rem;
    }
}

 .yyzx .yyzx-item .title {
    font-size: .24rem;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: .3rem;
    color: #333333;
    
}
.right{
  .title{
    font-size: .2rem;
    line-height: .26rem!important;
  }
}


 .yyzx .yyzx-item .list-item {
    text-align: center;
    padding-top: 15px;
    color: #333;
    display: block;
}

 .yyzx .yyzx-item .list-item:hover {
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    -o-transform: scale(1.2);
    box-shadow: 1px 1px 20px #f5f5f5;
    border-radius: 15px;
    font-size: 12px;
}

 .yyzx .yyzx-item .list-item .list-item-icon {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    background: #ebeef2;
    display: block;
    margin: auto;
}

 .yyzx .yyzx-item .list-item .list-item-title {
    display: block;
    line-height: 35px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* // 第三方接入资源 */
 .yyzx .yyzx-item .list-doc {
    position: relative;
    height: 48px;
    margin-top: 15px;
}

 .yyzx .yyzx-item .list-doc .list-doc-icon {
    width: 48px;
    height: 48px;
    display: inline-block;
    background: url(img/wps.png) center center no-repeat;
    background-size: 100%;
    vertical-align: middle;
    position: absolute;
}

 .yyzx .yyzx-item .list-doc .list-doc-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    padding: 0 30px 0 60px;
}

 .yyzx .yyzx-item .list-doc .list-doc-dwmc {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 48px;
    display: block;
}

/* // 我接入的新应用 */
 .yyzx .yyzx-item .list-new-item {
    border-radius: 15px;
    background: rgba(249, 250, 251, 1);
    margin-top: 30px;
    height: 150px;
    text-align: center;
    padding-top: 15px;
    position: relative;
}

 .yyzx .yyzx-item .list-new-item-icon {
    display: inline-block;
    width: 90px;
    height: 90px;
    background: #ebeef2;
    margin: auto;
    border-radius: 15px;
}

 .yyzx .yyzx-item .list-new-item-title {
    display: block;
    line-height: 45px;
}

 .yyzx .yyzx-item .list-new-item.zt:hover {
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    -o-transform: scale(1.2);
    box-shadow: 1px 1px 20px #f5f5f5;
    border-radius: 15px;
    font-size: 12px;
    background: #fff;
}

 .yyzx .yyzx-item .list-new-item .iconfont {
    font-size: 50px;
    line-height: 90px;
    height: 75px;
    background: transparent;
}

 .yyzx .yyzx-item .list-new-item .list-new-item-status {
    width: 70px;
    position: absolute;
    left: 0;
    top: 0;
}

 .yyzx .yyzx-item .list-new-item.zt:hover .list-new-item-status {
    width: 60px;
}

 .yyzx .yyzx-item .list-new-item .more {
    float: right;
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
}
.yyzx{
    border-radius: 10px;
    width:100%;
    height: 100%;
    background:  url('../../assets/index/aqzx_bg.png') no-repeat;
    background-size: 100%;
    overflow-y: auto;
    .yyzx-box{
      width: 14.18rem;
      margin: auto;
    }
}
.p20{
  padding: 20px;
}
.zhaq{
  margin: 0.3rem 0 0.2rem 0;
    padding-bottom: 0.24rem;
}
.rzxx{
  margin-bottom: .4rem;
}
.rzxx-item{
  .rzxx-item-info{
    display: flex;
    .line{
      width: .01rem;
      height: .4rem;
      background: #E6EBF2;
      margin: .06rem .6rem 0 0;
    }
    .info-item{
      padding-right: .6rem;
      .info-item-title{
        font-size: .16rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        display: block;
        margin-bottom: .1rem;
        .view{
          font-size: .16rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #1A66FF;
          margin-left: .16rem;
          cursor: pointer;
          display: inline-block;
        }
      }
      .info-item-value{
        font-size: .16rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: .3rem;
        color: #333333;
        
      }
      .headImg{
        width: .9rem;
        height: .51rem;
        border-radius: .06rem;
        object-fit: cover;
        margin: 0 0.2rem 0 0;
      }
    }
    .grjj{
      .info-item-value{
        font-size: .16rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: .3rem;
        color: #333333;
      }
    }
  }
}
.mt60{
  margin-top: .6rem;
}
</style>
