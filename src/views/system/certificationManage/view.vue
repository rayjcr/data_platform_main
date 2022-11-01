<template>
    <a-modal class="commDialog" :title="title" :visible="visible" width="50%" @cancel="exit"
	:maskClosable='false' :keyboard='false' centered>
		<div class="applicationBox flex" v-if="info">
            <div class="info">
                <div class="applicationBox-item">
                    <label class="applicationBox-item-title">用户账号: </label>
                    <label class="applicationBox-item-value">{{info.username}}</label>
                </div>
                <div class="applicationBox-item">
                    <label class="applicationBox-item-title">用户类型: </label>
                    <label class="applicationBox-item-value">{{info.userType == 2?'个人':'企业'}}</label>
                </div>
                <template v-if="info.userType == 1">
                    <!-- 企业 -->
                    <div class="applicationBox-item">
                        <label class="applicationBox-item-title">公司名称: </label>
                        <label class="applicationBox-item-value">{{info.company}}</label>
                    </div>
                    <div class="applicationBox-item">
                        <label class="applicationBox-item-title">税务识别号: </label>
                        <label class="applicationBox-item-value">{{info.unionId}}</label>
                    </div>
                    <div class="applicationBox-item">
                        <label class="applicationBox-item-title">负责人: </label>
                        <label class="applicationBox-item-value">{{info.nickname}}</label>
                    </div>
                    
                </template>
                <template v-else>
                    <!-- 个人 -->
                    <div class="applicationBox-item">
                        <label class="applicationBox-item-title">姓名: </label>
                        <label class="applicationBox-item-value">{{info.nickname}}</label>
                    </div>
                    <div class="applicationBox-item">
                        <label class="applicationBox-item-title">身份证件号: </label>
                        <label class="applicationBox-item-value">{{info.unionId}}</label>
                    </div>
                    
                </template>
                <div class="applicationBox-item">
                    <label class="applicationBox-item-title">手机号: </label>
                    <label class="applicationBox-item-value">{{info.mobile}}</label>
                </div>
                <div class="applicationBox-item">
                    <label class="applicationBox-item-title">邮箱: </label>
                    <label class="applicationBox-item-value">{{info.email}}</label>
                </div>
                <div class="applicationBox-item flex alignBaseline">
                    <label class="applicationBox-item-title">{{info.userType == 1?'公司':'个人'}}简介: </label>
                    <label class="applicationBox-item-value jj">{{info.descripInfo}}</label>
                </div>
            </div>
            <div class="imgBox">
                <template v-if="info.userType == 1">
                    <!-- 企业 -->
                    <div class="applicationBox-item">
                        <img class="img" :src="headImg" width="240" height="135" @error="error"/>
                    </div>
                </template>
                <template v-else>
                    <div class="applicationBox-item mb10">
                        <img class="img" :src="headImg" width="240" height="135" @error="error"/>
                    </div>
                    <div class="applicationBox-item">
                        <img class="img" :src="headImg1" width="240" height="135" @error="errors"/>
                    </div>
                </template>
            </div>
        </div>
		<div slot="footer">
		    <a-button class="dialogClose" @click="exit">关闭</a-button>
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
            title:'查看认证',
            headImg:null,
            headImg1:null,
        }
    },
    methods:{
        exit(){
            this.$emit('exit')
        },
        // 企业认证图片默认图？？？
        error(e){
            this.headImg = null
        },
        errors(e){
            this.headImg1 = null
        },
    },
    watch: {
        visible() {
            if (this.visible) {
                this.headImg = '/api/'+ this.info.pic1
                this.headImg1 = '/api/'+ this.info.pic2
            }
        },
    },
}
</script>
<style lang="less" scoped>
.applicationBox-item{
    line-height: 35px;
    font-size: 15px;
    color:#333;
}
.applicationBox-item-title{
    width: 100px;
    min-width: 100px;
    display: inline-block;
    text-align: right;
}
.applicationBox-item-value{
    margin-left: 10px;
    color:#666;
}
.applicationBox-item{
    img{
        border: 1px solid #eee;
        border-radius: 10px;
    }
    .jj{
        text-align: justify;
        line-height: 20px;
    }
}
.info{
    flex: 1;
    overflow: hidden;
}
</style>