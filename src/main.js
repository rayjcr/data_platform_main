// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import common from './api/common'
import moment from 'moment';
import 'moment/locale/zh-cn'
import '@/assets/iconfont/iconfont.css'
moment.locale('zh-cn');
// mock
// import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import './utils/install'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
Vue.component("mavon-editor", mavonEditor);
Vue.prototype.common = common
Vue.config.productionTip = false
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)



new Vue({
  router,
  store,
  moment,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')


//监听浏览器变化
window.onresize = function() {
	setAppScale();
};
// 大屏页面使用rem做适配
function setAppScale() {
	var whdef = 100 / 1920; // 表示1920的设计图,使用100PX的默认值
	var wW = window.innerWidth; // 当前窗口的宽度
	var rem = wW * whdef; // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
	document.documentElement.style.fontSize = rem + 'px'
}

setAppScale();