<template>
    <div class="uplaod">
        <div class="upload-modal" v-if="type == 'view'"></div>
        <a-upload
            name="avatar"
            ref="upload"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            accept="image/*"
            :file-list="fileList"
            :beforeUpload="beforeUpload"
            :customRequest="customRequest"
        >
                <img v-if="headImg" :src="headImg" alt="avatar" width="100%" height="100%" @error="error"/>
                <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                        {{tips || '上传图片'}}
                    </div>
                </div>
        </a-upload>
        <!-- 提示信息 -->
        <div class="upload-tsxx">{{tip}}</div>
    </div>
</template>
<script>
export default {
    props:{
        tip:{},
        maxSize:{},
        tips:{},
        type:{}
    },
    data(){
        return{
            fileList:[],
            imageUrl:'',
            headImg:null,
            loading:false
        }
    },
    mounted(){
        
    },
    methods:{
        error(){
            this.headImg = require('@/assets/default.png')
        },
        beforeUpload(file, fileList){
            //限制图片 格式、size、分辨率
          const isJPG = file.type === 'image/jpg';
          const isJPEG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < this.maxSize;
          if (!(isJPG || isJPEG || isPNG)) {
            this.$error({
              title: '只能上传JPG、JPEG、PNG格式的图片~',
            });
            return false
          } else if (!isLt2M) {
            this.$error({
              title: '图片超过'+this.maxSize+'M限制，不允许上传~',
            });
            return false
          }
            // this.handleUpload(file);
            // this.fileList = [];
            // this.fileList.push(file);
            // return
        },
        async handleUpload(file){
            this.loading = true
            let formdata = new FormData()
            formdata.append('file', file);
            this.$emit('handleUpload',formdata) 
        },
        customRequest(data){
            console.log(data,1)
            this.handleUpload(data.file);
            this.fileList = [];
            this.fileList.push(data.file);
        }
    }
}
</script>
<style lang="less" scoped>
.uplaod{
    position: relative;
    .upload-modal{
        position: absolute;
        background: transparent;
        top: 0;
        left: 0;
        z-index: 10;
        width: 240px;
        height: 135px;
    }
}
img{
    object-fit: cover;
}
</style>