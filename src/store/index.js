import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'
import VuexPersist from 'vuex-persist'
Vue.use(Vuex)

const vuexLocal = new VuexPersist({
  storage: window.sessionStorage,
  modules: ['user'] 
})
export default new Vuex.Store({
  modules: {
    user,
    app,
    permission
  },
  state: {
    per:{}
  },
  mutations: {
    setPermission(state,v){
        state.per=v;
    }
  },
  actions: {

  },
  getters,
  plugins: [vuexLocal.plugin]
})
