<template>
  <div class="logo_box flex align_center">
    <div class="logo_img">
        <img :src="require('@/assets/logo.png')" alt="">
    </div>
    <h1 class="title">{{ common.mc }}</h1>
  </div>
</template>

<script>
import common from '@/api/common.js'
export default {
    data(){
        return {
            common
        }
    }
}
</script>

<style lang="less" scoped>
  .logo_box {
  	width: 100%;
  	height: 100%;
  	padding: 0 0 0 10px;
  	overflow: hidden;
	display: flex;
	align-items: center;
	// position: absolute;
	// top:0;
  	.title {
  		font-size: 20px;
  		color: #FFFFFF;
  		font-weight: 700;
  		display: inline-block;
  		height: 70px;
  		overflow: hidden;
  		margin: 0 0 0 5px;
  		vertical-align: middle;
  		line-height: 70px;
  	}
    .logo_img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        // margin-bottom: 10px;
    }
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        display: block;
    }
  }
  .long_text{
      .title{
          line-height: 35px;
          font-size: 21px;
      }
  }
</style>