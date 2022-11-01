<template>
    <div class="noticeDetail flex flex-column ">
        <div class="notice-head">
            <img src="../../../assets/index/notice_banner.png" width="100%"/>
        </div>
        <div class="notice-content ">
            <div class="noticeBox flex">
                <div class="noticeBox-list">
                    <div class="noticeBox-list-item flex" v-for="(item,index) in notice" :key="index" @click="toDetail(item)">
                        <div class="timeBox flex flex-column alignCenter justifyCenter">
                            <div class="day">{{item.day}}</div>
                            <div class="year-month">{{item.year}}</div>
                        </div>
                        <div class="textBox">
                            <label class="title">{{item.title}}</label>
                            <label class="value">{{item.shortContent}}</label>
                        </div>
                    </div>
                    <a-pagination v-if="notice&&notice.length" show-quick-jumper :total="pagination.total" :showTotal="pagination.showTotal"
				:defaultPageSize="pagination.pageSize" :defaultCurrent="pagination.current" @change="handlePagination" />
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
            notice:[],
            pagination: { //分页
					total: 10,
					current: 1,
					pageSize: 8, //每页中显示10条数据
					showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
				},
        }
    },
    mounted(){
        this.search()
    },
    methods:{
        search(){
            this.pagination.current = 1
            this.myNotice()
        },
        // 查询公告
        async myNotice(){
            let res = await myNotice({
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize
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
            this.pagination.total = res.value.total
        },
        handlePagination(pagination) {
				this.pagination.current = pagination
				this.myNotice()
			},
        toDetail(data){
            this.$router.push('/center/noticeDetail?id='+data.id)
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
    .noticeBox{
        margin: 0.62rem 0 1rem 0;
        .noticeBox-list{
            .noticeBox-list-item{
                cursor: pointer;
                padding: 0.35rem 0;
                border-bottom: 1px solid #eee;
                &:hover{
                    box-shadow: 0 0 .1rem #eee;
                    // width: 14.16rem;
                    padding: 0.35rem 0.5rem;
                    border: 0;
                    border-radius: .1rem;
                    position: relative;
                    overflow: hidden;
                    transform: scale(1.09);
                    background: #fff;
                    &::before{
                        content: '';
                        width: 0.04rem;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background: #1a66ff;
                    }
                }
            }
            width: 100%;
            .timeBox{
                width: .9rem;
                height: .9rem;
                background: rgba(26,102,255,8%);
                
                border-radius: .15rem;
                min-width: .9rem;
                cursor: pointer;
                margin-right: .43rem;
                .day{
                    font-size: .32rem;
                    font-weight: bold;
                    color: #1a66ff;
                    cursor: pointer;
                }
                .year-month{
                    font-size: .14rem;
                     color: #1a66ff;
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
                cursor: pointer;
                .title{
                    display: block;
                    font-size: .22rem;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: .17rem;
                    cursor: pointer;
                }
                .value{
                    font-size: 0.14rem;
                    color: #666;
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
        }
    }
    .notice-content{
        width:  13.16rem;
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
    /deep/.ant-pagination{
        padding: 0 0.2rem;
        text-align: center;
        margin-top: .8rem;
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
}
</style>