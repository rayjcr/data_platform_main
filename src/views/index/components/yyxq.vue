<template>
    <div class="detailBox">
        
        <div class="w_container" v-if="!v_vis">
            <!-- 应用信息 -->
            <a-breadcrumb class="notice-bread">
                <a-breadcrumb-item><a href="/center/yyjr">我的应用</a></a-breadcrumb-item>
                <a-breadcrumb-item>应用详情</a-breadcrumb-item>
            </a-breadcrumb>
            <div class="cell client_info_box flex">
                <template v-if="clientInfo">
                    <div class="client_logo">
                        <img class="headImg" :src="headImg" @error="error"/>
                    </div>
                    <div class="client_info flex_1">
                        <div class="client_name">{{clientInfo.clientName}} <span class="tag">{{clientInfo.joinType == '2'?'OAuth2.0':'CAS Client'}}</span></div>
                        <div class="cell_row flex">
                            <div class="info_item">
                                <label>AppId</label>
                                <span>{{clientInfo.status == '1'?'未获得':(clientInfo.status == '2'?clientInfo.clientId:'已回收')}}</span>
                                <span v-if="clientInfo.status == '1'">（审核通过后可获得）</span>
                            </div>
                            <div class="info_item app_secret">
                                <label>AppSecret</label>
                                <span class="sel" v-if="!s_vis && clientInfo.status == '2'" @click="s_vis = true">查看</span>
                                <div class="box flex alignCenter" v-if="s_vis">
                                    <span class="copySecret" ref="secret" :title="clientInfo.clientSecret || ''">{{clientInfo.clientSecret || '暂无'}}</span>
                                    <span class="sel" @click="copy">复制</span>
                                    <span class="sel" @click="s_vis = false">隐藏</span>
                                </div>
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
                            <div class="info_item">
                                <label>接入/上架日志</label>
                                <span class="sel" @click="viewLog">查看</span>
                            </div>
                            <div class="info_item">
                                <label>接入时间</label>
                                <span>{{clientInfo.createTime || ''}}</span>
                            </div>
                            <div class="info_item">
                                <label>上架状态</label>
                                <span>{{clientInfo.publishStatus == '5'?'待审核':(clientInfo.publishStatus == '6'?'已下架':(clientInfo.publishStatus == '7'?'已上架':''))}}</span>
                            </div>
                            <div class="info_item">
                                <label>上架时间</label>
                                <span>{{clientInfo.publishTime || ''}}</span>
                            </div>
                        </div>
                        <div class="cell_row status flex">
                            <div class="info_item mr77">
                                <label>应用级别</label>
                                <span>{{clientInfo.levelType ? (clientInfo.levelType == 1 ? '局端应用' : '学校应用') : ''}}</span>
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
                </template>
                <!-- 空提示 -->
                <Empty :tip="'暂无数据'" v-else/>
            </div>
            <!-- 应用接口列表 -->
            <div class="cell client_API">
                <div class="cell_title flex justifySpaceBetween alignCenter">
                    <span>信息标准平台-应用接口列表</span>
                    
                </div>
                <div class="cell_body flex">
                    <div class="categary_box">
                        <!-- 主题分类 -->
                        <div class="categary_item"  :class="item.dm == type?'active':''" v-for="(item,index) in typeList" :key="index" @click="getJk(item)">
                            {{item.mc}}
                        </div>
                    </div>
                    <div class="interface_box">
                        <!-- 接口分类 -->
                        <div class="auditBox flex">
                            <a-select v-model="auditType" allowClear class="auditBox-select" style="width:150px" placeholder="请选择接口分类" @change="search">
                                <a-select-option v-for="(item,index) in auditList"  :key="index" :value="item.dm">{{item.mc}}</a-select-option>
                            </a-select>
                            <div class="auditBox-search ml10">
                                <a-input-search class="search_input " v-model="clientValue" placeholder="请输入接口名称" @search="search" />
                            </div>
                        </div>
                        <div class="interface_list flex flex-wrap">
                            
                            <div class="interface_item" v-for="(item, index) in interfaceList" :key="index">
                                <div class="name main_cursor_pointer" @click="viewData(item)">{{item.name}}</div>
                                <div class="tag">
                                    <span class="tag_item">{{getInterfaceLabel(item.state)}}</span>
                                </div>
                                <div class="comment">
                                    {{item.comment}}
                                </div>
                                <div class="btn_cell flex justifyCenter">
                                    <!-- <span class="apply_btn" @click="clientApiSave(item, 'request')">申请授权</span>  -->
                                    <span class="apply_btn" @click="clientInfo.levelType == 1 ? clientApiSave(item, 'request') : onSetDept(item, 'request')">申请授权</span> 
                                </div>
                            </div>
                        </div>
                        <div class="pagination_box" v-if="interfaceList.length > 0">
                            <a-pagination class="pagination" size="large" v-model="apiPagination.current" :page-size.sync="apiPagination.pageSize" :total="apiPagination.total" :show-total="total => `共 ${total} 条`" showQuickJumper @change="change"/>
                        </div>
                        <!-- 空提示 -->
                        <Empty :tip="'暂无数据'" v-if="interfaceList.length == 0"/>
                    </div>
                </div>
            </div>
            <!-- 应用接口授权列表 -->
            <div class="cell client_API_auth">
                <div class="cell_title">
                    <span>信息标准平台-应用接口授权列表</span>
                </div>
                <div class="cell_body ">
                    <div class="flex flex-wrap">
                        <div class="interface_item" v-for="(item, index) in clentList" :key="index">
                            <div class="name ">
                                <div class="interface_title main_cursor_pointer" :title="item.name" @click="viewData(item)"> {{item.name}} </div>
                                <!-- levelType 
                                     1 局端应用 显示审核状态 
                                     2 校端应用 接口详情显示审核状态
                                     getStatus 取状态对应中文名
                                     
                                 -->
                                <span class="status" v-if="clientInfo.levelType == 1" :class="getStatus(item,'classname')">{{getStatus(item,'mc')}}</span>
                                <span class="status online" :class="item.status == '0'?'refuse':(item.status == '1'?'success':'')">{{item.status == '0'?'下线':(item.status == '1'?'上线':'')}}</span> 
                            </div>
                            <div class="tag">
                                <span class="tag_item">{{getInterfaceLabel(item.state)}}</span>
                            </div>
                            <div class="comment" :title="item.comment">
                                {{item.comment}}
                            </div>
                            <div class="btn_cell flex justifyCenter">
                                <!-- 
                                    接口审核中，显示接口授权日志
                                    接口审核通过，显示调试接口、授权日志
                                    接口审核拒接，显示重新授权、授权日志
                                    接口下线，显示接口授权日志
                                    校端调试接口 只要有一个学校通过 就显示
                                 -->
                                <span class="apply_btn color_blue" v-if="debugShow(item)" @click="viewData(item, 'debug')">调试接口</span> 
                                <!-- 暂时先不加 -->
                                <!-- <span class="apply_btn" v-if="item.clientApi.status == '2'" >取消授权</span>  -->
                                <span class="apply_btn color_blue" v-if="clientInfo.levelType == 2" @click="onSetDept(item,'backShow')">授权机构</span> 
                                <!-- levelType 
                                     1 局端应用 
                                     2 校端应用 
                                 -->
                                <span class="apply_btn color_blue" v-if="refreshReq(item)" @click="clientApiSave(item,'refresh')">重新申请授权</span> 
                                <span class="apply_btn color_blue" @click="viewInterLog(item)">授权日志</span> 
                            </div>
                        </div>
                    </div>
                    <div class="pagination_box" v-if="clentList.length > 0">
                        <a-pagination class="pagination" size="large" v-model="paginations.current" :page-size.sync="paginations.pageSize" :total="paginations.total" :show-total="total => `共 ${total} 条`" showQuickJumper @change="changes"/>
                    </div>
                    <!-- 空提示 -->
                    <Empty :tip="'暂无数据'" v-if="clentList.length == 0"/>
                </div>
            </div>
        </div>
        <!-- <InterfaceInfo v-else-if="v_vis == 'info'" :interfaceData="interfaceInfos"  :id="interfaceInfos.id" /> -->
        <!-- <InterfaceDebug v-else-if="v_vis == 'debug'" :apiId="interfaceInfos.id" /> -->
        <!-- 应用审核记录 -->
        <auditLog :visible="visible" :log="log" :info="clientInfo" @cancel="visible = false"></auditLog>
        <!-- 接口审核记录 -->
        <interfaceLog :visible="log_visible" :log="interLog" :info="logInfo" @cancel="log_visible = false"></interfaceLog>
        <!-- 组织机构选择 -->
        <SelDept ref="selDept" v-if="isShowDept" :visible="isShowDept" :interfaceInfo="onSelInterface" @clientApiSave="clientApiSave" />
    </div>
</template>
<script>
import * as API from '@/api/data'
import {interfaceType,clentApiApplyList,clientApiSave,getClentApiShowList,clientAuditLog,getClientApiLogByclientApiId} from '@/api/interface.js'
import InterfaceInfo from './interfaceInfo.vue'
import InterfaceDebug from './debug.vue'
import Empty from '@/components/Empty/Empty.vue'
import auditLog from '../../application/auditLog.vue'
import interfaceLog from '../../interface/AuditLog.vue'
import SelDept from './selDept.vue'
export default {
    components:{
     InterfaceInfo,Empty,InterfaceDebug,auditLog,interfaceLog,SelDept
    },
    data(){
        return{
            clientId:this.$route.query.clientId || '',
            clientInfo:{},
            typeList:[],
            s_vis:false,
            interfaceList: [],
            apiPagination:{
                //分页
                total: 0,
                current: 1,
                pageSize: 6, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            type:null,
            interfaceInfos:{},
            v_vis:false,
            log_vis:false,
            j_loading:false,
            clentList:[],
            paginations:{
                //分页
                total: 0,
                current: 1,
                pageSize: 8, //每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['6','10', '20', '50', '100'], //每页中显示的数据
                showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
            },
            debug_vis: false,
            headImg:null,
            visible:false,
            log:null,
            info:{},
            clientValue:null,
            log_visible:false,
            interLog:null,
            logInfo:null,
            isShowDept: false,
            onSelInterface: '',
            // 接口分类
            auditType:undefined,
            auditList:[]
        }
    },
    async mounted(){
        // 查询应用详情
        await this.getClientInfo()
        if(!this.clientInfo){
            this.$info({
                centered: true,
                title: '提示',
                content: '应用不存在或已被删除!',
                onOk() {},
            })
            this.$router.push('/center/yyjr')
            return
        }
        // 获取接口分类
        await this.interfaceType()
        await this.interfaceType(this.type)
        this.initClentApiShowList()
    },
    methods:{
        async viewLog(){
            await this.clientAuditLog(this.clientInfo.clientId)
            this.visible = true
        },
        // 应用审核记录
        async clientAuditLog(clientId){
          let res = await clientAuditLog({clientId})
          this.log = res.value
        },
        // 图片报错显示默认图
        error(){
            this.headImg = require('@/assets/default.png')
        },
        // 复制AppSecret
        copy(){
            let str = this.$refs.secret.innerHTML
            var save = function (e) {
                //设置需要复制模板的内容
                e.clipboardData.setData('text/plain',str);
                //阻止默认行为
                e.preventDefault();
            }
            // h5监听copy事件，调用save函数保存到模板中
            document.addEventListener('copy',save);
            // 调用右键复制功能
            document.execCommand('copy');
            //移除copy事件
            document.removeEventListener('copy',save);
            this.$message.success('复制成功！');
        },
        // 返回上一级
        back(){
            this.$router.go(-1);//返回上一层
        },
        // 查询应用详情
        async getClientInfo(){
            let res = await API.getClientInfo(this.clientId)
            this.clientInfo = res.value
            this.headImg = this.clientInfo?('/api/' + this.clientInfo.logo):null
        },
        // 获取接口分类
        async interfaceType(id){
            let res = await interfaceType({fdm:id || 0})
            if(!id){
                this.typeList = res.value
                this.type = res.value?res.value[0].dm:''
               
                this.search()
            }else{
                // 接口分类
                this.auditList = res.value
            }
            

           
        },
        change(pagination) {
            this.apiPagination.current = pagination
            this.getList()
        },
        initClentApiShowList(){
            this.paginations.current = 1
            this.getClentApiShowList()
        },
        // 授权接口分页
        changes(page, pageSize){
          this.paginations.current = page;
          this.paginations.pageSize = pageSize;
          this.getClentApiShowList()
        },
        // 获取授权接口列表
        async getClentApiShowList(){
          this.j_loading = true
          let res = await getClentApiShowList({clentId:this.clientInfo.clientId,pageSize:this.paginations.pageSize,pageNum:this.paginations.current})
        //   res.value.records = res.value.records.map(item=>{
        //     //   flmc ??不知道干什么用
        //     // let mc = this.typeList? this.typeList.filter(e => e.dm == item.type)[0].mc:''
        //     // return{
        //     //   ...item,
        //     //   flmc:mc
        //     // }
        //   })
          this.j_loading = false
          this.clentList = res.value.records
          this.paginations.total = res.value.total
           
        },
        search(){
            this.apiPagination.current = 1
            this.getList()
        },
        async getList(){
            let res = await clentApiApplyList({
                pageSize:this.apiPagination.pageSize,
                pageNum: this.apiPagination.current,
                // 主题分类
                fdm:this.type,
                clentId: this.clientId,
                // 加个参数搜索接口名称
                name: this.clientValue,
                // 接口分类
                type: this.auditType
            })
            this.interfaceList = res.value.records
            this.apiPagination.total = res.value.total
        },
        async getJk(data){
            this.type = data.dm
            this.auditType = undefined
            await this.interfaceType(this.type)
            this.search()
        },
        // 申请授权
        async clientApiSave(data,type){
            let res = await clientApiSave({
                apiId: data.id,
                apiName: data.name,
                clientId: type == 'request' ? this.clientId : data.clientApi.clientId,
                id: type == 'request' ? '' : data.clientApi.id,
                status: data.status,
                clientApiDept: data.deptList || []
            })
            if(res.resultCode == 200){
                  this.$message.success('申请授权成功!');
                  this.search()
                  this.paginations.current = 1
                  this.getClentApiShowList(this.clientInfo.clientId)
                  if(type = 'request'){
                     if(this.$refs.selDept) this.$refs.selDept.loading = false
                  }
                  this.isShowDept = false
                  
                //  //   校端授权刷新授权接口列表
                //   this.getClentApiShowList()
            }
        },
        viewData(item, type){
            this.interfaceInfos = item
            if(type == 'debug' ){
                // 调试接口
                this.$router.push('/center/interfaceInfo/debug?id='+item.id)
            }else{
                this.$router.push('/center/interfaceInfo?id='+item.id)
                
            }
        },
        getInterfaceLabel(label){
            let arr = label.split(',')
            let labelArr = ['应用认证集成', '应用开发者集成']
            let text = ''
            arr.forEach(item => {
                text += labelArr[Number(item) - 1] + '，'
            })
            return text.substring(0, text.length - 1)
        },
        // 查看接口审核记录
        viewInterLog(data){
            if(data.clientApi && data.clientApi.id){
                this.getClientApiLogByclientApiId(data.clientApi.id)
                this.logInfo = data
                this.log_visible = true
            }
        },
        async getClientApiLogByclientApiId(clientApiId){
            let res = await getClientApiLogByclientApiId({clientApiId})
            this.interLog = res.value    
        },
        async onSetDept(data, type){
            // 点击授权机构前先刷新授权接口列表取最新的数据
            // 
            
            if(type == 'backShow'){
                await this.getClentApiShowList()
                data = this.clentList.filter(item=>item.id == data.id)[0]
                data['showBack'] = true
            }
            this.onSelInterface = data || null
            this.isShowDept = true
        },
        // 取局端应用接口状态
        getStatus(data,type){
            let mc = ''
            if(data.clientApi.clientApiDept && data.clientApi.clientApiDept.length > 0){
                let {status} = data.clientApi.clientApiDept[0]
                if(type == 'mc'){
                    mc = status == '2'?'已通过':(status == '3'?'已拒绝':'待审核')
                }else{
                    mc  = status == '2'?'success':(status == '3'?'refuse':'')
                } 
            }
            return mc
        },
        // 重新申请授权判断显示
        refreshReq(data){
            if(data.clientApi.clientApiDept && data.clientApi.clientApiDept.length > 0){
                let {status} = data.clientApi.clientApiDept[0]
                if(status == '3' && data.status != 0 && this.clientInfo.levelType == 1) return true
            }
        },
        // 调试接口判断显示
        debugShow(data){
            if(data.clientApi){
                if(data.clientApi.clientApiDept && data.clientApi.clientApiDept.length > 0){
                    let len = data.clientApi.clientApiDept.findIndex(item=>item.status == 2)
                    if(len > -1) return true
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.detailBox {
    width: 100%;
    height: 100%;
    // padding-top: 40px;
    overflow-y: auto;
}
.interface_title{
    max-width: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    margin-right: .1rem;
    line-height: .24rem;
    vertical-align: bottom;
    text-decoration: underline;
}
.cell {
    width: 100%;
    min-height: 3.9rem;
    background-color: #ffffff;
    border-radius: .10rem;
    box-shadow: 0 1px 10px 0 rgba(59, 100, 168, .1);
    padding: .48rem;
    margin-bottom: .20rem;
    .cell_title {
        font-size: .2rem;
        line-height: .2rem;
        font-weight: bold;
        color: #333333;
        margin-bottom: .4rem;
    }
}
.auditBox-search{
    /deep/input{
        border-radius: 4px!important;
    }
}
.client_info_box {
    height: 4.5rem;
    .client_logo {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: .05rem;
        // background-color: #2072fe;
        margin-right: .32rem;
        overflow: hidden;
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

.interface_item {
    height: 2.2rem;
    border: 1px solid #eeeeee;
    border-radius: 0.05rem;
    margin-bottom: .24rem;
    padding: .3rem;
    position: relative;
    &:hover{
        border: 0;
        box-shadow: 0 0 10px #eee;
    }
    .name {
        font-size: .18rem;
        color: #333333;
        line-height: .18rem;
        margin-bottom: .16rem;
        text-decoration: underline;
    }
    .tag {
        margin-bottom: .16rem;
        .tag_item {
            display: inline-block;
            padding: .05rem .11rem;
            border: 1px solid #eeeeee;
            border-radius: .05rem;
            font-size: .12rem;
            line-height: .12rem;
            color: #999999;
            cursor: default;
        }
    }
    .comment {
        font-size: .14rem;
        line-height: .2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .btn_cell {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: .3rem;
        .apply_btn {
            font-size: 0.14rem;
            // color: #7787a2;
            cursor: pointer;
            width: 1rem;
            text-align: center;
            line-height: .32rem;
            height: 0.32rem;
            
        }
    }
}
.client_API {
    .cell_title {
        /deep/ .search_input {
            width: 2.82rem;
            height: .42rem;
            border: 1px solid #e0e0e0;
            border-radius: .42rem;
            overflow: hidden;
            input {
                border: 0;
                padding: 0 0.2rem;
                font-size: 0.16rem;
                color: #333;
                line-height: .4rem;
                height: 0.4rem;
            }
        }
    }
    .apply_btn {
        // &:hover{
            background: #1a66ff;
            color: #fff;
            border-radius: .2rem;
        // }
    }
    
    .cell_body {
        height: 6.1rem;
        .categary_box {
            width: 1.6rem;
            height: 100%;
            border-right: 1px solid #eeeeee;
            .categary_item {
                width: 100%;
                height: .48rem;
                padding: 0 0.4rem;
                font-size: .16rem;
                line-height: .48rem;
                text-align: right;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                margin-bottom: .13rem;
                cursor: pointer;
                &.active {
                    font-weight: bold;
                    color: #1a66ff;
                    background-color: rgba(26, 102, 255, .06);
                    position: relative;
                    &::before {
                        content: "";
                        width: 0;
                        height: 100%;
                        border-right: .04rem solid #1a66ff;
                        position: absolute;
                        top: 0;
                        right: 0;
                    }
                }
                &:hover {
                    font-weight: bold;
                    background-color: rgba(241, 242, 245, .5);
                }
            }
        }
        .interface_box {
            flex: 1;
            height: 100%;
            margin-left: .08rem;
            .interface_list {
                width: 100%;
                // height: 4.88rem;
                .interface_item {
                    width: 3.6rem;
                    margin-left: .24rem;
                }
            }
            .pagination_box {
                padding-left: .24rem;
            }
        }
    }
}
.client_API_auth {
    .cell_body {
        .interface_item {
            width: 3.12rem;
            margin-right: .24rem;
            &:nth-of-type(4n + 0){
                margin-right: 0;
            }
            .name {
                // cursor: pointer;
                .status {
                    display: inline-block;
                    font-size: .12rem;
                    line-height: .12rem;
                    padding: .06rem .14rem;
                    color: #7787a2;
                    background-color: rgba(119, 135, 162, .1);
                    border-radius: .24rem;
                    &.success {
                        color: rgb(26, 102, 255);
                        background-color: rgba(26, 102, 255, .1);
                    }
                    &.refuse {
                        color: #ff5e33;
                        background-color: rgba(255, 94, 51, .1);
                    }
                }
            }
            .btn_cell {
                padding: 0 .15rem;
                .apply_btn {
                    width: 33.33%;
                    text-align: center;
                    border-right: 1px solid #eeeeee;
                    &:last-child {
                        border-right: 0;
                    }
                   
                }
            }
        }
    }
}
.progress {
    width: 100%;
    padding-left: .24rem;
    .progress_item {
        width: 100%;
        margin-bottom: .4rem;
        position: relative;
        &::before {
            content: "";
            width: .19rem;
            height: .57rem;
            background: url('../../../assets/progress.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 0;
            left: .15rem;
            transform: translateY(-100%);
        }
        &:first-child {
            &::before {
                background: none;
            }
        }
        .status {
            width: .48rem;
            height: .48rem;
            border-radius: 50%;
            background-color: #1a66ff;
            color: #ffffff;
            font-size: .14rem;
            text-align: center;
            line-height: .48rem;
            margin-right: .2rem;
        }
        .info {
            flex: 1;
            p {
                margin-bottom: 0;
                font-size: .16rem;
                color: #333333;
                &:nth-of-type(2) {
                    font-size: .12rem;
                    color: #adadad;
                }
            }
        }
    }
}
.p20{
    padding: 20px;
}
.notice-bread{
    height: 0.58rem;
    line-height: .58rem;
}
.headImg{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
/deep/.ant-input-search-icon{
    font-size: .25rem;
    color: #ccc;
    &:hover{
        color: #1a66ff;
    }
}
/deep/.ant-pagination{
    padding: 0 0.2rem;
    text-align: left;
    margin-top: .06rem;
    .ant-pagination-total-text{
        font-size: .14rem;
        color: #666;
        margin-right: 0.38rem;
    }
    .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link{
        border: 0;
    }
    .ant-pagination-item{
        border: 0;
        color: #666;
        font-size: .14rem;
    }
    .ant-pagination-options-quick-jumper{
        font-size: .14rem;
        color: #666;
    }
    .ant-pagination-item-active{
        background: #1a66ff;
        a{
            color: #fff!important;
        }
        
    }
    .ant-pagination-item:focus a,
    .ant-pagination-item:hover a{
        color: #1a66ff;
    }
}
.online{
    margin-left: .1rem;
}
.mr77{
    margin-right: 77px;
}
.auditBox-select{
    margin: 0 0 0.24rem .24rem ;
}
.color_blue{
    color: #1a66ff!important;
}
</style>