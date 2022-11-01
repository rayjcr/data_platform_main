<template>
  <a-layout :class="['layout', device]">
    <div v-show="!origin">
      <!-- SideMenu -->
      <a-drawer
        v-if="isMobile()"
        placement="left"
        :wrapClassName="`drawer-sider ${navTheme}`"
        :closable="false"
        :visible="collapsed"
        @close="drawerClose"
      >
        <side-menu
          mode="inline"
          :menus="menus"
          :theme="navTheme"
          :collapsed="false"
          :collapsible="true"
          @menuSelect="menuSelect"
        ></side-menu>
      </a-drawer>

      <side-menu
        v-else-if="isSideMenu()"
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :collapsible="true"
      ></side-menu>
    </div>

    <a-layout :class="[layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh',overflow:'hidden'}">
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '24px 0 0', paddingTop: fixedHeader ? '0' : '0' }">
        <multi-tab v-if="multiTab" ></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer>
        <global-footer />
      </a-layout-footer>

      <!-- Setting Drawer (show in development mode) -->
      <setting-drawer v-if="!production"></setting-drawer>
    </a-layout>

    <!-- 返回首页 -->
    <!-- <div class="back-home" id="dragbtn" v-drag @click="_jumTo">
      <p>个人中心</p>
    </div> -->
  </a-layout>

</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import MultiTab from '@/components/MultiTab'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
// import { asyncRouterMap } from '@/config/router.config.js'
import SettingDrawer from '@/components/SettingDrawer'
import store from '../store/index.js'
export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    MultiTab,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  directives: {
    drag(el,bindings){
        let firstTime='',lastTime='';
        el.onmousedown = function(e){
            document.getElementById('dragbtn').setAttribute('data-flag',false);
            firstTime = new Date().getTime();
            var disy = e.pageY - el.offsetTop;
            document.onmousemove = function (e){
                el.style.top = (e.pageY - disy) + 'px';
                // 边界限制
                if (e.pageY - disy <= 64) {
                    el.style.top = 64 + "px";  
                }  
                if (e.pageY - disy >= document.body.offsetHeight-64) {
                    el.style.top = document.body.offsetHeight-64 + "px";  
                } 
            }
            document.onmouseup = function(){
                document.onmousemove = document.onmouseup = null;

                // onmouseup 时的时间，并计算差值
                lastTime = new Date().getTime();
                if( (lastTime - firstTime) < 200){
                  document.getElementById('dragbtn').setAttribute('data-flag',true)
                }
            }
        }
    }
  },
  data () {
    return {
      production: config.production,
      collapsed: false,
      menus: [],
      origin: this.$route.query.origin,
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      
      mainMenu: state => state.per
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created () {
    // this.menus = asyncRouterMap.find((item) => item.path === '/').children
    this.menus = this.mainMenu.find((item) => item.path === '/').children.filter((menu) => {
      let meta = menu.meta
      if (typeof meta.isShow === 'undefined') {
        return true
      } else return meta.isShow
    })
   
    this.collapsed = !this.sidebarOpened
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      return left
    },
    menuSelect () {
      if (!this.isDesktop()) {
        this.collapsed = false
      }
    },
    drawerClose () {
      this.collapsed = false
    },
    _jumTo() {
      //  验证是否为点击事件，是则继续执行click事件，否则不执行
        let isClick = document.getElementById('dragbtn').getAttribute('data-flag');
        if(isClick !== 'true') {
          return false
        }
        this.$router.push({
            path: '/index'
        })
    }
  }
}
</script>

<style lang="less">
@import url('../components/global.less');

/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.sider .logo{
	// position: fixed;
	    width: 100%;
	    // top: 0;
	    z-index: 9;
}
.sider .ant-menu-root{
	padding-top:80px!important;
}

.back-home {
  width: 96px;
  height:96px;
  border-radius: 50%;
  box-shadow:0px 20px 20px 0px rgba(22,141,255,0.4);
  position: fixed; 
  z-index: 100;
  right: 40px; top: 80%; 
  cursor: pointer; 
  text-align: center; 
  color: #ffffff;
  font-size: 16px;
  padding-top: 55px;
  background: #168DFF url(~@/assets/icon_back_home.png) no-repeat center 25px;
  background-size: 28px auto;
}
</style>
