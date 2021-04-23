import * as types from '../store/types'
class Authentication {
  /**
   * AUTH USER
   * @param {Object} user
   */
  auth (user) {
    sessionStorage.setItem(types.SET_USER, JSON.stringify(user))
  }

  /**
   * VERIFY IF USER IS LOGGED
   */
  isLogged () {
    return JSON.parse(sessionStorage.getItem(types.SET_USER))
  }

  /**
   * SET THE PROFILE TYPE
   * @param {String} profile
   */
  setProfileType (profile) {
    sessionStorage.setItem(types.PROFILE_TYPE, profile)
  }

  /**
   * GET PROFILE
   */
  getProfileType () {
    return sessionStorage.getItem(types.PROFILE_TYPE)
  }

  /**
   * SET WITH THE TERMS WAS UPLOADED
   * @param {Boolean} accepted
   */
  setTermsAccepted (accepted) {
    sessionStorage.setItem(types.TERMS_ACCEPTED, accepted)
  }

  /**
   * GET TERMS ACCEPTED
   */
  getTermsAccepted () {
    return sessionStorage.getItem(types.TERMS_ACCEPTED)
  }

  /**
   * SET IF USER ALREADY VIEW THE EXPLAIN SCREEN
  */
  setUserExplainViwed () {
    return sessionStorage.setItem('explain_viwed', true)
  }
  /**
   * GET IF USER ALREADY VIEW THE EXPLAIN SCREEN
   */
  getUserExplainViwed () {
    return sessionStorage.getItem('explain_viwed')
  }
}
export default new Authentication()
