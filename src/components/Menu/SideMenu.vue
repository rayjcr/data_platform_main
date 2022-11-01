<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
   
    collapsedWidth="60"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <logo title='统一身份认证'/>
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
      style="padding: 0!important"></s-menu>
  </a-layout-sider>

</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    toggle () {
      this.$emit('toggle')
    }
  }
}
</script>
<style lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';
.ant-menu-dark .ant-menu-item:hover, .ant-menu-dark .ant-menu-item-active{
  background-color : @primary-color !important;
}
.ant-menu-inline-collapsed{
  width: 60px !important;
  overflow: hidden;
}
.ant-menu-inline-collapsed > .ant-menu-item,.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title{
  margin: 0 -10px !important;
}
.layout.ant-layout .sidemenu .ant-header-fixedHeader{
  position: inherit!important;
}
.layout.ant-layout .sidemenu .ant-header-fixedHeader.ant-header-side-opened,
.layout.ant-layout .sidemenu .ant-header-fixedHeader.ant-header-side-closed{
    width: 100%!important;
}

</style>