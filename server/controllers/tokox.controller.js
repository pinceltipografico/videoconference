const { apiKey, apiSecret } = require('../config/config').staging.tokbox
const { MediaServer } = require('../tokbox')

//
// CREATE MEDIA SERVER
const mediaServer = new MediaServer(apiKey, apiSecret)

/**
 * CREATE A NEW SESSION ON TALKBOX
 * @param {Request Object} req
 * @param {Response Object} res
 */
const createSession = async (req, res) => {
  let { Sessions } = req.$models
  try {
    let hasSession = await Sessions.findOne({ where: { name: req.body.name } })
    if (hasSession) {
      return res.jsonp(hasSession)
    }
    let { sessionId } = await mediaServer.startSession()
    let session = await Sessions.create({
      name: req.body.name,
      sessionId: sessionId
    })
    return res.jsonp(session)
  } catch (err) {
    return res.jsonp(err.message)
  }
}

/**
 * GENERETA A TOKEN FOR THE USER
 * @param {Request Object} req
 * @param {Response Object} res
 */
const generateToken = async (req, res) => {
  let { session } = req
  let { role } = req.query
  try {
    let token = await mediaServer.generateToken(session.sessionId, {
      role: role
    })
    console.log(token)
    return res.json({ token: token })
  } catch (err) {
    console.log(err)
    return res.send({ message: 'Cannot get token for user' })
  }
}

/**
 * START RECORD THE SESSION
 * @param {Request Object} req
 * @param {Response Object} res
 */
const startArchive = async (req, res) => {
  let { session } = req
  try {
    let archive = await mediaServer.startArchive(session.sessionId)
    return res.json(archive)
  } catch (err) {
    console.log(err)
    return res.json(err)
  }
}

/**
 *
 * @param {Request} req
 * @param {response} res
 */
const stopArchive = async (req, res, id) => {
  let { archiveId } = req
  try {
    let archive = await mediaServer.stopArchive(archiveId)
    return res.json(archive)
  } catch (err) {
    return res.json(err)
  }
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const listArchives = async (req, res) => {
  let { session } = req
  try {
    let archives = await mediaServer.listArchives({
      sessionId: session.sessionId
    })
    return res.jsonp(archives)
  } catch (err) {
    return res.json(err)
  }
}

/**
 * POST REQUEST MIDDLEWARE
 */
const requestMiddleWare = function (req, res, next) {
  if (!req.body.name) {
    return res
      .status(422)
      .send({ message: 'Campo nome da sessão é obrigatório' })
  }
  next()
}

/**
 * GET A SESSION BY ID
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 * @param {String} id
 */
const getSessionById = async (req, res, next, id) => {
  let { Sessions } = req.$models
  try {
    let session = await Sessions.findOne({ where: { sessionId: id } })
    if (!session) {
      if (process.env.NODE_ENV === 'development') {
        req.session = {
          sessionId:
            '2_MX40NjA0MDE2Mn5-MTUyMDYyODk4Mjg5OX5TTHpyRmJ2YmZiZm9melRIRW92QUp2K29-QX4'
        }
        return next()
      } else {
        return res.status(404).jsonp({ message: 'Esta sessão não existe' })
      }
    }
    req.session = session
    return next()
  } catch (err) {
    return next(err)
  }
}

/**
 * SET ARCHIVE ID
 * @param {Request} req
 * @param {Response} res
 * @param {Funcion} next
 * @param {String} id
 */
const setArchiveId = (req, res, next, archiveId) => {
  req.archiveId = archiveId
  next()
}

module.exports = {
  createSession,
  generateToken,
  startArchive,
  stopArchive,
  listArchives,
  requestMiddleWare,
  getSessionById,
  setArchiveId
}
