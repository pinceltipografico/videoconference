import Vuex from 'vuex'
import globals from './modules/globals'
import sessions from './modules/sessions'
import users from './modules/user'
import chatwindows from './modules/chat'
import actions from './actions'
//
// VUEX STORE
const store = () => {
  return new Vuex.Store({
    actions,
    modules: {
      globals,
      sessions,
      users,
      chatwindows
    }
  })
}

export default store
