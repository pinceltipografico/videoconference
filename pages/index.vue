<template>
  <section>
    <logo-animation></logo-animation>
    <transition name="fade">
      <section class="frame3-popups small" v-if="error">
          <div>
              <header>
                  <img src="../assets/logo.png"/>
              </header>
              <section>
                <h1>Desculpe-nos</h1>
                <p v-html="error"></p>
                <hr/>
                <span>Equipe Video Conferencia</span>
              </section>
          </div>
      </section>
      </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { Sessions } from '~/resources'
import { setTimeout } from 'timers'
import { LogoAnimation } from '~/components/core'
import Authentication from '../auth'

export default {
  data () {
    return {
      session: null,
      error: null
    }
  },

  components: {
    LogoAnimation
  },

  /**
   *------------------------------------------------------------------------
   * WHEN COMPONENT WAS MOUNTED
   *------------------------------------------------------------------------
   */
  mounted () {
    window.onbeforeunload = this.onBeforeunload
    this.logger = this.$debugger('Index.vue')
    this.configure()
  },

  /**
   *------------------------------------------------------------------------
   * METHODS OF THE COMPONENT
   *------------------------------------------------------------------------
   */
  methods: {
    /**
     * CONFIGURe THE SESSION
     */
    configure () {
      this.logger.debug('Configuring application')
      let apiKey = '46040162'
      let hasUser = Authentication.isLogged()
      let { sessionName } = this.$route.query
      this.$store.dispatch('setSessionName', sessionName || 'Sessão anônima')

      // if user already exists
      // in the localStorage
      if (hasUser) {
        this.logger.debug('User already exist')
        this.$store.dispatch('setUser', Object.assign(hasUser, this.$route.query || {}))
        return this.connectSession(apiKey, this.getUser.sessionId)
      }

      //
      // SET USER FROM URL PARAMS
      // OR DEVELOPER IF THE ENV IS DEV
      this.$store.dispatch(
        'setUser',
        this.$env === 'development'
          ? {
            name: 'Developer',
            email: 'dev@dev.com',
            phone: '11925663355',
            profileType: 'suporte',
            sessionId:
                '2_MX40NjA0MDE2Mn5-MTUyMDYyODk4Mjg5OX5TTHpyRmJ2YmZiZm9melRIRW92QUp2K29-QX4',
            termsAccepted: true
          }
          : Object.assign(this.getUser, this.$route.query)
      )

      // CONNECT TO THE SESSION
      this.connectSession(apiKey, this.getUser.sessionId)
    },

    /**
     * CONNECT TO THE SESSION
     */
    connectSession (apiKey, sessionId) {
      //
      // START THE SESSION
      this.session = OT.initSession(apiKey, sessionId)
      Sessions.generateToken(
        sessionId,
        this.getUser.profileType === 'suporte' ? 'moderator' : 'publisher'
      )
        .then(res => {
          this.logger.debug('Session Connected')
          this.session.connect(
            res.data.token,
            this.onConnectSession.bind(this)
          )
          this.$socket.emit('session-started', sessionId)
        })
        .catch(err => {
          this.handleErrors(err)
          this.logger.debug('Cannot connect to the session')
        })
    },

    /**
     * WHEN THE SESSION WAS CONNECTED
     * @augments Error
     */
    onConnectSession (err) {
      if (err) return this.handleErrors(err)
      this.$store.dispatch('setSessionConnected', true)
      this.$store.dispatch('setSession', this.session)
      this.addGlobalEvents()
      setTimeout(() => {
        this.$router.replace(this.isTermsAccepeted ? 'session' : 'welcome')
      }, 500)
    },

    /**
     * ADD EVENTS OF THE SESSION
     */
    addGlobalEvents () {
      // IF THE SESSION IS UNDEFINED STOP PROCESS
      if (!this.session) return

      // WHEN CONNECTION WAS CREATED
      this.session.on('connectionCreated', event => {
        console.log(event)
      })

      // WHEN STREAM WAS CREATED
      this.session.on('streamCreated', event => {
        console.log(event.stream)
        if (event.stream.videoType === 'camera') {
          this.$store.dispatch('addStream', event.stream)
        } else if (event.stream.videoType === 'screen') {
          this.$store.dispatch('addScreenStream', event.stream)
        }
      })

      // WHEN STREAM IS DESTROY
      this.session.on('streamDestroyed', event => {
        // IF STREAM IS A CAMERA
        if (event.stream.videoType === 'camera') {
          event.preventDefault()
          this.$store.dispatch('removeStream', event.stream)

          // VERIFY IF THE PROFILE IS: SUPPORT OR MEDIADOR
          // AND STAY IN THE SESSION
          if (!this.canEnterSession && this.getUser.profileType === 'mediado') {
            this.$store.dispatch('resetGlobals')
            this.$store.dispatch('resetSessionParams')
            this.$router.replace('/welcome')
          }

          // IF STREAM IS SCREENSHARE TYPE
        } else if (event.stream.videoType === 'screen') {
          this.$store.dispatch('removeScreenStream')
          this.$store.dispatch('setScreenSharing', false)
        }
      })
    },

    /**
     * HANDLE ERRROS
     */
    handleErrors (err) {
      console.log(err)
      switch (err.code) {
        default:
          this.error = `Houve um erro ao tentar se comunicar com o servidor. Por favor, tente mais tarde! <br/><br/><strong>Causa: ${
            err.response.data.message
          }</strong>`
          break
      }
    },

    /**
     * BEFORE DESTROY THE APPLICATION
     */
    onBeforeunload () {
      if (this.session) {
        return this.session.disconnect()
      }
    }
  },

  /**
   *------------------------------------------------------------------------
   * COMPUTED PROPS
   *------------------------------------------------------------------------
   */
  computed: {
    ...mapGetters(['isTermsAccepeted', 'getUser', 'canEnterSession'])
  }
}
</script>
