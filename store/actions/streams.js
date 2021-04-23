import * as types from '../types'

const streams = {
  addStream ({ commit }, stream) {
    commit(types.ADD_STREAM, stream)
  },
  removeStream ({ commit }, stream) {
    commit(types.REMOVE_STREAM, stream)
  },
  addScreenStream ({ commit }, value) {
    commit(types.ADD_SCREEN_STREAM, value)
  },
  removeScreenStream ({ commit }) {
    commit(types.REMOVE_SCREEN_STREAM)
  },
  setPriorityStreamId ({ commit }, value) {
    commit(types.SET_PRIORITY_STREAM_ID, value)
  }
}
export default streams
