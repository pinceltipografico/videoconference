<template>
  <section class="session-content"
           :class="{'members-view-active':((membersActive && getStreams.length > 0) || (membersActive && getIsPublishing)) && !$device.isMobile}">

    <!-- sub routers -->
    <nuxt-child></nuxt-child><!-- sub routers -->

    <!-- WELCOME MESSAGE -->
    <div class="welcome-message" data-intro='Use os botões para navegar' v-if="!$device.isMobile">
      <logo-novo></logo-novo>
      <h1>Bem vindo {{getUser.name}}, a sua sessão de Video Conferencia!</h1>
      <p>Vamos ver como sua plataforma de Video Conferencia funciona. Clique em próximo</p>
    </div><!-- WELCOME MESSAGE -->

    <!-- POPUP for request help -->
    <alerts ref="$helpRequest">
        <div slot-scope="props">
            <header>
                <img src="../assets/logo.png"/>
            </header>
            <section>
              <template v-if="sendingHelpForm">
                <div style="color: #84a5dd" class="la-ball-pulse la-md">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </template>
              <template v-if="!sendingHelpForm && !props.message">
                <h1>Preciso de ajuda!</h1>
                <label for="trouble">Informe o tipo de problema (opcional)</label>
                <textarea name="trouble" id="trouble" v-model.trim="helpHint"></textarea>
                <span>Equipe Video Conferencia</span>
              </template>
              <template v-if="props.message">
                <h1>{{props.message}}</h1>
              </template>
            </section>
            <footer>
              <button @click="onRequestHelp" class="frame3-button medium">Enviar</button>
              <button @click="onCancelRequestHelp" class="frame3-button danger medium">cancelar</button>
            </footer>
        </div>
    </alerts><!-- POPUP for request help -->

    <alerts ref="$errors"></alerts>

    <!--  MAIN VIDEO FRAME -->
    <section class="main-video-screen" :class="{'white':getStreams.length === 0}">
      <video-container v-for="stream in getStreams"
                       :key="stream.id"
                       :stream="stream"
                       :addEvents="true"
                       v-show="(stream.id === canShowVideo || getChangeViewMode) || $device.isMobile"
                       :large="true"></video-container>
      <div class="video-container no-users" v-if="!getStreams.length">
        <logo-animation texto="Aguardando Participantes"></logo-animation>
      </div>
    </section><!--  MAIN VIDEO FRAME -->
    
    <!-- ACTIVE USERS TAB -->
    <section class="video-members" :class="{'deactive':!membersActive}"
                                   v-if="!$device.isMobile" v-show="getStreams.length || getIsPublishing">
      <a class="close-menbers" @click="toggleMembers">
        <i class="material-icons">keyboard_arrow_down</i>{{(membersActive) ? 'Fechar':'Abrir participantes'}}
      </a>
      <div class="video-container small" v-show="membersActive && getIsPublishing">
        <h4 class="username" id="meHook">EU: {{getUser.name}}</h4>
      </div>
      <template v-if="membersActive">
        <video-container class="small"
                        v-for="stream in getStreams"
                        :key="stream.id"
                        :stream="stream"
                        :addEvents="true" @active="onActiveSubscriber"></video-container>
      </template>                          
    </section><!-- ACTIVE USERS TAB -->

  </section>
</template>

<script>
import axios from 'axios'
import { VideoContainer } from '../components/video'
import { LogoAnimation, CheckBox, Alerts } from '../components/core'
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
import { Sessions } from '../resources'
import LogoNovo from '~/assets/logo-novo.svg'
import * as types from '../store/types'
import Authentication from '../auth'
import { initLayoutContainer } from 'opentok-layout-js'
import createThumbs from '../utils/createThumbs'
import Worker from '../workers/requests.worker'

export default {
  layout: 'player',
  data () {
    return {
      connected: false,
      membersActive: true,
      publisher: null,
      mainStream: null,
      currentId: null,
      priorityStreamId: null,
      popupTitle: 'Desculpe-nos',
      helpHint: '',
      sendingHelpForm: false,
      incognitoMode: false,
      layoutModule: null,
      resizeTimeout: null,
      worker: new Worker(),
      canToggleRecording: true,
      messages: {
        type: 'error',
        active: false,
        message: ''
      }
    }
  },

  /**
   * COMPONENTS
   */
  components: {
    VideoContainer,
    LogoAnimation,
    CheckBox,
    Alerts,
    LogoNovo
  },

  /**
   * WHEN COMPONENT WAS CREATED
   */
  created () {
    if (!this.canEnterSession && this.getUser.profileType === 'mediado') {
      return this.$router.replace('/welcome')
    }
  },

  /**
   *------------------------------------------------------------------------
   * INITIAL CONFIGURATION OF SESSION
   * WHEN COMPONENT WAS MOUNTED
   *------------------------------------------------------------------------
   */
  mounted () {
    window.scrollTo(0, 0)
    this.addClass(document.getElementsByTagName('html')[0], 'no-overflow')
    // register plugin of chrome to
    // share screen
    OT.registerScreenSharingExtension(
      'chrome',
      'ingbciidponnmjdlclcjddeoeccbogga',
      2
    )

    // ID SESSION EXISTS
    if (!this.getSession) {
      return
    }

    //
    // start flexible layot
    this.loadFlexibleLayout()
    window.addEventListener('resize', this.debounce(this.rearrangeScreens.bind(this), 350))

    //
    // VERIFY IF THE EXPLAIN SCREEN ALREADY VIWED
    if (Authentication.getUserExplainViwed()) {
      this.$el.removeChild(this.$el.querySelector('.welcome-message'))
      this.removeClass(document.body, 'explain-screen')
      return this.startSession()
    }

    //
    // START EXPLAIN SCREEN
    if (this.$device.isMobile) {
      return
    }
    import('intro.js').then(res => {
      let intro = res.introJs
      this.$store.dispatch('setSideBarState', true)

      setTimeout(() => {
        this.addClass(document.body, 'explain-screen')
        intro()
          .setOptions({
            nextLabel: 'Próximo',
            prevLabel: 'Anterior',
            skipLabel: 'Pular',
            doneLabel: 'Ok. Tudo Certo!'
          })
          .start()
          .oncomplete(done.bind(this))
          .onexit(done.bind(this))

        function done () {
          this.$el.removeChild(this.$el.querySelector('.welcome-message'))
          this.removeClass(document.body, 'explain-screen')
          // start session
          this.startSession()

          this.$refs.$errors.open(
            'Deseja visualizar esta tela de explicação novamente?',
            'Aviso',
            'Sim',
            'Não',
            true,
            null,
            () => {
              Authentication.setUserExplainViwed()
            }
          )
        }
      }, 200)
    })
  },

  /**
   *------------------------------------------------------------------------
   * METHODS
   *------------------------------------------------------------------------
   */
  methods: {
    /**
     * START THE SESSION
     */
    startSession () {
      // IF THE PROFILE IS NOT SUPORTE
      // START TRASMIT
      if (this.getUser.profileType !== 'suporte') {
        this.$store.dispatch('setIsPublishing', true)
        this.startPublish()
      } else {
        this.incognitoMode = true
        this.$store.dispatch('setIsPublishing', false)
      }

      // add events
      this.addStoreEvents()
      this.addSessionEvents()

      // when a message was send
      this.$socket.on('message', data => {
        this.$store.dispatch('addChatWindow', {
          to: 'Chat da Sessão'
        })
      })

      // tell to whole application that sessions
      // is active
      this.$store.dispatch('setSectionActive', true)
      if (!this.$device.isMobile) {
        this.$store.dispatch('setSideBarState', true)
      }

      // IF PROFILE IS: MEDIADOR
      // THEN START RECORD THE SESSION
      if (this.getUser.profileType === 'mediador') {
        Sessions.startArchive(this.getSession.id)
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    /**
     * LOAD THE FLEXIBLE LAYOUT
     */
    loadFlexibleLayout () {
      this.layoutModule = initLayoutContainer(
        this.$el.querySelector('.main-video-screen'),
        {}
      )
      this.rearrangeScreens()
    },

    /**
     * ADD STORE EVENTS
     */
    addStoreEvents () {
      // VERIFY WHEN A STREAM WAS ADDED
      this.$store.subscribe((mutation, state) => {
        let { type, payload } = mutation

        switch (type) {
          // case a stream was added
          case types.ADD_STREAM:
            this.rearrangeScreens(350)
            break

          // case chage layout view
          case types.CHANGE_VIEW_MODE:
          case types.SIDEBAR_OPEN:
          case types.REMOVE_STREAM:
            this.rearrangeScreens(350)
            break

          // START SCREEN SHARE
          case types.SHARING_SCREEN:
            if (payload) {
              this.startScreenShare(true)
            }
            break

          // on enter fullscreen mode
          case types.ENTER_FULLSCREEN_MODE:
            this.onEnterFullScreen()
            this.rearrangeScreens(100)
            break

          // active or deactive camera
          case types.CAM_ACTIVE:
            this.toggleVideo(payload)
            break

          // active or deactive audio
          case types.MIC_ACTIVE:
            this.toggleAudio(payload)
            break

          // when request help
          case types.REQUEST_HELP:
            this.$store.dispatch('setSideBarState', false)
            this.$refs.$helpRequest.open()
            break

          // stop video recording
          case types.CAN_RECORD:
            this.stopRecording(payload)
            break

          // start publishing
          case types.IS_PUBLISHING:
            ;(this.getIsPublishing ? this.startPublish : this.stopPublishing)()
            break

          // REQUEST PRIORITY
          case types.REQUEST_PRIORITY:
            this.requestPriorityVideo(payload)
            break

          default:
            break
        }
      })
    },

    /**
     * ADD SESSION EVENTS
     */
    addSessionEvents () {
      // session events
      this.getSession.on('sessionDisconnected', () => {
        this.$router.replace('kicked')
      })

      // ON REQUEST PRIORITY VIDEO
      this.getSession.on('signal:request-priority', event => {
        if (event.data === 'false') {
          this.$store.dispatch('setPriorityStreamId', null)
          return
        }
        let priorityStream = this.getStreams.filter(stream => {
          return stream.connection.connectionId === event.from.id
        })
        let priorityStreamId = priorityStream.length
          ? priorityStream[0].id
          : null
        this.$store.dispatch('setPriorityStreamId', priorityStreamId)
      })

      // global mute
      this.getSession.on('signal:globalMute', event => {
        let { id, mute } = JSON.parse(event.data)
        if (this.getSession.connection.id === id) {
          this.publisher.publishAudio(mute)
          this.$store.dispatch('globalMuted', !mute)
        }
      })
    },

    /**
     * SET DEFAULTS FOR THE PUBLISHER
     */
    setPublisherDefaults () {
      this.publisher.setStyle({
        nameDisplayMode: 'off',
        archiveStatusDisplayMode: 'off',
        buttonDisplayMode: 'off',
        audioLevelDisplayMode: 'off'
      })
      this.publisher.on('streamCreated', (event) => {
        let el = this.publisher.videoElement()
        setTimeout(() => {
          let data = createThumbs(el)
          this.worker.postMessage({method: 'PUT', endPoint: `users/${this.getUser.id}`, data: {photo: data}})
        }, 2000)
      })
    },

    /**
     * START PUBLISH AUDIO AND VIDEO OF USER
     */
    startPublish () {
      if (this.publisher) {
        this.stopPublishing()
      }
      let publisherOptions = {
        width: '100%',
        height: '100%',
        name: JSON.stringify(this.getUser),
        insertMode: 'before',
        fitMode: 'cover',
        audioBitrate: '16,000',
        disableAudioProcessing: true,
        frameRate: 15,
        resolution: '320x180',
        maxResolution: {
          width: 640,
          height: 360
        }
      }
      this.publisher = OT.initPublisher('meHook', publisherOptions)
      this.getSession.publish(this.publisher)
      this.setPublisherDefaults()
    },

    /**
     * STOP PUBLISHING
     */
    stopPublishing () {
      if (this.publisher) {
        this.getSession.unpublish(this.publisher)
        this.publisher = null
        if (this.getIsPublishing) {
          this.$store.dispatch('setIsPublishing', false)
        }
      }
    },

    /**
     * ON ACTIVE SUBSCRIBER WAS TALKING
     */
    onActiveSubscriber (stream) {
      this.currentId = stream.id
    },

    /**
     * ON ENTER FULLSCREEN
     */
    onEnterFullScreen () {
      let el = this.$el.querySelector('.main-video-screen')
      this.addFullScreenElement(el)
    },

    /**
     * STOP PUBLISH THE CAM
     */
    toggleVideo (publish) {
      this.publisher.publishVideo(publish)
    },

    /**
     * START PUBLISH VIDEO
     */
    toggleAudio (publish) {
      this.publisher.publishAudio(publish)
    },

    /**
     * STARR THE SCREENSHARE
     */
    startScreenShare (value) {
      if (!value) return
      OT.checkScreenSharingCapability(response => {
        if (!response.supported || !response.extensionRegistered) {
          this.$refs.$errors.open(
            'Este Browser não suporta Compartilhamento de Tela',
            'Screen Share Error',
            this.discardPopup.bind(this)
          )
        } else if (!response.extensionInstalled) {
          this.$refs.$errors.open(
            'A extensão necessária para compartilhar a tela não está instalada. Por favor entre em contato com o suporte',
            'Screen Share Error',
            'Instalar Extensão',
            'Cancelar',
            true,
            () => {
              window.open('https://chrome.google.com/webstore/detail/compartilhamento-de-tela/ingbciidponnmjdlclcjddeoeccbogga', '_blank')
              this.discardPopup()
            },
            this.discardPopup.bind(this)
          )
        } else {
          // Screen sharing is available. Publish the screen.
          // Create an element, but do not display it in the HTML DOM:
          let screenSharingPublisher = OT.initPublisher(
            'screen-publisher',
            { videoSource: 'screen' },
            error => {
              if (error) {
                error = 'Something went wrong: ' + error.message
              } else {
                this.getSession.publish(screenSharingPublisher, error => {
                  if (error) {
                    this.$refs.$errors.open(
                      error.message,
                      'Screen Share Error',
                      null,
                      null,
                      false,
                      this.discardPopup.bind(this),
                      null
                    )
                  }
                })
                screenSharingPublisher.on('streamDestroyed', () => {
                  this.$store.dispatch('setScreenSharing', false)
                })
              }
            }
          )
        }
      })
    },

    /**
     * DISCARD ERROR POPUPS
     */
    discardPopup () {
      this.$store.dispatch('setScreenSharing', false)
    },

    /**
     * REQUEST CONTROL OF THE MAIN VIDEO
     */
    requestPriorityVideo (value) {
      if (!this.getSession) return
      this.getSession.signal(
        {
          type: 'request-priority',
          data: value.toString()
        },
        error => {
          if (error) console.log(error)
        }
      )
    },

    /**
     * SOLICITA AJUDA DO SUPORTE
     */
    onRequestHelp () {
      this.sendingHelpForm = true
      let message = '```' + this.helpHint + '```'
      let text = `Olá Suporte, estou com problemas!\n*Solicitante*: ${
        this.getUser.name
      }\n${message}`
      let channel = this.$env === 'development' ? 'U8TEUF54K' : 'U4DF7R09F'
      let attachments = [
        {
          text: 'Clique no link abaixo para acessar a sessão',
          fallback: 'Você não pode acessar esta sessão',
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              text: 'Acessar Sessão',
              type: 'button',
              url: `http://sessions-h.frame3nline.com?sessionId=${
                this.getSession.id
              }&profileType=suporte&name=Suporte&email=gabriel@frame3nline.com`
            }
          ]
        }
      ]
      axios({
        method: 'post',
        baseURL: 'https://hooks.slack.com/services/',
        url: 'T4DDFGAQ5/B9673BZEE/TxuKpfhz2XRhETJIrc2t91iS',
        headers: {
          'Content-Type': 'text/plain'
        },
        data: {
          text: text,
          channel: channel,
          mrkdwn: true,
          attachments: attachments,
          pretty: 1
        }
      })
        .then(res => {
          this.sendingHelpForm = false
          this.$refs.$helpRequest.reject(2500, 'Sua mensagem foi enviada com sucesso!')
          this.$store.dispatch('setSideBarState', true)
        })
        .catch(err => {
          this.sendingHelpForm = false
          this.$refs.$helpRequest.reject(2500, 'Houve um erro ao contatar o suporte. Por favor tente mais tarde ou ligue para: (11) xxxx-xxxx!')
          this.$store.dispatch('setSideBarState', true)
          console.log(err)
        })
    },

    /**
     * CANCEL HELP REQUEST
     */
    onCancelRequestHelp () {
      this.$refs.$helpRequest.reject()
      setTimeout(() => {
        this.$store.dispatch('setSideBarState', true)
      }, 500)
    },

    /**
     * STOP RECORDING SESSION
     */
    stopRecording (start) {
      if (!this.canToggleRecording) {
        return
      }
      this.canToggleRecording = false
      let msg = !start ? 'Deseja realmente parar a gravação desta sessão?' : 'Deseja realmente iniciar a gravação desta sessão?'
      this.$refs.$errors.open(
        msg,
        'Cuidado',
        'Sim',
        'Não',
        true,
        async () => {
          try {
            if (start) {
              let started = await Sessions.startArchive(this.getSession.id)
              this.canToggleRecording = true
              console.log(started)
              return started
            }
            let { data } = await Sessions.listArchives(this.getSession.id)
            if (!data[0]) return
            let result = await Sessions.stopArchive(this.getSession.id, data[0].id)
            this.canToggleRecording = true
            console.log(result)
            return result
          } catch (e) {
            console.log(e)
          }
        },
        () => {
          this.$store.dispatch('setCanRecord', !start)
          console.log('canceled')
          setTimeout(() => {
            this.canToggleRecording = true
          }, 1000)
        }
      )
    },

    /**
     * WHEN CLOSE OR OPEN MEMBERS
     */
    toggleMembers () {
      this.membersActive = !this.membersActive
      this.rearrangeScreens(300)
    },

    /**
     * REARRANGE SCREENS
     */
    rearrangeScreens (time) {
      if (!this.layoutModule) return
      setTimeout(this.layoutModule.layout, time || 0)
    }
  },

  /**
   * COMPUTED PROPS
   */
  computed: {
    ...mapGetters([
      'isSectionActive',
      'getStreams',
      'getSession',
      'getUser',
      'getCamerActive',
      'getScreenStream',
      'getPriorityStreamId',
      'getIsPublishing',
      'canEnterSession',
      'getChangeViewMode'
    ]),
    canShowVideo () {
      if (this.getPriorityStreamId) {
        return this.getPriorityStreamId
      }
      if (this.currentId) {
        return this.currentId
      }
      return this.getStreams[0].id
    }
  },

  /**
   * WHEN DESTROYED
   */
  beforeDestroy () {
    this.removeClass(document.getElementsByTagName('html')[0], 'no-overflow')
    this.$store.dispatch('setSectionActive', false)
    this.$store.dispatch('setSideBarState', false)

    if (this.publisher) {
      this.stopPublishing()
    }
    window.removeEventListener('resize', this.debounce(this.rearrangeScreens.bind(this), 350))
  }
}
</script>

<style lang="scss">
@import '~susy/sass/_susy';
@import '~@/scss/variables';
@import '~@/scss/mixins';

section.session-content {
  position: relative;
  height: 100%;

  .welcome-message {
    position: fixed;
    z-index: 9;
    background: #fff;
    padding: 20px;
    left: 50%;
    top: 50%;
    width: 550px;
    height: 300px;
    margin-left: -275px;
    margin-top: -150px;
    text-align: center;
    svg {
      max-width: 200px;
    }
    h1 {
      color: $text-color;
      @include font-size(2.5);
    }
  }

  > section {
    position: absolute;
  }

  section.main-video-screen {
    width: 100%;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    background-size: cover;
    z-index: 1;
    transition: height 0.35s, width 0.35s;
    background: #000;
    overflow: hidden;
    &.white{
      background: #fff;
    }
    div.video-container {
      padding: 0;
    }
    @include responsive('mobileM') {
      background: #000;
    }
  }

  section.video-members {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    max-height: 115px;
    min-height: 115px;
    bottom: 1%;
    left: 0;
    right: 0;
    background: rgba(#000, 0.5);
    transition: transform 0.35s;
    transform: translateY(0);
    padding: 5px;

    a.close-menbers {
      position: absolute;
      color: #fff;
      top: -25px;
      right: 10px;
      padding-right: 10px;
      display: inline-block;
      @include font-size(1.2);
      border-bottom: 1px solid $brand-details;
      line-height: 2em;
      transition: color 0.35s;
      cursor: pointer;
      i {
        float: left;
      }
      &:hover {
        color: $brand-details;
      }
    }

    &.deactive {
      transform: translateY(100%);
      padding: 0;
      a.close-menbers {
        background: $brand-primary !important;
        color: #fff;
      }
    }
  }

  //
  // VIDEOS CONTAINERS
  div.video-container {
    padding: 0 $default-padding;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    max-width: 100%;
    transition:all 0.350s;

    h4.username {
      position: absolute;
      bottom: 0;
      background: $brand-primary;
      padding: 5px;
      margin: 0;
      color: #fff;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    .actions {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      text-align: center;
      a {
        display: inline-block;
        color: #fff;
        width: 30px;
        height: 30px;
        background: $brand-primary;
        border-radius: 50%;
        box-shadow: 2px 2px 4px rgba(#000, 0.5);
        transform: translateY(100%);
        opacity: 0;
        transition: all 0.35s;
        cursor: pointer;
        margin: 0 4px;
        i {
          line-height: 32px;
        }
        @for $i from 1 through 5 {
          &:nth-of-type(#{$i}) {
            transition-delay: 0.1s * $i;
          }
        }
        &.inactive {
          background: $brand-danger;
        }
      }
    }

    &.small {
      width: span(4 of 12);
      height: 105px;
      min-width: 20px;
      max-width: 200px;
      h4 {
        top: 0;
        bottom: auto;
      }
    }

    &:hover {
      .actions a {
        transform: translateY(0);
        opacity: 1;
      }
    }
    &.no-users {
      background: #fff;
    }
  }

  &.members-view-active {
    section.main-video-screen {
      height: calc(100% - 125px);
      &:fullscreen {
        height: 100%;
        width: 100%;
        .video-container {
          padding: 0;
        }
      }
    }
  }
}

.menbers-enter-active,
.menbers-leave-active {
  transform: translateY(0);
}
.menbers-enter,
.menbers-leave-to {
  transform: translateY(-100%);
}
</style>
