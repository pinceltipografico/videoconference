import * as types from '../types'

// CHAT WINDOWS STATE
const state = {
  chatWindows: []
}

// GETTERS
const getters = {
  getChatWindows: state => {
    return state.chatWindows
  }
}

// MUTATIONS
const mutations = {
  [types.ADD_CHAT_WINDOW](state, value) {
    let exists = state.chatWindows.filter(item => {
      return item.to === value.to
    })
    if (!exists.length) {
      state.chatWindows.push(value)
    }
  },
  [types.REMOVE_CHAT_WINDOW](state, value) {
    state.chatWindows = state.chatWindows.filter(item => {
      return item.to !== value.to
    })
  }
}

export default { getters, state, mutations }
