const OpenTalk = require('opentok')

/**
 * CLASS RESPONSIBLE TO CREATE THE MEDIA SERVER
 * NEED TO PASS THE TOKBOX API KEY AND API SECRET
 */
class MediaServer {
  /**
   * Constructor
   * @param {String} apiKey
   * @param {String} apiSecret
   */
  constructor (apiKey, apiSecret) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.openTok = new OpenTalk(this.apiKey, this.apiSecret)
    this.sessionID = null
  }

  /**
   * START THE SESSION
   */
  startSession () {
    return new Promise((resolve, reject) => {
      this.openTok.createSession(
        { mediaMode: 'routed', archiveMode: 'manual' },
        (err, session) => {
          if (err) {
            return reject(err)
          }
          this.sessionID = session.sessionId
          resolve({ sessionId: this.sessionID })
        }
      )
    })
  }

  /**
   * START RECORDING SESSION
   * @param {String} sessionId
   * @param {Object} options
   */
  startArchive (
    sessionId,
    options = { name: `gravacao-${Math.floor(Math.random() * 1000)}` }
  ) {
    return new Promise((resolve, reject) => {
      this.openTok.startArchive(sessionId, options, (err, archive) => {
        if (err) {
          return reject(err)
        }
        return resolve(archive)
      })
    })
  }

  /**
   * STOP RECORDING
   * @param {String} archiveId
   */
  stopArchive (archiveId) {
    return new Promise((resolve, reject) => {
      this.openTok.stopArchive(archiveId, err => {
        if (err) {
          return reject(err)
        }
        return resolve(archiveId)
      })
    })
  }

  /**
   * LIST RECORDED FILES
   */
  listArchives (opts) {
    return new Promise((resolve, reject) => {
      this.openTok.listArchives(opts, (err, archives) => {
        if (err) {
          return reject(err)
        }
        return resolve(archives)
      })
    })
  }

  /**
   * gENERATE A TOKEN FOR CLIENT
   * @param {String} sessionID
   */
  async generateToken (sessionID, opts, callback) {
    try {
      let token = this.openTok.generateToken(sessionID, opts)
      return token
    } catch (err) {
      throw err
    }
  }

  /**
   * RETURN THE ID OF SESSION
   */
  getSessionID () {
    return this.sessionID
  }
}

module.exports = MediaServer
