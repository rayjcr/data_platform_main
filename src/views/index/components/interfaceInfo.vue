<template>
    <div class="sub_view">
         <!-- 应用信息 -->
        <div class="notice-bread">
            <span>我的应用 / </span>
            <span class="notice-point" @click="$router.go(-1)">应用详情 / </span>
            <span>接口详情</span>
        </div>
        <div class="cell w_container">
            <div class="cell_title">接口详情</div>
            <div class="sub_cell">
                <div class="sub_cell_title">基本信息</div>
                <div class="sub_cell_body" v-if="interfaceInfo">
                    <div class="sub_cell_row flex alignCenter">
                        <div class="item">
                            <label>接口名称</label>
                            <span>{{interfaceInfo.name || ''}}</span>
                        </div>
                        <div class="item">
                            <label>接口标签</label>
                            <span>{{interfaceInfo.state ? getInterfaceLabel(interfaceInfo.state) : ''}}</span>
                        </div>
                        <div class="item">
                            <label>主题分类</label>
                            <span>{{interfaceInfo.fmc || ''}}</span>
                        </div>
                        <div class="item">
                            <label>接口分类</label>
                            <span>{{interfaceInfo.mc || ''}}</span>
                        </div>
                        
                    </div>
                    <div class="sub_cell_row">
                        <div class="item">
                            <label>接口地址</label>
                            <span>{{interfaceInfo.url || ''}}</span>
                        </div>
                    </div>
                    <div class="sub_cell_row">
                        <div class="item">
                            <label>接口简介</label>
                            <span>{{interfaceInfo.comment || ''}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sub_cell">
                <div class="sub_cell_title">详细信息</div>
                <div class="sub_cell_body doc_main">
                    <RenderMd v-if="interfaceInfo" :mdUrl="interfaceInfo.file" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getInterfaceById } from '@/api/interface.js'
import RenderMd from '../../interface/renderMd.vue'
export default {
    components: { RenderMd },
    data(){
        return {
            interfaceInfo: null,
        }
    },
    created(){
        console.log(this.$route,1)
        this.getInfo(this.$route.query.id)
    },
    methods: {
        getInfo(id){
            getInterfaceById({id}).then(res => {
                this.interfaceInfo = res.value
            })
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
    .sub_cell_title {
        font-size: .2rem;
        font-weight: bold;
        color: #333333;
        line-height: .26rem;
        margin-bottom: .16rem;
        position: relative;
        &::before {
            content: "";
            width: .06rem;
            height: .2rem;
            background-color: #1A66FF;
            border-radius: 0 2px 2px 0;
            position: absolute;
            left: -.48rem;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .sub_cell_body {
        .sub_cell_row {
            margin-bottom: .2rem;
            .item {
                flex: 1;
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
            &:last-child {
                margin-bottom: 0;
            }
            &:first-child {
                .item {
                    flex: none;
                    width: auto;
                    margin-right: 1rem;
                }
            }
            
        }
        &.doc_main {
            width: 100%;
            min-height: 2.8rem;
            /deep/ .empty {
                padding-top: 1rem;
            }
        }
    }
}

/deep/button.btn{
    border-radius: 20px!important;
}

</style>