const http = require('http')
const httpProxy = require('http-proxy')
const chalk = require('chalk')
const port = 3000

/**
 * CREATE A PROXY SERVER TO REDIRECT
 * REQUISITIONS TO CORREECT PORT
 */
const proxy = httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 3002
  }
})

/**
 * IF THERES A ERROR ON PROXY SERVER
 */
proxy.on('error', function(err, req, res) {
  res.writeHead(500)
  res.end()
})

/**
 * CREATE SERVER
 */
const server = http.createServer(function(req, res) {
  // if the requisition match one of the pattern: /api | /twilio | /socket.io
  // redirect to port 3002
  let regex = /(\/api)|(\/twillo)|(\/socket\.io)/g
  if (req.url.match(regex)) {
    proxy.web(req, res, { target: 'http://127.0.0.1:3002' })
  } else {
    // redirect to port 3001
    proxy.web(req, res, { target: 'http://127.0.0.1:3001' })
  }
})

// when upgrade
server.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head)
})

// start server
console.log(chalk.yellow(`Server listening on port: ${chalk.white(port)}`))
server.listen(port)
