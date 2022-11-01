<template>
    <a-modal

      :title="title"
      :visible="visible"
      width="500"
      style="min-width:500px"
      @cancel="cancel"
      destroyOnClose
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      centered
      :bodyStyle="{'height':'500px','overflowY':'auto'}"
    >
      <div class="imgBox">
          <template v-if="currInfo&&currInfo.userType == 2">
            <!-- 个人 -->
            <div class="img">
                <label class="title">身份证头像面</label>
                <img v-if="headImg2" :src="headImg2" class="headImg" @error="error1" width="480" height="270"/>
            </div>
            <div class="img">
                <label class="title">身份证国徽面</label>
                <img v-if="headImg1" :src="headImg1" class="headImg" @error="errors" width="480" height="270"/>
            </div>
            
          </template>
          <template v-else>
            <!-- 企业 -->
            <img v-if="headImg2" :src="headImg2" class="headImg" @error="error1" width="480" height="270"/>
          </template>
      </div>                                                  
    </a-modal>
</template>
<script>
export default {
    props:{
        visible:{},
        currInfo:{}
    },
    data(){
        return{
            title:'',
            headImg1:null,
            headImg2:null,
        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        },
        error1(){
            this.headImg2 = require('@/assets/default.png')
        },
        errors(){
            this.headImg1 = require('@/assets/default.png')
        },
    },
    watch: {
        visible() {
            if(this.visible){
                this.title = this.currInfo.userType == 2?'个人身份证':'社保登记证'
                 if(this.currInfo.pic1) this.headImg2 = '/api/' + this.currInfo.pic1
                 if(this.currInfo.pic2) this.headImg1 = '/api/' + this.currInfo.pic2
            }
        }    
    },
}
</script>
<style lang="less" scoped>
img{
    object-fit: cover;
    display: block;
}
.img{
    .title{
        display: block;
        margin-bottom: 20px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
        text-align: center;
    }
    img{
        margin-bottom: 40px;
    }
}

</style>