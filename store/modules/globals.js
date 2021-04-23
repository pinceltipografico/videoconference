import * as types from '../types'
import Authentication from '../../auth'

/**
 *------------------------------------------------------------------------
 * STATE OBJECT
 *------------------------------------------------------------------------
 */
const state = {
  sideBarVisible: false,
  sideBarOpen: false,
  sideBarActiveContent: 'none',
  termsAccepeted: false,
  fullScreenMode: false,
  helpRequested: false,
  globalMuted: false,
  escPressed: false
}

/**
 *------------------------------------------------------------------------
 * GETTERS
 *------------------------------------------------------------------------
 */
const getters = {
  isSidebarVisible: state => {
    return state.sideBarVisible
  },
  isTermsAccepeted: state => {
    return Authentication.getTermsAccepted() || state.termsAccepeted
  },
  isSidebarOpen: state => {
    return state.sideBarOpen
  },
  getSideBarActiveContent: state => {
    return state.sideBarActiveContent
  },
  getfullScreenMode: state => {
    return state.fullScreenMode
  },
  getHelpRequested: state => {
    return state.helpRequested
  },
  getGlobalMuted: state => {
    return state.globalMuted
  },
  getEscPresed: state => {
    return state.escPressed
  }
}

/**
 *------------------------------------------------------------------------
 * MUTATIONS
 *------------------------------------------------------------------------
 */
const mutations = {
  [types.SIDEBAR_VISIBLE] (state, value) {
    state.sideBarVisible = value
  },
  [types.TERMS_ACCEPTED] (state, value) {
    state.termsAccepeted = value
    Authentication.setTermsAccepted(value)
  },
  [types.SIDEBAR_OPEN] (state, value) {
    state.sideBarOpen = value
  },
  [types.SIDEBAR_ACTIVE_CONTENT] (state, value) {
    state.sideBarActiveContent = value
  },
  [types.ENTER_FULLSCREEN_MODE] (state, value) {
    state.fullScreenMode = value
  },
  [types.REQUEST_HELP] (state, value) {
    state.helpRequested = value
  },
  [types.GLOBAL_MUTED] (state, value) {
    state.globalMuted = value
  },
  [types.ESC_PRESSED] (state, value) {
    state.escPressed = value
  },
  [types.RESET_GLOBALS] (state) {
    state.globalMuted = false
    state.fullScreenMode = false
  }
}

export default { state, mutations, getters }
