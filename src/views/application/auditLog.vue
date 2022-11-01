<template>
    <a-modal :title="title" :visible="visible" width="30%" style="min-width:500px" @cancel="cancel" destroyOnClose :maskClosable="false" :keyboard="false" centered :bodyStyle="{'height':'500px','overflowY':'auto'}">
       <div class="timeLine">
        <a-timeline>
            <a-timeline-item v-for="(item,index) in log" :key="index">
                <div slot="dot" class="status" >
                  {{(item.status == 1 || item.status == 5)?'提交':((item.status == 2 || item.status == 7)?'通过':((item.status == 3 || item.status == 6)?'拒绝':''))}}
                </div>
                <!-- 
                  status
                  -------------应用申请------------
                  0 暂存(不进流程)
                  1 提交
                  2 管理员审核 通过
                  3 管理员审核 拒绝
                  -------------应用上架申请------------
                  5 待审核
                  6 管理员审核 拒绝
                  7 管理员审核 通过
                -->
                <div class="color_3" v-if="item.status == 1">用户提交了应用接入申请</div>
                <div class="color_3" v-if="item.status == 2">
                  <span>{{item.nickname}}通过了应用接入申请</span>
                  <span class="success">同意</span>
                </div>
                <template v-if="item.status == 3">
                  <div class="color_3" >{{item.nickname}}拒绝了应用接入申请 ({{item.comment}})</div>
                </template>
                
                <div class="color_3" v-if="item.status == 5">用户提交了应用上架申请</div>
                <template v-if="item.status == 6">
                  <div class="color_3" >{{item.nickname}}拒绝了应用上架申请 ({{item.comment}})</div>
                </template>
                <div class="color_3" v-if="item.status == 7">
                  <span>{{item.nickname}}通过了应用上架申请</span>
                  <span class="success">同意</span>
                </div>

                <div class="color_gray">时间: {{item.time}}</div>
              </a-timeline-item>
        </a-timeline>
         </div>
        <div slot="footer">
            <a-button @click="cancel">关闭</a-button>
            
        </div>
    </a-modal>
</template>
<script>
export default {
    props:{
        visible:{},
        log:{},
        info:{}
    },
    data(){
        return{
            title:'',
        
        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        }
    },
    watch: {
        visible() {
            if(this.visible){
                this.title = this.info.clientName + '审核记录'
                
            }
        }    
    },
}
</script>
<style lang="less" scoped>
.status{
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
    color: #fff;

  }
  .success{
    background: rgb(0, 205, 134);
  }
  .error{
    background:rgb(173, 185, 199)
  }
  .loading{
    background: #ffb600;
  }
 /deep/.ant-timeline-item-content{
    min-height: .7rem;
    margin: 0 0 0 0.5rem;
    top: -.25rem;

  }
  
  .timeLine{
    padding: 20px;
  }
  .color_3{
    font-size: .16rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    margin-bottom: .05rem;
    // height: .3rem;
    line-height: .3rem;
  }
  .color_gray{
    font-size: .12rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
  }
  /deep/.ant-timeline-item-tail {
    border-left: 2px dashed rgba(26,102,255,23%);
    &::before{
      content:'';
      position: absolute;
      width: 0.16rem;
      height: 0.08rem;
      background: url(../../assets/index/yyjr-arrow.png) no-repeat;
      background-size: 100%;
      left: 0;
      top: 50%;
      margin: -0.08rem -0.085rem;
    }
  }
  .status{
    width: .48rem;
    height:.48rem;
    line-height:.48rem;
    font-size: .14rem;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    background: #1A66FF;
  }
  .success{
    background: rgba(0, 205, 134,10%);
    margin-left: 0.1rem;
    min-width: 0.48rem;
    line-height: .24rem;
    display: inline-block;
    border-radius: 0.2rem;
    font-size: .12rem;
    color: #00cd86;
    text-align: center;
    font-weight: bold;
  }
</style>