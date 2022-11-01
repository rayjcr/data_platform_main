<template>
    <div class="documentBox flex-column flex">
        <div class="documentBox-head">
            <label class="title flex alignCenter ">
                <span>文档中心</span>
            </label>
            <img src="../../assets/index/document_bannner.png" width="100%"/>
        </div>
        <div class="document-list flex">
            <div class="document-menu">
                <!-- 文档列表 -->
                <template v-if="!loading">
                    <a-menu theme="light" :defaultOpenKeys="openkeys"  v-model="current" mode="inline"  @select="change">
                        <a-sub-menu v-for="(item,index) in menus" :key="String(index)">
                            <span slot="title">{{item.text}}</span>
                            <a-menu-item v-for="(c) in  item.children" :key="c.id">
                                <a-icon class="icon" type="file-text" theme="filled" />
                                <span>{{c.text}}</span>   
                            </a-menu-item>
                            
                        </a-sub-menu>
                    </a-menu>
                </template>
                <a-spin class="loading" v-else/>
            </div>
            <div class="document-content">
                <div class="mdBox" v-if="!mLoading">
                    <RenderMd :type="1" :info="info"></RenderMd>
                    <!-- <div class="download" v-if="info && info.content && info.fileName">
                        <div class="download-head">下载</div>
                        <div class="download-content">
                            <div class="download-content-item">
                                <div class="imgBox"></div>
                                <div class="textBox">
                                    <label class="textBox-item">{{info.fileName}}</label>
                                    <label class="textBox-item">{{info.createTime}}</label>
                                </div>
                                <div class="download-icon"></div>
                            </div>
                        </div>
                    </div> -->
                </div>
                <a-spin class="loading" v-else/>
            </div>
        </div>
    </div>
</template>
<script>
import {getDocumentCenterTypeList,getDocumentCenterTypeId} from '@/api/documentCenter.js'
import RenderMd from '../interface/renderMd.vue'
export default {
    data(){
        return{
            menus:[],
            current:[],
            loading:false,
            mLoading:false,
            info:null,
            name:this.$route.query.name,
            openkeys:[]
        }
    },
    components:{
        RenderMd
    },
    mounted(){
        this.getDocumentCenterTypeList()
    },
    methods:{
        // 获取文档列表
        async getDocumentCenterTypeList(){
            this.loading = true
            let res = await getDocumentCenterTypeList()
            this.loading = false
            if(res.value.children && res.value.children.length > 0){ 
                


                // 首页开放能力点击跳转文档中心
                // 展开对应树节点 显示对应文档
                if(this.name){
                    let data = res.value.children.filter(item=>item.text == '接口列表')
                    // 取得接口列表序号 展开树节点
                    let index = res.value.children.findIndex(item=>item.text == '接口列表')
                    let currData = []
                    if(data && data.length > 0){
                        // 展开树节点
                        this.openkeys = [String(index)]
                        if(data[0].children && data[0].children.length > 0){
                            currData = data[0].children.filter(item=>item.text == this.name)[0]
                            // 选中树节点
                            this.current = [currData.id]
                            this.getDocumentCenterTypeId(currData.id)
                        }
                    }
                }
                //默认显示第一个文档
                if(!this.name){
                    let curr = null
                    res.value.children.forEach(item=>{
                        if(item.children&&item.children.length > 0){
                            if(!curr) curr = item.children[0]
                        }
                    })
                    this.$nextTick(()=>{
                        this.current = [curr.id]
                        this.openkeys = ['0']
                    })
                    
                    this.getDocumentCenterTypeId(curr.id)
                }
                
                this.menus = res.value.children
            }
        },
        change(e){
            let key = e.key
            this.getDocumentCenterTypeId(key)
        },
        // 文档详情
        async getDocumentCenterTypeId(typeId){
            this.mLoading = true
            let res = await getDocumentCenterTypeId({typeId})
            this.info = res.value
            this.mLoading = false
            
        }
    }
}
</script>
<style lang="less" scoped>
    .documentBox{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: #fff;
        .documentBox-head{
            position: relative;
            .title{
                width: 14.18rem;
                margin: auto;
                position: absolute;
                left: 50%;
                margin-left: -7.09rem;
                height: 100%;
                top: 0;
                font-size: .4rem;
                font-family: MicrosoftYaHei-Bold;
                color: #3C485C;
                font-weight: bold;
            }
        }
        .document-list{
            width: 14.18rem;
            margin: auto;
            height: 100%;
            flex: 1;
            overflow: hidden;
            padding-top: 0.4rem;
        }
        .document-content{
            background: #fff;
            height: 100%;
            width: 100%;
            padding: 0.5rem 0.6rem 0.6rem 0.6rem;
            overflow-y: auto;
            flex: 1;
            position: relative;
            /deep/.markdown-preview{
                font-family: Microsoft YaHei;
            }
            .mdBox{
                height: 100%;
            }
            .download{
               .download-head{
                    font-size: 22px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20px;
                }
                .download-content{
                    overflow: hidden;
                    .download-content-item{
                        width: 50%;
                        float: left;
                    }
                }
            }
            // /deep/.md_box{
            //     height: auto;
            // }
        }
        .document-menu{
            width: 3.2rem;
            // border-right: 1px solid #F0F0F0;
            // position: absolute;
            position: relative;
            // background: #FAFAFA;
            height: 100%;
            /deep/.ant-menu-item{
                color:#333;
            }
            /deep/.ant-menu-sub{
                // background: #FAFAFA;
                padding: 10px 0;
            }
            /deep/.ant-menu-vertical .ant-menu-item:after, 
            /deep/.ant-menu-vertical-left .ant-menu-item:after, 
            /deep/.ant-menu-vertical-right .ant-menu-item:after, 
            /deep/.ant-menu-inline .ant-menu-item:after{
                border-right: 3px solid #1a66ff;
            }
            /deep/.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{
                background: #EBF5FF;
                color:#1a66ff;
            }
             /deep/.ant-menu-item:hover,
             /deep/.ant-menu-item-active,
             /deep/.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
             /deep/.ant-menu-submenu-active,
             /deep/.ant-menu-submenu-title:hover{
                 color:#1a66ff;
            }
            /deep/.ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:after,
            /deep/.ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:after,
            /deep/.ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:after,
            /deep/.ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:after,
            /deep/.ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:before,
            /deep/.ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:before,
            /deep/.ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:before,
            /deep/.ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow:before{
                background: -webkit-gradient(linear, left top, right top, from(#1a66ff), to(#1a66ff));
                background: linear-gradient(to right, #1a66ff, #1a66ff);
            }
            /deep/.ant-menu-vertical .ant-menu-item,
            /deep/.ant-menu-vertical-left .ant-menu-item,
            /deep/.ant-menu-vertical-right .ant-menu-item, 
            /deep/.ant-menu-inline .ant-menu-item, 
            /deep/.ant-menu-vertical .ant-menu-submenu-title, 
            /deep/.ant-menu-vertical-left .ant-menu-submenu-title, 
            /deep/.ant-menu-vertical-right .ant-menu-submenu-title, 
            /deep/.ant-menu-inline .ant-menu-submenu-title{
                margin: 0;
            }
            /deep/.ant-menu-submenu-title{
                font-size: 16px;
                background: #fff;
            }
            .ant-menu-inline{
                height: 100%;
                overflow-y: auto;
                //  background: #FAFAFA;
                overflow-x: hidden;
            }
            .ant-menu{
                font-family: Microsoft YaHei;
            }
           
        }
        
    }
    .loading{
        position: absolute;
        left: 50%;
        top:50%;
    }
    .icon{
         color:#1a66ff;
    }
</style>