const http = require('http')
const express = require('express')
const { Nuxt } = require('nuxt')
const bodyParser = require('body-parser')

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const server = http.createServer(app)

const { models } = require('./models')

//
// BODY PARSER
app.use(bodyParser.json({limit: '50mb'}))

// SET MODELS TO GLOBAL SCOPE
app.use('*', (req, res, next) => {
  req.$models = models
  next()
})

// DEFINE API ROUTES
app.use('/api', require('./api'))

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev =
  !(process.env.NODE_ENV === 'production') &&
  !(process.env.NODE_ENV === 'staging')
if (!config.dev) {
  const nuxt = new Nuxt(config)
  app.use(nuxt.render)
}

// start socket
require('./socket')(server)

// Listen the server
server.listen(port, host)
console.log('Server listening on ' + host + ':' + port)
