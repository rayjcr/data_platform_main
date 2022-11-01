<template>
    <div class="noticeDetail  flex flex-column">
        <div class="notice-head">
            <img src="../../../assets/index/notice_banner.png" width="100%"/>
        </div>
        <div class="notice-content">
            <a-breadcrumb class="notice-bread">
                <a-breadcrumb-item><a href="/center/index">首页</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="/center/notice">平台公告</a></a-breadcrumb-item>
                <a-breadcrumb-item v-if="info">{{info.title}}</a-breadcrumb-item>
            </a-breadcrumb>
            <div class="noticeBox flex">
                <div class="noticeBox-content" v-if="info">
                    <div class="noticeBox-content-head">
                        <label class="title">{{info.title}}</label>
                        <label class="value">
                            <span class="name">发布时间：</span>
                            <span class="name mr15">{{info.createTime}}</span>
                            <span class="name">发布人：</span>
                            <span class="name">{{info.username}}</span>
                        </label>
                    </div>
                    <div class="noticeBox-content-content" v-html="info.content"></div>
                </div>
                <div class="noticeBox-list">
                    <div class="noticeBox-list-item flex" :class="{'active':activeIndex == index}" v-for="(item,index) in notice" :key="index" @click="toDetail(item,index)">
                        <div class="timeBox  flex flex-column alignCenter justifyCenter">
                            <div class="day">{{item.day}}</div>
                            <div class="year-month">{{item.year}}</div>
                        </div>
                        <div class="textBox">
                            <label class="title">{{item.title}}</label>
                            <label class="value">{{item.shortContent}}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="homePage-foot flex flex-column alignCenter justifyCenter">杭州天音计算机系统工程有限公司</div>
    </div>
</template>
<script>
import {getById,myNotice} from '@/api/notification.js'
export default {
    data(){
        return{
            info:null,
            notice:[],
            activeIndex:0
        }
    },
    async mounted(){
        await this.getById(this.$route.query.id)
        this.myNotice()
    },
    methods:{
        async getById(noticeId){
            let res = await getById({noticeId})
            this.info = res.value
        },
        toDetail(data,index){
            // 点击当前通知不跳转
            this.activeIndex = index
            this.getById(data.id)
        },
        // 查询公告
        async myNotice(){
            let res = await myNotice({pageNum:1,pageSize:10})
            res.value.records.forEach((item,index)=>{
                if(item.id == this.info.id) this.activeIndex = index
            })
            this.notice = res.value.records.map((item)=>{
                let time = item.createTime.substring(0,10).split('-')
                let day = time[2]
                return{
                    ...item,
                    day,
                    year: time[0] +'-' +time[1]
                }
            })
            
        },
    }
}
</script>
<style lang="less" scoped>
.noticeDetail{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    overflow-y: auto;
    .notice-bread{
        margin-top: 48px;
    }
    .noticeBox{
        margin-top: 72px;
        .noticeBox-content{
            margin-right: .42rem;
            width: 8.98rem;
            min-width: 8.98rem;
            .noticeBox-content-head{
                .title{
                    display: block;
                    font-size: 36px;
                    color: #333;
                    font-weight: bold;
                    // height: 35px;
                    line-height: 40px;
                    margin-bottom: 20px;
                }
                .value{
                    color: #999;
                    font-size: 14px;
                    // height: 12px;
                    // line-height: 12px;
                    display: block;
                }
                .mr15{
                    margin-right: .15rem;
                }
            }
            .noticeBox-content-content{
                margin-top: 50px;
                font-size: 16px;
                color: #333;
                overflow: hidden;
                /deep/img,
                /deep/video{
                    width: 100%;
                }
            }
        }
        .noticeBox-list{
            .noticeBox-list-item{
                cursor: pointer;
                width: 3.6rem;
                padding: 0.16rem;
                box-shadow: 0 0 10px #eee;
                border-radius: 0.1rem;
                margin-bottom: 0.16rem;
            }
            width: 100%;
            .timeBox{
                width: .8rem;
                height: .8rem;
                
                background: #f4f5f9;
                border-radius: .15rem;
                min-width: .8rem;
                cursor: pointer;
                color:#666;
                margin-right: .2rem;
                .day{
                    font-size: .32rem;
                    font-weight: bold;
                    cursor: pointer;
                }
                .year-month{
                    font-size: .14rem;
                     white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                    text-align: center;
                    cursor: pointer;
                }
            }
            .textBox{
                flex: 1;
                width: 2.24rem;
                cursor: pointer;
                .title{
                    display: block;
                    font-size: .18rem;
                    font-weight: bold;
                    color:#666;
                    margin-bottom: .12rem;
                    cursor: pointer;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                }
                .value{
                    font-size: 0.16rem;
                    color:#999;
                    word-break: break-all;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    width: 100%;
                    cursor: pointer;
                }
            }
            .active{
                .day{
                    color: #1a66ff;
                }
                .year-month{
                     color: #1a66ff;
                }
                .title{
                     color: #333;
                }
                .value{
                     color: #666;
                }
                .timeBox{
                    background: rgba(26,102,255,8%);
                }
            }
        }
    }
    .ant-breadcrumb,
    .ant-breadcrumb > span:last-child{
        font-size: 16px;
        color: #999;
    }
    
    .notice-content{
        width: 13.23rem;
        margin: auto;
        flex: 1;
    }
    .homePage-foot{
        width: 100%;
        height: 1em;
        min-height: 1rem;
        background: #242a37;
        font-size: .14rem;
        color: rgba(255, 255, 255, 0.5);
    }
}
</style>