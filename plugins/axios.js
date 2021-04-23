import axios from 'axios'

if (process.server) {
  axios.defaults.baseURL = `http://${process.env.HOST || 'localhost'}:${process
    .env.PORT || 3000}/api/`
} else {
  axios.defaults.baseURL = '/api/'
}

axios.interceptors.request.use(
  function (config) {
    if (config.method === 'get') {
      config.url +=
        (config.url.indexOf('?') > 0 ? '&' : '?') + '_=' + new Date().getTime()
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    let fixValues = obj => {
      if (typeof response.data === 'object') {
        for (let k in obj) {
          if (obj.hasOwnProperty(k)) {
            if (typeof obj[k] === 'object') obj[k] = fixValues(obj[k])
            else if (typeof obj[k] === 'string' && /^\d+\.\d+$/.test(obj[k])) { obj[k] = parseFloat(obj[k]) }
          }
        }
      }
      return obj
    }

    if (response.status === 200) response.data = fixValues(response.data)
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
