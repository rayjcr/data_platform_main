<template>
    <div class="pg_sub_view">
        <div class="cell">

            <div class="cell_content">
                <div class="interface_info_box">
                    <a-row>
                        <a-col :span="12">
                            <a-form class="commForm">
                                <a-form-item label='接口名称' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                                    <!-- <a-input v-model="form.name" placeholder="请输入接口名称" /> -->
                                    <span>{{form.name}}</span>
                                </a-form-item>
                                <a-form-item label='请求方式' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                                    <!-- <a-radio-group v-model="form.requestType">
                                        <a-radio :value="'GET'"> GET </a-radio>
                                        <a-radio :value="'POST'"> POST </a-radio>
                                    </a-radio-group> -->
                                    <span>{{form.requestType}}</span>
                                </a-form-item>
                                
                                <a-form-item label='请求地址' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                                    <!-- <a-input v-model="form.url" placeholder="请输入请求地址" /> -->
                                    <span>{{form.url}}</span>
                                </a-form-item>
                                <a-form-item label='参数类型' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                                    <!-- <a-select v-model="form.contentType" placeholder="请选择接口类型">
                                        <a-select-option :value="0"> application/x-www-form-urlencoded </a-select-option>
                                        <a-select-option :value="1"> application/json </a-select-option>
                                    </a-select> -->
                                    <span>{{form.contentType === 0 ? 'application/x-www-form-urlencoded' : 'application/json'}}</span>
                                </a-form-item>
                                <a-form-item label='输入参数' :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                                    <div class="tab_box">
                                        <div class="flex align_center mb10" v-for="(item, index) in paramsList" :key="index">
                                            <span class="key">{{item.paramKey+'：'}} <span :title="item.paramComment ? item.paramComment : ''">{{item.paramComment ? '('+item.paramComment+')' : ''}}</span></span>
                                            <a-input v-model="item.paramValue" style="width: 250px;" placeholder="请输入参数值" />
                                        </div>
                                    </div>
                                </a-form-item>
                            </a-form>
                            <div class="flex justifyCenter">
                                <a-button class="dialogConfirm commit_btn" type="primary" @click="onSendRequest">发送请求</a-button>
                            </div>
                        </a-col>
                        <a-col :span="12">
                            <div class="result_box flex">
                                <div class="title">返回结果</div>
                                <div class="content">
                                    <pre>{{resultObj}}</pre>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="loading" v-if="loading">
            <a-spin size="large" />
        </div>
    </div>
</template>

<script>
import * as API from '@/api/interface.js'

export default {
    props: {
        apiId: {}
    },
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
        if(this.apiId) this.getData()
    },
    methods: {
        getData(){ // 获取配置信息
            API.getInterfaceById({ id: this.apiId }).then(res => {
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
.pg_sub_view {
    height: 100%;
    background: #fff;
    overflow: hidden;
}
/deep/ .ant-row {
    width: 100%;
    height: 100%;
    .ant-col, .ant-col-12 {
        height: 100%;
    }
}
.cell {
    width: 100%;
    height: 100%;
    .cell_top {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: 700;
        border-bottom: 1px solid #eee;
        padding-left: 20px;
    }
    .cell_content {
        width: 100%;
        height: 100% ;
        overflow-y: auto;
    }
    .cell_footer {
		width: 100%;
		height: 70px;
		border-top: 1px solid #eee;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.commForm {
    /deep/ .ant-form-item {
        margin-bottom: 10px;
    }
}
.interface_info_box {
    height: 100%;
    padding: 10px 0;
}
.tab_box {
    width: 100%;
    height: 180px;
    border-top-width: 0;
    .key {
        width: 120px;
        text-align: right;
        line-height: 32px;
    }
}
.tab_pane_box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.tools_icon {
    margin-left: 10px;
    .iconfont {
        font-size: 30px;
        line-height: 30px;
        cursor: pointer;
    }
}
.textarea {
    width: 70%;
    height: 100%;
    border-radius: 4px;
    padding: 10px;
    resize: none;
}
.commit_btn {
    margin-left: 20%;
    margin-top: 5px;
    padding: 0 60px;
}
.result_box {
    width: 100%;
    height: 100%;
    .title {
        font-size: 16px;
        color: #747E93;
    }
    .content {
        flex: 1;
        margin-right: 100px;
        margin-left: 10px;
        height: 100%;
        border: 1px solid #e1e1e1;
        padding: 10px;
        overflow-y: auto;
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    }
}
.loading {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
}
</style>