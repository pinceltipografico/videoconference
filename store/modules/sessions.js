import * as types from '../types'
import Logger from '../../plugins/logger'

/**
 *------------------------------------------------------------------------
 * STATE OBJECT
 *------------------------------------------------------------------------
 */
const _logger = new Logger('Sessions Store')
const state = {
  session: null,
  sessionActive: false,
  isSessionConnected: false,
  streams: [],
  canRecord: true,
  cameraActive: true,
  micActive: true,
  sharingScreen: false,
  screenStream: null,
  requestPriority: false,
  priorityStreamId: null,
  isPublishing: true,
  sessionName: 'Sessão 01',
  changeViewMode: false
}

/**
 *------------------------------------------------------------------------
 * GETTERS
 *------------------------------------------------------------------------
 */
const getters = {
  isSectionActive: state => {
    return state.sessionActive
  },
  isSessionConnected: state => {
    return state.isSessionConnected
  },
  canEnterSession: state => {
    let hasProfile = state.streams.filter(item => {
      let profile = JSON.parse(item.name).profileType
      return profile === 'mediador' || 'suporte'
    })
    return hasProfile.length > 0
  },
  getSession: state => {
    return state.session
  },
  getStreams: state => {
    return state.streams
  },
  getCanRecord: state => {
    return state.canRecord
  },
  getCamerActive: state => {
    return state.cameraActive
  },
  getMicActive: state => {
    return state.micActive
  },
  getIsSharingScreen: state => {
    return state.sharingScreen
  },
  getScreenStream: state => {
    return state.screenStream
  },
  getPriorityStreamId: state => {
    return state.priorityStreamId
  },
  getIsPublishing: state => {
    return state.isPublishing
  },
  getRequestPriority: state => {
    return state.requestPriority
  },
  getSessionName: state => {
    return state.sessionName
  },
  getChangeViewMode: state => {
    return state.changeViewMode
  }
}

/**
 *------------------------------------------------------------------------
 * MUTATIONS
 *------------------------------------------------------------------------
 */
const mutations = {
  [types.SESSION_ACTIVE] (state, value) {
    state.sessionActive = value
  },
  [types.SESSION_CONNECTED] (state, value) {
    state.isSessionConnected = value
  },
  [types.SESSION] (state, value) {
    state.session = value
  },
  [types.ADD_STREAM] (state, stream) {
    _logger.debug('Adding a Stream for connection ID: ' + stream.connection.id)
    let tempStreams = state.streams.filter(item => {
      return item.connection.id === stream.connection.id
    })
    if (!tempStreams.length) {
      state.streams.push(stream)
    }
  },
  [types.REMOVE_STREAM] (state, stream) {
    if (!stream) return
    _logger.debug('Removing Stream: ' + stream.id)
    state.streams = state.streams.filter(el => {
      return el.id !== stream.id
    })
  },
  [types.CAN_RECORD] (state, value) {
    state.canRecord = value
  },
  [types.CAM_ACTIVE] (state, value) {
    state.cameraActive = value
  },
  [types.MIC_ACTIVE] (state, value) {
    state.micActive = value
  },
  [types.SHARING_SCREEN] (state, value) {
    state.sharingScreen = value
  },
  [types.ADD_SCREEN_STREAM] (state, value) {
    state.screenStream = value
  },
  [types.REMOVE_SCREEN_STREAM] (state) {
    state.screenStream = null
  },
  [types.SET_PRIORITY_STREAM_ID] (state, value) {
    state.priorityStreamId = value
  },
  [types.IS_PUBLISHING] (state, value) {
    state.isPublishing = value
  },
  [types.REQUEST_PRIORITY] (state, value) {
    state.requestPriority = value
  },
  [types.SESSION_NAME] (state, value) {
    state.sessionName = value
  },
  [types.RESET_SESSION_PARAMS] (state) {
    state.micActive = true
    state.cameraActive = true
  },
  [types.CHANGE_VIEW_MODE] (state, value) {
    state.changeViewMode = value
  }
}

export default { state, mutations, getters }
