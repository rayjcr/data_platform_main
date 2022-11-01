<template>
    <div class="sub_view">
        <!-- 应用信息 -->
        <div class="notice-bread">
            <span>我的应用 / </span>
            <span class="notice-point" @click="$router.go(-1)">应用详情 / </span>
            <span>应用接口调试</span>
        </div>
        <div class="cell w_container">
            <div class="cell_title">信息标准平台-应用接口调试</div>
            <div class="sub_cell">
                <div class="sub_cell_title">{{form.name}}</div>
                <div class="sub_cell_body">
                    <div class="sub_cell_row">
                        <div class="item">
                            <label>请求地址</label>
                            <span>{{form.url || ''}}</span>
                        </div>
                    </div>
                    <div class="sub_cell_row params flex flex-wrap">
                        <div class="item flex alignCenter" v-for="(item, index) in paramsList" :key="index">
                            <span class="key">{{item.paramKey+'：'}} <span :title="item.paramComment ? item.paramComment : ''">{{item.paramComment ? '('+item.paramComment+')' : ''}}</span></span>
                            <a-input v-model="item.paramValue" style="flex: 1;" placeholder="请输入参数值" />
                        </div>
                    </div>
                    <div class="sub_cell_row flex justifyCenter">
                        <a-button type="primary" @click="onSendRequest">发送请求</a-button>
                    </div>
                </div>
            </div>
            <div class="sub_cell">
                <div class="sub_cell_title">返回结果</div>
                <div class="sub_cell_body">
                    <div class="result_box">
                        <pre>{{resultObj}}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as API from '@/api/interface.js'

export default {
    data() {
        return {
            form: {
                apiName: '',
                apiUrl: '',
                requestType: 'GET',
                contentType: 0
            },
            contentType: ['application/x-www-form-urlencoded', 'application/json'],
            paramsList: [
                {
                    paramKey: null,
                    paramValue: null,
                }
            ],
            resultObj: null,
            loading: false
        }
    },
    created(){
        let apiId = this.$route.query.id
        if(this.$route.query.id) this.getData(apiId)
    },
    methods: {
        getData(id){ // 获取配置信息
            console.log(id,1)
            API.getInterfaceById({ id }).then(res => {
                this.form = {
                    ...res.value,
                    contentType: res.value.contentType == 'application/json' ? 1 : 0
                }
                let paramsList = res.value.paramList && res.value.paramList.map(item => {
                    return {
                        ...item,
                        paramValue: null
                    }
                })
                this.paramsList = paramsList || []
                // this.onSendRequest()
            })
        },
        onParamsTypeChagne(value, index){
            this.paramsList[index].paramType = value
            this.paramsList[index].paramValue = null
        },
        paramChagne(type, index){
            if(type == 'add') {
                this.paramsList.push({
                    paramSource: 'PARAM',
                    paramKey: null,
                    paramType: 0,
                    paramValue: null,
                    paramFormatType: 1
                })
            }else{
                this.paramsList.splice(index, 1)
            }
        },
        headerChagne(type, index){
            if(type == 'add') {
                this.headerList.push({
                    paramSource: 'HEADER',
                    paramKey: null,
                    paramValue: null
                })
            }else{
                this.headerList.splice(index, 1)
            }
        },
        onSendRequest(){
            this.loading = true
            this.resultObj = null
            let paramList = this.paramsList.filter(e => e.paramKey || e.paramValue)
            let params = {
                ...this.form,
                contentType: this.contentType[this.form.contentType],
                paramList: [...paramList]
            }
            API.getRequestApi(params).then(res => {
                this.resultObj = JSON.parse(res.value)
                this.loading = false
            }).catch(err => {
                this.loading = false
            })
        },
        
    }
}
</script>

<style lang="less" scoped>
.sub_view {
   width: 100%;
    height: 100%;
    overflow-y: auto;
}
.notice-bread{
    height: 0.58rem;
    line-height: .58rem;
    width: 14.18rem;
    margin: 0 auto;
    .notice-point{
        cursor: pointer;
    }
}
.cell {
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
        margin-bottom: .3rem;
    }
}
.sub_cell {
    margin-bottom: .4rem;
    &:last-child {
        margin-bottom: 0;
    }
    .sub_cell_title {
        font-size: .2rem;
        font-weight: bold;
        color: #333333;
        line-height: .26rem;
        margin-bottom: .16rem;
        position: relative;
    }
    .sub_cell_body {
        .sub_cell_row {
            margin-bottom: .2rem;
            .item {
                
                font-size: .16rem;
                color: #999999;
                label {
                    display: block;
                    margin-bottom: .05rem;
                }
                span {
                    color: #333333;
                }
                
            }
            &.params {
                .item {
                    width: 35%;
                    margin-right: .30rem;
                    margin-bottom: .1rem;
                    .key {
                        width: auto;
                        text-align: left;
                        line-height: 32px;
                    }
                }
            }
            /deep/ .ant-btn {
                width: 200px;
                height: 56px !important;
                font-size: 20px;
                border-radius: 56px !important;
                box-shadow: 0px 6px 30px 0 rgba(57, 140, 249, 0.3);
            } 
            
        }
    }
}

.result_box {
    width: 100%;
    min-height: 3rem;
    max-height: 6rem;
    background-color: #F7F7F7;
    padding: .2rem;
    overflow-y: auto;
    pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
}
</style>