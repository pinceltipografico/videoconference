import * as types from '../types'
const chat = {
  addChatWindow({ commit }, value) {
    commit(types.ADD_CHAT_WINDOW, value)
  },
  removeChatWindow({ commit }, value) {
    commit(types.REMOVE_CHAT_WINDOW, value)
  }
}
export default chat
