import * as types from '../types'

const sessions = {
  setSectionActive ({ commit }, value) {
    commit(types.SESSION_ACTIVE, value)
  },
  setSessionConnected ({ commit }, value) {
    commit(types.SESSION_CONNECTED, value)
  },
  setSession ({ commit }, value) {
    commit(types.SESSION, value)
  },
  setIsPublishing ({ commit }, value) {
    commit(types.IS_PUBLISHING, value)
  },
  requestPriority ({ commit }, value) {
    commit(types.REQUEST_PRIORITY, value)
  },
  setSessionName ({ commit }, value) {
    commit(types.SESSION_NAME, value)
  },
  resetSessionParams ({commit}) {
    commit(types.RESET_SESSION_PARAMS)
  },
  changeViewMode ({commit}, value) {
    commit(types.CHANGE_VIEW_MODE, value)
  }
}

export default sessions
