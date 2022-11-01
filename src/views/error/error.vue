<template>
  <div>
    <div class="error_box">
      <h1 class="error_text">{{status}}</h1>
      <label class="error_dec">{{dec}}</label>
    </div>
  </div>
</template>

<script>
  import error from './error.vue'
  export default{
    props:{
      status:{
        default:String
      },
      dec:{
        default:String
      }
    },
    components:{
      error
    },
    data(){
      return{
        
      }
    }
  }
</script>

<style scoped>
  .error_text {
    color: #f3796e;
    text-align: center;
    font-size: 150px;
    margin: 0;
    height: 150px;
    line-height: 100px;
  }

  html,
  body {
    background: #f1f1f1;
  }

  .error_dec {
    display: block;
    text-align: center;
    font-size: 20px;
    color: #494949;
    font-weight: 600;
  }

  .error_box {
    width: 450px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 40%;
    margin: -225px;
/*    border-radius: 50%;
    border: 5px solid #fdfdfd; */
    display: -webkit-flex;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
