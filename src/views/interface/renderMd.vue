<template>
    <div class="md_box">
        <MarkdownPreview v-if="md" :initialValue='md' :theme="'light'" :markedOptions="{table:true}" />
        <div class="empty flex justifyCenter alignCenter" v-else>
            <Empty :tip="'暂无上传文档'" />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { MarkdownPreview } from 'vue-meditor'
import Empty from '@/components/Empty/Empty.vue'
export default {
    props: {
        mdUrl: {},
        type:{}, //第三方首页文档中心 documentCenter.vue 
        info:{},// 第三方首页文档中心 documentCenter.vue md内容
    },
    components: { MarkdownPreview, Empty },
    data(){
        return {
            md: null
        }
    },
    created(){
        if(this.type){
            if(this.info) this.md = this.info.content
        }else{
            this.getMd()
        }   
        
    },
    methods: {
        getMd(){
            if(!this.mdUrl) return
            let url = this.common.url + this.mdUrl
            axios({ url }).then(res => {
                this.md = res.data
            })
        },
    }
}
</script>

<style scoped>
.md_box, .empty {
    width: 100%;
    height: 100%;
}

</style>