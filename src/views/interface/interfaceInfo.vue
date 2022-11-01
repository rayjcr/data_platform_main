<template>
    <div class="pg_view">
        <div class="cell">
            <div class="cell_title">查看接口详细信息</div>
            <div class="cell_main">
                <div class="interface_box flex" v-if="interfaceInfo">
                    <div class="info_top_left">
                        <div class="cell_item">
                            <label>接口名称</label>
                            <span class="flex_1">{{interfaceInfo.name || ''}}</span>
                        </div>
                        <div class="cell_item">
                            <label>主题分类</label>
                            <span class="flex_1">{{interfaceInfo.fmc || ''}}</span>
                        </div>
                        <div class="cell_item">
                            <label>接口分类</label>
                            <span class="flex_1">{{interfaceInfo.mc || ''}}</span>
                        </div>
                        <div class="cell_item">
                            <label>接口标签</label>
                            <span class="flex_1">{{getInterfaceLabel(interfaceInfo.state)}}</span>
                        </div>
                        <div class="cell_item">
                            <label>接口简介</label>
                            <span class="flex_1">{{interfaceInfo.comment || ''}}</span>
                        </div>
                    </div>
                </div>
                <div class="interface_doc">
                    <div class="title">详细信息</div>
                    <div class="doc_main">
                        <RenderMd v-if="interfaceInfo" :mdUrl="interfaceInfo.file" />
                    </div>
                </div>
            </div>
            <div class="cell_footer flex justifyCenter alignCenter" v-if="!source">
                <a-button type="primary" @click="$parent.showInfo = false">关闭</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getInterfaceById } from '@/api/interface.js'
import RenderMd from './renderMd.vue'
export default {
    props: {
        interfaceData: {},
        source:{},//来源
        id:{}
    },
    components: { RenderMd },
    data(){
        return {
            interfaceInfo: null
        }
    },
    created(){
        this.getInfo()
    },
    methods: {
        getInfo(){
            getInterfaceById({id: this.id}).then(res => {
                this.interfaceInfo = res.value
            })
        },
        getInterfaceLabel(label){
            if(!label) return ''
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
.pg_view {
    width: 100%;
    position: absolute;
    left: 0;
    top: 15px;
    bottom: 34px;
    right: 0;
    background: #fff;
    border-radius: 2px;
}
.cell {
    width: 100%;
    height: 100%;
    .cell_title {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 700;
        color: #333333;
        line-height: 48px;
        border-bottom: 1px solid #f0f2f5;
        padding: 0 15px;
    }
    .cell_main {
        width: 100%;
        height: calc(100% - 108px);
        overflow-y: auto;
    }
    .cell_footer {
        width: 100%;
        height: 60px;
        border-top: 1px solid #f0f2f5;
    }
}
.interface_box {
    padding: 20px;
    .info_top_left {
        width: 55%;
    }
    .info_top_right {
        flex: 1;
    }
    .cell_item {
        margin-bottom: 20px;
        font-size: 16px;
        line-height: 22px;
        color: #999999;
        display: flex;
        label {
            width: 100px;
            margin-right: 20px;
            text-align: right;
            color: #666666;
        }
        .cell_item_content {
            width: 100%;
            height: 150px;
            border: 1px solid #f0f2f5;
            border-radius: 10px;
            padding: 10px;
        }
    }
}
.interface_doc {
    width: 100%;
    height: 400px;
    padding: 0 40px;
    .title {
        font-size: 16px;
        line-height: 22px;
        color: #333333;
        font-weight: 700;
        padding-bottom: 10px;
        border-bottom: 1px solid #f0f2f5;
    }
    .doc_main {
        width: 100%;
        height: calc(100% - 32px);
        padding: 0 30px;
    }
}
</style>