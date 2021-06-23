import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    currentTotem:null,
    socket:io(process.env.VUE_APP_WEBSOCKET_URL)
  },
  getters:{
    socket(state) {
      return state.socket
    },
    currentTotem(state) {
      return state.currentTotem
    } 
  },
  mutations: {
    SET_CURRENT_TOTEM(state, value) {
      state.currentTotem = value
    }
  },
  actions: {},
  modules: {}
})
