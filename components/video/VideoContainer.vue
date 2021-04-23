<template>
    <div class="video-container" :class="{'large':large}">
      <div class="video"></div>
      <h4 class="username" v-if="(!$device.isMobile && !large)">{{getStreamUser.name}} ({{getStreamUser.profileType}})</h4>
      <div class="actions" v-if="!large && !$device.isMobile">
        <a @click="onMute" :class="{'inactive':muted}"><i class="material-icons">{{!muted ? 'mic':'mic_off'}}</i></a>
        <a @click="kickUser" v-if="getUser.profileType === 'suporte'"><i class="material-icons">do_not_disturb_off</i></a>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'VideoContainer',

  /**
   *------------------------------------------------------------------------
   * COMPONENT DATA
   *------------------------------------------------------------------------
   */
  data () {
    return {
      id: Math.floor(Math.random() * 5000),
      subscriber: {
        type: Object,
        default: null
      },
      movingAvg: null,
      sensibility: 0.5,
      counter: 0,
      muted: false
    }
  },

  /**
   *------------------------------------------------------------------------
   * COMPONENT PUBLIC DATA
   *------------------------------------------------------------------------
   */
  props: {
    stream: {
      type: Object,
      default: null
    },
    addEvents: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    }
  },

  /**
   *------------------------------------------------------------------------
   * WHEN COMPONENT WAS MOUNTED
   *------------------------------------------------------------------------
   */
  mounted () {
    if (!this.stream) return
    this.startSubscribe()
  },

  /**
   *------------------------------------------------------------------------
   * METHODS
   *------------------------------------------------------------------------
   */
  methods: {
    /**
     * SUBSCRIBE THE VIDEO
     */
    startSubscribe () {
      let el = this.$el.querySelector('.video')
      this.subscriber = this.getSession.subscribe(this.stream, el, {
        height: '100%',
        width: 'auto',
        showControls: false,
        fitMode: this.$device.isMobile ? 'cover' : 'contain',
        preferredResolution: '640x360'
      })
      
      // SET THE PREFERED RESOLUTION
      // REDUCE BANDWITH AND NETWORKUSAGE
      this.subscriber.setPreferredResolution({
        width:320,
        height:180
      })

      // ADD EVENT TO SESSION DISCONNECTED
      this.subscriber.on('sessionDisconnected', () => {
        console.log('destroyed')
      })

      if (this.addEvents) {
        this.subscriber.on(
          'audioLevelUpdated',
          this.debounce(this.audioLevelUpdated.bind(this), 75)
        )
      }
    },

    /**
     * ADD EVENTS
     */
    audioLevelUpdated (event) {
      if (this.movingAvg === null || this.movingAvg < event.audioLevel) {
        this.movingAvg = event.audioLevel
      } else {
        this.movingAvg = 0.7 * this.movingAvg + 0.3 * event.audioLevel
      }
      let logLevel = Math.log(this.movingAvg) / Math.LN10 / 1.5 + 1
      logLevel = Math.min(Math.max(logLevel, 0), 1)
      if (logLevel > this.sensibility) {
        if (++this.counter > 100) {
          this.counter = 0
          this.$emit('active', event.target.stream)
        }
      } else {
        this.counter = 0
      }
    },

    /**
     * WHEN MUTE A USER
     */
    onMute () {
      if (!this.subscriber) return
      this.subscriber.subscribeToAudio(this.muted)
      this.muted = !this.muted

      if (this.getProfileType === 'mediado') return
      this.getSession.signal(
        {
          type: 'globalMute',
          data: JSON.stringify({
            id: this.subscriber.stream.connection.id,
            mute: !this.muted
          })
        },
        err => {
          console.log(err)
          console.log(
            `Muted command sended to: ${this.subscriber.stream.connection.id}`
          )
        }
      )
    },

    /**
     * KICKOFF A USER
     */
    kickUser () {
      this.getSession.forceDisconnect(
        this.subscriber.stream.connection,
        event => {
          console.log(event)
        }
      )
    }
  },

  /**
   *------------------------------------------------------------------------
   * COMPOUTED PROPS
   *------------------------------------------------------------------------
   */
  computed: {
    ...mapGetters(['getSession', 'getUser']),
    getStreamUser () {
      return JSON.parse(this.stream.name)
    }
  },

  /**
   *------------------------------------------------------------------------
   * WHEN COMPONENT WAS DESTROYED
   *------------------------------------------------------------------------
   */
  destroyed () {
    if (this.subscriber.stream) {
      this.getSession.unsubscribe(this.subscriber)
      this.$store.dispatch('removeStream', this.subscriber.stream)
    }
  }
}
</script>
