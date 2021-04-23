import Vue from 'vue'
import Logger from './logger'

/**
 * VUE DEBUG PLUGIN
 */
const Debug = {
  install: (Vue, options) => {
    Vue.prototype.$debugger = (instance) => {
      return new Logger(instance)
    }
  }
}

Vue.use(Debug)
