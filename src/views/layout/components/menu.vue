<template>
    <a-menu theme="light" v-model="current" mode="horizontal" @select="change">
        <a-menu-item  v-for="item in menus" :key="item.url">
            {{item.name}}
        </a-menu-item>
    </a-menu>
</template>
<script>
export default {
    props:{
        menus:{},
        curr:{},//默认值
    },
    data(){
        return{
            current:[this.curr]
        }
    },
    mounted(){
        let path = this.$route.path
        let url = ''
        if(path.indexOf('index') != -1){
            url = 'index'
        }
        if(path.indexOf('documentCenter') != -1){
            url = 'documentCenter'
        }
        if(path.indexOf('downloadCenter') != -1){
            url = 'downloadCenter'
        }
        this.current = [url]
        this.current = [...this.current]
        localStorage.setItem('menuStatus',url)
    },
    methods:{
        change(e){
            this.$emit('menuChange',e.key)
        }
    },
}
</script>
<style lang="less" scoped>
    .ant-menu-item-selected,
    .ant-menu-dark .ant-menu-item:hover,
     .ant-menu-dark .ant-menu-item-active,
      .ant-menu-dark .ant-menu-submenu-active,
       .ant-menu-dark .ant-menu-submenu-open,
        .ant-menu-dark .ant-menu-submenu-selected,
         .ant-menu-dark .ant-menu-submenu-title:hover{
        background-color: transparent!important;
        color: #1890ff!important;
    }
    .ant-menu{
        font-size: 16px!important;
        background: transparent;
        
    }
    .ant-menu-horizontal{
            border: 0;
        }
        .ant-menu-horizontal > .ant-menu-item:hover,
        .ant-menu-horizontal > .ant-menu-submenu:hover,
         .ant-menu-horizontal > .ant-menu-item-active,
          .ant-menu-horizontal > .ant-menu-submenu-active,
           .ant-menu-horizontal > .ant-menu-item-open,
            .ant-menu-horizontal > .ant-menu-submenu-open,
             .ant-menu-horizontal > .ant-menu-item-selected,
              .ant-menu-horizontal > .ant-menu-submenu-selected{
                  border: 0;
              }
        .ant-menu-horizontal > .ant-menu-item,
        .ant-menu-horizontal > .ant-menu-submenu{
            border: 0;
        }
</style>