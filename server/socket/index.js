const socketIo = require('socket.io')
const redis = require('redis')
const { promisify } = require('util')
module.exports = function (app) {
  const io = socketIo(app)
  const client = redis.createClient()
  const rpushAsync = promisify(client.rpush).bind(client)
  const lrangeAsync = promisify(client.lrange).bind(client)

  /**
   * GET VALUES OF THE PROPER WAY
   * @param {Array} array
   */
  function getProperValues (array) {
    return array.map(value => {
      return JSON.parse(value)
    })
  }

  /**
   * ON ERROR O REDIS SERVER
   */
  client.on('error', error => {
    console.log(error)
  })

  /**
   * WHEN A SOCKET CONNECTED TO IO
   */
  io.on('connection', socket => {
    /**
     * WHEN USER WAS DISCONNETED
     */
    socket.on('disconnect', event => {})

    /**
     * WHEN USER SEND A MESSAGE
     */
    socket.on('message', async data => {
      let { session, chat } = data
      let storeId = `chat.${session}`
      await rpushAsync(storeId, JSON.stringify(chat))
      let result = await lrangeAsync(storeId, 0, -1)
      result = getProperValues(result)
      io.emit('message', {
        to: chat.to,
        from: chat.from,
        messages: result
      })
    })

    /**
     * GET ALL STORED MESSAGES
     */
    socket.on('getAllMessages', async data => {
      let { session } = data
      let storeId = `chat.${session}`
      let result = await lrangeAsync(storeId, 0, -1)
      result = getProperValues(result)
      io.emit('message', { messages: result })
    })

    /**
     * WHEN A CONNECTIONS WAS STARTED
     */
    socket.on('session-started', session => {})
  })
}
