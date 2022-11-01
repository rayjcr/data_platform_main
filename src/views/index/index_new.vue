<template>
   <div class="main flex alignCenter justifyCenter flex-column">
       <div class="menuBox" v-if="isMenu">
           <!--用户没有菜单提示停留在此页面  -->
            <div class="menu">
                <div class="tip mb10">
                    <label class="tip-title">当前账户未分配功能菜单，请联系管理员！</label>
                </div>
            </div>
       </div>
       <div class="roleBox" v-if="isRole">
            <!-- 用户没有角色提示停留在此页面 -->
            <div class="menu">
                <div class="tip mb10">
                    <label class="tip-title">当前账户未分配角色，请联系管理员！</label>
                </div>
            </div>
       </div>
       <div class="back flex alignCenter " v-if="isMenu || isRole" @click="backLogin">
           <span class="iconfont mr10">&#xe64b;</span>
           <label>返回登录</label>
       </div>
   </div>
</template>
<script>
export default {
    // 2022-1-17 
    // 根据类型进行跳转type  0 普通    1第三方用户
    // 0 普通 跳转控制台 无个人中心
    // 1 第三方用户 跳转 安全中心(含应用中心) 
    name:'index_new',
    data(){
        return{
            user:localStorage.getItem('login_user'),
            isRole:false,//是否存在角色
            isMenu:false,//是否存在菜单
        }
    },
    created(){
        let user = this.user ? JSON.parse(this.user):{}
        if(user){
            console.log(user,99999)
            console.log(user.type,222)
            /**
             *  type
             *  0  开发商
                1  系统用
                2  教师
                3  学生
             */
            if(user.type == 0){
                // 跳转第三方首页
               this.$router.push('/center/index')
            }else{
                console.log(user.type == '1',111)
                // 跳转控制台首页
                // 判断是否存在角色
                if(!user.roleId){
                    this.isRole = true
                    this.isMenu = true
                    return
                }
                // 判断是否存在菜单
                // if(!user.menu){
                //     this.isMenu = true
                //     return
                // }
                
                let router = localStorage.getItem('router') ? JSON.parse(localStorage.getItem('router')):[]
                console.log(router,99999)
                let menu = []
                if(router.length > 0){
                    menu = router[0].children
                    // 去掉主页 去掉个人中心
                    menu.pop()
                    if(menu.length > 0){
                        let menuUrl = menu[0].children&&menu[0].children.length > 0 ? menu[0].children[0].path:menu[0].path
                        this.$router.push(menuUrl)
                    }else{
                        this.isMenu = true
                        return
                    }
                }
            }
        }
    },
    mounted(){
        
    },
    methods:{
        backLogin(){
            this.$store.dispatch('casLogout') 
        }
    }
}
</script>
<style lang="less" scoped>
    .menuBox,
    .roleBox{
       .tip-title{
           font-size: 20px;
            font-weight: bold;
            // color: #333;
        }     
    }
    .back{
        margin-top: 60px;
        font-size: 18px;
        color: #1890ff;
        cursor: pointer;
        .iconfont{
            font-size: 30px;
            cursor: pointer;
        }
        label{
            cursor: pointer;
        }
    }
</style>