import { Resources } from './resources'
class Sessions extends Resources {
  /**
   * GENERATE A TOKEN FROM SESSION
   * @param {String} sessionId
   */
  generateToken (sessionId, role = 'publisher') {
    return this.http.get(
      `${this.baseUrl}/${sessionId}/gettoken?role=${role}`
    )
  }

  /**
   * START RECORDING THE SESSION
   * @param {String} sessionId
   */
  startArchive (sessionId) {
    return this.http.get(`${this.baseUrl}/${sessionId}/startrecord`)
  }

  /**
   * STOP RECORDING THE SESSION
   * @param {String} sessionId
   */
  stopArchive (sessionId, archiveId) {
    return this.http.get(`${this.baseUrl}/${sessionId}/stoprecord/${archiveId}`)
  }

  /**
   * LIST ARCHIVES ON THE SESSION
   * @param {String} sessionId
   */
  listArchives (sessionId) {
    return this.http.get(`${this.baseUrl}/${sessionId}/listrecords`)
  }
}
export default new Sessions('/sessions')
