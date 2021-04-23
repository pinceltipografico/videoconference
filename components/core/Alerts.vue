<template>
<!-- POPUP ERRORS -->
    <transition name="fade">
      <section class="frame3-popups small" v-if="opened">
          <slot :message="message">
              <div>
                <header>
                    <img src="../../assets/logo.png"/>
                </header>
                <section>
                    <h1>{{title}}</h1>
                    <p><strong class="black">{{message}}</strong></p>
                    <hr/>
                    <span>Equipe Video Conferencia</span>
                </section>
                <footer>
                    <button @click="accpet" class="frame3-button" :class="{'large':!withCancel,'medium':withCancel}">{{acceptText}}</button>
                    <button @click="reject" class="frame3-button danger"
                            :class="{'large':!withCancel,'medium':withCancel}"
                            v-if="withCancel">{{canceText}}</button>
                </footer>
            </div>
          </slot>
      </section>
    </transition><!-- POPUP ERRORS -->
</template>

<script>
export default {
  data () {
    return {
      opened: false,
      message: '',
      title: '',
      withCancel: false,
      acceptText: 'OK',
      callback: null,
      cancelCallback: null,
      canceText: null
    }
  },
  methods: {
    open (message, title, acceptText = 'OK', cancelText = 'Cancelar', withCancel = false, callback = null, cancelCallback = null) {
      this.message = message
      this.title = title
      this.acceptText = acceptText
      this.canceText = cancelText
      this.withCancel = withCancel
      this.callback = callback
      this.cancelCallback = cancelCallback
      this.opened = true
    },
    accpet () {
      this.opened = false
      if (this.callback && typeof this.callback === 'function') this.callback()
    },
    reject (delay = 0, message = null) {
      this.message = message
      this.opened = false
      console.log('Closing')
      setTimeout(() => {
        if (this.cancelCallback && typeof this.cancelCallback === 'function') this.cancelCallback()
      }, delay)
    }
  }
}
</script>
