const { Router } = require('express')
const router = Router()

require('./tokbox')(router)
require('./users')(router)

module.exports = router
