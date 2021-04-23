import Vue from 'vue'
import { setTimeout } from 'timers'
let interact = require('interactjs')

const Utils = {
  install: (Vue, options) => {
    // get env
    Vue.prototype.$env = process.env.NODE_ENV
    Vue.config.performance = true

    /**
     * VERIFY IF HAS A CLASS
     * @param {Element} ele
     * @param {Class} cls
     */
    Vue.prototype.hasClass = function (ele, cls) {
      return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    }

    /**
     * ADD CLASS TO ELEMENT
     * @param {HTMLElement} ele
     * @param {Class} cls
     */
    Vue.prototype.addClass = function (ele, cls) {
      if (!this.hasClass(ele, cls)) {
        ele.className = ele.className.trim() + ' ' + cls
      }
    }

    /**
     * REMOVE A CLASS
     * @param {HTMLElement} ele
     * @param {Class} cls
     */
    Vue.prototype.removeClass = function (ele, cls) {
      if (this.hasClass(ele, cls)) {
        ele.className = ele.className.replace(
          new RegExp('(\\s|^)' + cls + '(\\s|$)'),
          ''
        )
      }
    }

    /**
     * ADD ELEMENT IN FULLSCREEN MODE
     * @param {*} elment
     */
    Vue.prototype.addFullScreenElement = function (elment) {
      if (!elment) return
      if (elment.requestFullscreen) {
        elment.requestFullscreen()
      } else if (elment.msRequestFullscreen) {
        elment.msRequestFullscreen()
      } else if (elment.mozRequestFullScreen) {
        elment.mozRequestFullScreen()
      } else if (elment.webkitRequestFullscreen) {
        elment.webkitRequestFullscreen()
      }
    }

    /**
     * ADD ELEMENT TO BE DRAGABLE
     * @param {HtmlElement} el
     */
    Vue.prototype.addDraggable = function (el) {
      let canDrag = false
      // update the posiion attributes
      el.setAttribute('data-x', -el.clientWidth / 2)
      el.setAttribute('data-y', 0)

      interact(el).draggable({
        inertia: false,
        onmove: onMoveListener,
        onstart: event => {
          event.target.classList.add('no-transition')
          setTimeout(() => {
            canDrag = true
          }, 50)
        },
        onend: event => {
          event.target.classList.remove('no-transition')
        }
      })

      /**
       * WHEN THE MOUSE MOVE
       * @param {DragEvent} event
       */
      function onMoveListener (event) {
        let target = event.target
        // keep the dragged position in the data-x/data-y attributes
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        if (target.getAttribute('minimized') === 'true' || !canDrag) {
          return
        }

        // translate the element
        target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)'

        // update the posiion attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }

      window.dragMoveListener = onMoveListener
    }

    /**
     * DEBOUNCE FUNCTION
     * @param {Function} func
     * @param {Number} wait
     * @param {Boolean} immediate
     */
    Vue.prototype.debounce = function (func, wait, immediate) {
      let timeout
      return function () {
        let context = this
        let args = arguments
        let later = function () {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        let callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    }
  }
}

Vue.use(Utils)
