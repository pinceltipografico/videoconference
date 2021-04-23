const isDebugging = (process.env.NODE_ENV === 'development')

class Logger {
  constructor (instance) {
    this.instance = instance
    return {
      debug: (msg) => {
        this.doLog(console.debug, `[${this.instance} (DEBUG)]: ${msg}`)
      },
      log: (msg) => {
        this.doLog(console.log, `[${this.instance} (LOG)]: ${msg}`)
      },
      info: (msg) => {
        this.doLog(console.info, `[${this.instance} (INFO)]: ${msg}`)
      }
    }
  }

  doLog (fn, msg) {
    if (!isDebugging) return
    fn(msg)
  }
}

export default Logger
