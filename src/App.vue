<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <!-- <router-view v-if="isRouterAlive"/> -->
      <transition name="fade-transform" mode="out-in">
        <router-view />
      </transition>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

import { AppDeviceEnquire } from '@/utils/mixin'

export default {
    mixins: [AppDeviceEnquire],
    // provide(){
    //   return {
    //     reload:this.reload
    //   }
    // },
    data() {
        return {
            locale: zhCN,
            // isRouterAlive:true
        }
    },
    mounted() {},
    methods: {
        // reload(){
        //   this.isRouterAlive = false
        //   this.$nextTick(function(){
        //     this.isRouterAlive = true
        //   })
        // }
    },
}
</script>
<style lang="less">
@import '~ant-design-vue/lib/style/themes/default.less';

.w_container {
    width: 14.18rem;
    margin: 0 auto;
}

/*滚动条样式*/
::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
}

::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px #b5b5b5;
    background: #b5b5b5;
}

::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
}

/*弹性布局样式*/
	.flex {
		display: flex;
	}

	.flex-wrap {
		flex-wrap: wrap;
	}

	.flex-column {
		flex-direction: column;
	}
    .flex_column{
        flex-direction: column;
    }
	.alignCenter {
		align-items: center;
	}
    .alignBaseline{
        align-items: baseline;
    }
	.justifyCenter {
		justify-content: center;
	}

	.justifyFlexEnd {
		justify-content: flex-end;
	}

	.justifySpaceBetween {
		justify-content: space-between;
	}

	.flex_1 {
		flex: 1;
		width: 0%;
	}

	.flex_2 {
		flex: 2;
		width: 0%;
	}

	.flexcolumn_1 {
		flex: 1;
		height: 0%;
	}

	.flexcolumn_2 {
		flex: 2;
		height: 0%;
	}
.mt10{
    margin-top: 10px;
}
.mr10{
    margin-right: 10px;
}
.ml10{
    margin-left: 10px;
}
.mb10{
    margin-bottom: 10px;
}
.bb1{
    border-bottom: 1px solid #eee;
}
#app {
    height: 100%;
    overflow: hidden;
}

.main_content {
    width: 100%;
    position: absolute;
    left: 0;
    top: 15px;
    bottom: 34px;
    right: 0;
    background: #fff;
    border-radius: 2px;
    overflow-y: auto;
    overflow-x: hidden;
}

.wrap {
    height: 100%;
    width: 100%;
    position: relative;
}

.main {
    padding: 0 15px;
    height: 100%;
}

.mobile .wrap {
    overflow-x: auto;
}

.mobile .main_content {
    width: 1400px;
    top: 5px;
    bottom: 24px;
}

.mobile .main {
    padding: 0;
}

.ant-input,
.ant-btn {
    border-radius: 2px !important;
}

.ant-btn {
    margin: 0 10px 0 0 !important;
    padding: 0 12px;
    line-height: 30px !important;
    height: 30px !important;
    border: 0 !important;
    vertical-align: middle;
    border-radius: 3px !important;
}

.ant-btn:last-child {
    margin: 0 !important;
}

.ant-btn.ant-btn-default {
    border: 1px solid #ddd !important;
}

.ant-btn-default:hover,
.ant-btn-default.ant-btn:focus {
    border: 1px solid #40a9ff !important;
}

.font_size_20 {
    font-size: 20px !important;
}

.main_margin_bottom_10 {
    margin-bottom: 10px !important;
}
.main_margin_bottom_15 {
    margin-bottom: 15px !important;
}
.main_margin_top_5 {
    margin-top: 5px !important;
}
.main_cursor_pointer {
    cursor: pointer;
}
.main_cursor_not_allowed{
    cursor: not-allowed
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    border: 0 !important;
    position: relative;
    background: transparent !important;
}

.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab:before {
    content: '';
    position: absolute;
    right: 0;
    top: 10px;
    height: 20px;
    width: 1px;
    background: #f5f5f5;
}

// table
table {
    border: 1px solid #e8e8e8;
}

ul {
    padding: 0;
}

li {
    list-style-type: none;
}

.main_display_inline_block {
    display: inline-block;
}

// button
button {
    cursor: pointer;
}

// button图标文字样式
.btn_text {
    margin-left: 5px;
    display: inline-block;
    cursor: pointer;
    vertical-align: top;
}

a.btn_text:hover,
a.btn_text:focus {
    color: #fff;
}

a {
    text-decoration: none;
}

// 设置btn disabled样式
.ant-btn-primary[disabled] {
    color: #fff !important;
    opacity: 0.6 !important;
}

.ant-btn-primary{
    background-color: #1A66FF;
}
// 按钮颜色
.add {
    background: #319cff !important;
}

.edit {
    background: #1bd86f !important;
}

.del {
    background: #ffa4a4 !important;
}

.assign {
    background: #ffba00 !important;
}
.border_color_blue {
    border-color: #1890ff !important;
}
.border_color_pink {
    border-color: #ffa0e2 !important;
}
.bg_basic_blue {
    background: #cfe8ff !important;
}
.bg_basic_pink {
    background: #ffe5f3 !important;
}
.color_pink {
    color: #ffa0e2 !important;
}

.girl {
    color: #ffa4a4 !important;
}
.color_red{
    color: red !important;
}
.color_green {
    color: #1bd86f !important;
}

.color_blue,
.man {
    color: #1890ff !important;
}

// input 前文字
.main_form_label {
    width: 100px;
}

.gray {
    color: #999 !important;
}

// tabs 图标
.ant-tabs-tab i svg {
    display: none;
}

.ant-tabs-bar i {
    background: url(assets/close.png) center center no-repeat;
    background-size: 75%;
    height: 16px !important;
    vertical-align: text-bottom !important;
    display: none;
}

.ant-tabs-tab-active i {
    background: url(assets/close_active.png) center center no-repeat;
    background-size: 75%;
}

.ant-tabs-tab:hover {
    padding: 0 25px 0 10px !important;
}

.ant-tabs-tab:hover i {
    position: absolute;
    right: 10px;
    top: 11px;
    display: block;
}

// 树选中颜色
.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background: #319cff !important;
    color: #fff !important;
}

// 左右浮动
.main_float_right {
    float: right;
}

// 字体颜色白
.color_white {
    color: #fff;
}
.setting-drawer-index-handle {
    display: none !important;
}

.setting-drawer-index-handle{
    display: none!important;
  }
// md编辑器
  .markdown-body ol, .markdown-body ul{
      padding-left:0;
  }
  .markdown-body{
      z-index: 1000!important;
      table{
          border: 0;
      }
  }
</style>
