import * as types from '../types'
import Authentication from '../../auth'

/**
 *------------------------------------------------------------------------
 * STATE OBJECT
 *------------------------------------------------------------------------
 */
const state = {
  user: {
    name: '',
    email: '',
    phone: '',
    profileType: null,
    photo: null,
    sessionId: null,
    termsAccepted: false
  }
}

/**
 *------------------------------------------------------------------------
 * GETTERS
 *------------------------------------------------------------------------
 */
const getters = {
  getUser: state => {
    delete state.user.photo
    return state.user
  }
}

/**
 *------------------------------------------------------------------------
 * MUTATIONS
 *------------------------------------------------------------------------
 */
const mutations = {
  [types.SET_USER] (state, value) {
    state.user = value
    Authentication.auth(value)
  }
}

export default { state, mutations, getters }
