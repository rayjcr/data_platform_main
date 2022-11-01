<template>
    <div class="uplaod">
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
                <img v-if="imageUrl" :src="'/api'+imageUrl" alt="avatar" width="100%"/>
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
        tips:{}
    },
    data(){
        return{
            fileList:[],
            imageUrl:'',
            loading:false
        }
    },
    mounted(){

    },
    methods:{
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