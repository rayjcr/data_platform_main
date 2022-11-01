<template>
    <div class="mdBox">
        <div class="mdBox-html" v-html="html"></div>
        <MarkdownPreview v-if="html" :initialValue='html' :theme="'light'" :markedOptions="{table:true}" />
    </div>
</template>
<script>
import { MarkdownPreview } from 'vue-meditor'
export default {
    props:{
        url:{}
    },
    components: { MarkdownPreview},
    data(){
        return{
            html:null,
        }
    },
    mounted(){
       if(this.url) this.getMd(this.url)
    },
    methods:{
        getMd(){
            this.html = '../../md/oauth.md'
        }
    }
}
</script>