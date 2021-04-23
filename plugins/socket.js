import io from 'socket.io-client'
import Vue from 'vue'
const SocketConnection = {
  install: function(Vue, opts) {
    try {
      Vue.prototype.$socket = new io()
    } catch (err) {}
  }
}

Vue.use(SocketConnection)
