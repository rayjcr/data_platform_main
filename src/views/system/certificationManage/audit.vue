<template>
    <a-modal title="认证审核" :visible="visible" width="30%" style="min-width:500px" @cancel="cancel" destroyOnClose :maskClosable="false" :keyboard="false" centered >
        <a-form>
            <a-form-item label="审核" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-radio-group name="radioGroup" v-model="auditStatus" @change="change">
                    <a-radio :value="1">通过</a-radio>
                    <a-radio :value="3">拒绝</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="审核意见" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-textarea v-model="opinion" :maxLength="100" placeholder="请输入审核意见" :rows="6" />
                <label class="len">
                    还可以输入
                <span class="color_blue">{{100 - (opinion?opinion.length : 0)}}</span>字
              </label>
            </a-form-item>
        </a-form>
        <div slot="footer">
            <a-button @click="cancel">关闭</a-button>
            <!-- <a-button type="primary" class="add" :disabled="info&&info.status == 3" :loading="type =='refuse' && loading" @click="onSave('refuse')">拒绝</a-button>
            <a-button type="primary"  class="add" :disabled="info&&info.status == 1" :loading="type =='pass' && loading" @click="onSave('pass')">通过</a-button> -->
            <a-button type="primary" class="add" :loading="loading" @click="onSave()">确定</a-button>
        </div>
    </a-modal>
</template>
<script>
export default {
    props:{
        visible:{},
        info:{}
    },
    data(){
        return{
            opinion: '通过',
            loading:false,
            type:'',
            auditStatus: 1
        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
            this.init()
        },
        init(){
            this.opinion = null
            this.loading = false
        },
        onSave(){
            this.loading = true
            if(this.auditStatus == 3 && !this.opinion){
                this.$info({
                    centered: true,
                    title: '提示',
                    content: '审核意见不能为空！',
                    onOk() {},
                })
                this.loading = false
                return
            }
            this.$emit('onSave',{
                type: this.auditStatus,
                opinion: this.opinion
            })
        },
        change(e){
            if(e.target.value == 1) this.opinion = '通过'
            if(e.target.value == 3) this.opinion = '信息不完善'
        }
    }
}
</script>
<style lang="less" scoped>
/deep/.ant-form-item {
    margin-bottom: 10px !important;
}
</style>