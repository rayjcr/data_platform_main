<template>
    <div class="sdk">
        <div class="sdk-head">
            <div class="sdk-title">JAVA SDK工具</div>
            <div class="sdk-tip">提供不同版本JAVA SDK包。</div>
        </div>
        <div class="sdk-content">
            <ul class="sdk-content-list">
                <li>说明</li>
                <li>下载地址</li>
            </ul>
            <div class="sdk-item">
                <div class="title">说明</div>
                <div class="tip"></div>
            </div>
            <div class="sdk-item">
                <div class="title">下载地址</div>
                <div class="tip"></div>
                <div class="sdk-item-down flex  alignCenter justifyCenter">
                    <div class="sdk-item-icon"></div>
                    <div class="sdk-item-text">
                        <label class="sdk-item-title">JAVA SDK 1.10</label>
                        <label class="sdk-item-value">发布日期: 2020-12-29</label>    
                    </div>
                    <div class="icon"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            
        }
    },

}
</script>
<style lang="less" scoped>
    .sdk{
        .sdk-head{
            .sdk-title{
                font-size: .28rem;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #333333;
                margin-bottom: .2rem;
            }
            .sdk-tip{
                font-size: .16rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                line-height: .2rem;
                color: #333333;
            }
        }
        .sdk-content{
            .sdk-content-list{
                margin: .2rem 0 .4rem 0;
                padding: 0 0.2rem;
                li{
                    font-size: .16rem;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    line-height: .2rem;
                    color: #1A66FF;
                    margin-bottom: 0.1rem;
                    position: relative;
                    &::before{
                        content: '';
                        position: absolute;
                        top: 0.08rem;
                        left: -0.18rem;
                        width: .08rem;
                        height: .08rem;
                        border: 1px solid #AEB6C1;
                        border-radius: 50%;
                    }
                }
            }
            .sdk-item{
                .title{
                    font-size: .22rem;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #333333;
                    margin-bottom: .2rem;
                }
                .icon{
                    width: .4rem;
                    height: .44rem;
                    background: url(../../../assets/index/download.png) no-repeat;
                    background-size: 100%;
                    cursor: pointer;
                }
                .sdk-item-title{
                    display: block;
                }
                .sdk-item-text{
                    flex: 1;
                    .sdk-item-title{
                        font-size: .24rem;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        line-height: .3rem;
                        color: #333333;
                    }
                    .sdk-item-value{
                        font-size: .16rem;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        line-height: .3rem;
                        color: #999999;
                    }
                }
                .sdk-item-down{
                    width: 6.3rem;
                    padding: .3rem .4rem;
                    background: #FFFFFF;
                    box-shadow: 0px .06rem .18rem rgba(218, 223, 230, 0.65);
                    opacity: 1;
                    border-radius: .1rem;
                }
            }
        }
    }
</style>