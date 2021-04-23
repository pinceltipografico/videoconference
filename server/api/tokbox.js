const {
  createSession,
  generateToken,
  startArchive,
  stopArchive,
  listArchives,
  requestMiddleWare,
  getSessionById,
  setArchiveId
} = require('../controllers/tokox.controller')

/**
 * ROUTES FOR SESSION TOKBOX
 * @param {Express Router} router
 */
module.exports = router => {
  router.post('/sessions', requestMiddleWare, createSession)
  router.get('/sessions/:sessionId/gettoken', generateToken)
  router.get('/sessions/:sessionId/startrecord', startArchive)
  router.get('/sessions/:sessionId/stoprecord/:archiveId', stopArchive)
  router.get('/sessions/:sessionId/listrecords', listArchives)

  router.param('sessionId', getSessionById)
  router.param('archiveId', setArchiveId)
}
