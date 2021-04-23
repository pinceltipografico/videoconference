import _ from 'lodash'

const queue = []

const debounced = _.debounce(store => {
  store.commit('loading/SET_LOADING', true)
}, 250, { maxWait: 1000 })

export default ({ store }, inject) => {
  inject('task', async function (fn) {
    const obj = {}
    queue.push(obj)
    debounced(store)
    try {
      await fn()
    } finally {
      queue.splice(queue.indexOf(obj), 1)
      if (queue.length == 0) {
        debounced.cancel()
        store.commit('loading/SET_LOADING', false)
      }
    }
  })
}