<template>
    <div class="documentBox  flex-column flex">
        <div class="documentBox-head">
            <label class="title flex alignCenter ">
                <span>下载中心</span>
            </label>
            <img src="../../assets/index/download_banner.png" width="100%"/>
        </div>
        <div class="document-list flex">
            <div class="document-menu">
                <!-- 文档列表 -->
                <template v-if="!loading">
                    <a-menu theme="light"  v-model="current" mode="inline"  @select="change">
                        <a-menu-item v-for="(c) in  menus" :key="c.id">
                                <span>{{c.name}}</span>   
                            </a-menu-item>
                    </a-menu>
                </template>
                <a-spin class="loading" v-else/>
            </div>
            <div class="document-content">
            <component :is="id"></component>
            </div>
        </div>
        
    </div>
</template>
<script>
import menu from '@/router/download.js'
import sdk from './down/sdk.vue'
export default {
    components:{ sdk },
    data(){
        return{
            menus:[],
            current:['sdk'],
            loading:false,
            id:'sdk'
        }
    },
    mounted(){
        this.menus = menu
    },
    methods:{
        change(e){
           let key = e.key
           this.id = key 
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
            background: #FAFAFA;
            height: 100%;
            /deep/.ant-menu-item{
                color:#333;
            }
            /deep/.ant-menu-sub{
                background: #FAFAFA;
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
</style>