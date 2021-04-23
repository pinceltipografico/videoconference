import * as types from '../types'

const globals = {
  setSideBarState ({ commit }, value) {
    commit(types.SIDEBAR_VISIBLE, value)
  },
  setSideBarOpen ({ commit }, value) {
    commit(types.SIDEBAR_OPEN, value)
  },
  setSideBarContentActive ({ commit }, value) {
    commit(types.SIDEBAR_ACTIVE_CONTENT, value)
  },
  setTermsAccepted ({ commit }, value) {
    commit(types.TERMS_ACCEPTED, value)
  },
  setCanRecord ({ commit }, value) {
    commit(types.CAN_RECORD, value)
  },
  setCamActive ({ commit }, value) {
    commit(types.CAM_ACTIVE, value)
  },
  setUser ({ commit }, user) {
    commit(types.SET_USER, user)
  },
  setMicActive ({ commit }, value) {
    commit(types.MIC_ACTIVE, value)
  },
  setScreenSharing ({ commit }, value) {
    commit(types.SHARING_SCREEN, value)
  },
  enterFullScreen ({ commit }, value) {
    commit(types.ENTER_FULLSCREEN_MODE, value)
  },
  requestHelp ({ commit }, value) {
    commit(types.REQUEST_HELP, value)
  },
  globalMuted ({ commit }, value) {
    commit(types.GLOBAL_MUTED, value)
  },
  escPressed ({ commit }, value) {
    commit(types.ESC_PRESSED, value)
  },
  resetGlobals ({commit}) {
    commit(types.RESET_GLOBALS)
  }
}

export default globals
