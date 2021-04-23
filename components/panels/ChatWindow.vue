<template>
    <div class="chat-window">
        <header>{{to}}<span @click="closeWindow"><i class="material-icons">close</i></span></header>
        <section>
          <template v-if="messages.length">
              <div class="message"
                  v-for="(message, index) in messages"
                  :key="index" :class="{'me':message[0].from === getUser.name}">
                <h4 v-if="message[0].from !== getUser.name">{{message[0].from}}</h4>
                <p  v-for="(tags, pIndex) in message" :key="pIndex">
                  <span :class="{'first':pIndex === 0,'last':(message.length-1) === pIndex}">{{tags.message}}</span>
                </p>
              </div>
            </template>
        </section>
        <footer>
            <textarea name="messageField" id="" placeholder="digite sua mensagem"></textarea>
            <button v-if="$device.isMobile" @click="sendMessage"><i class="material-icons">send</i></button>
        </footer>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
export default {
  /**
   * COMPONENT DATA
   */
  data () {
    return {
      messages: [],
      canClick: true
    }
  },

  /**
   * PUBLIC PROPERTIES
   */
  props: {
    to: {
      type: String,
      default: null
    }
  },

  /**
   * WHEN COMPONENT WAS MOUNTED
   */
  mounted () {
    document.addEventListener('keyup', this.onKeyPress.bind(this))
    this.$socket.on('message', this.fillChat.bind(this))
    this.$socket.emit('getAllMessages', {
      session: this.getSession.id,
      from: this.getUser.name
    })
    this.$store.subscribe((mutation, state) => {
      let { type } = mutation
      if (type === 'esc_pressed') {
        this.closeWindow()
      }
    })
  },

  /**
   * REMOVE EVENTS BEFORE DESTROY COMPONENT
   */
  beforeDestroy () {
    document.removeEventListener('keyup', this.onKeyPress.bind(this))
  },

  /**
   * METHODS OF THE COMPONENT
   */
  methods: {
    /**
     * ON PRESS KEY ON KEYBOARD
     */
    onKeyPress (event) {
      if (event.which === 13) {
        this.sendMessage()
      }
    },

    /**
     * SEND MESSAGE
     */
    sendMessage () {
      let textArea = this.$el.querySelector('textarea')
      if (textArea.value.length > 1) {
        this.$socket.emit('message', {
          session: this.getSession.id,
          chat: {
            from: this.getUser.name,
            to: this.to,
            message: textArea.value,
            connectionId: this.getSession.connection.id,
            timestamp: new Date().toString()
          }
        })
        textArea.value = ''
      } else {
        textArea.value = ''
      }
    },

    /**
     * FILL THE MESSAGE WINDOW
     */
    fillChat (data) {
      if (!data.messages.length) return
      let messagesSection = this.$el.querySelector('section')
      this.messages.length = 0
      this.messages = this.createGroupedArray(data.messages)

      setTimeout(() => {
        messagesSection.scrollTop = messagesSection.scrollHeight
      }, 100)
    },

    /**
     * CREATE A GROUPED ARRAY
     * BY CONVERSATION
     */
    createGroupedArray (array) {
      let result = [[]]
      let index = 0
      let length = array.length

      if (array.length === 1) {
        return [array]
      }

      for (var i = 1; i < length; i++) {
        if (array[i - 1].from === array[i].from) {
          if (!result[index].length) result[index].push(array[i - 1])
          if (i === length - 1) {
            result[index].push(array[i])
            return result
          }
          result[index].push(array[i])
        } else {
          index++
          result.push([])
          result[index].push(array[i])
        }
      }
      return result
    },

    /**
     * CLOSE THIS WINDOW
     */
    closeWindow () {
      this.$store.dispatch('removeChatWindow', { to: this.to })
    }
  },

  /**
   * COMPUTED PROPS
   */
  computed: {
    ...mapGetters(['getUser', 'getSession'])
  }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

div.chat-window {
  width: 300px;
  background: #fff;
  box-shadow: 0 0 7px rgba(#000, 0.4);
  header {
    background: $brand-details;
    color: #fff;
    @include font-size(1.5);
    padding: $default-padding $default-padding/2 $default-padding
      $default-padding;
    span {
      float: right;
    }
  }
  section {
    padding: $default-padding;
    height: 250px;
    overflow: auto;
    width: 100%;
    .message {
      width: auto;
      &:after {
        content: '';
        display: table;
        clear: both;
        margin: 10px 0;
      }
      p {
        display: block;
        margin: 0;
        padding: 0;
        &:after {
          content: '';
          display: table;
          clear: both;
        }
      }
      h4 {
        color: darken($color: #fff, $amount: 15%);
        position: relative;
        &:after {
          content: '';
          display: block;
          width: 45%;
          height: 1px;
          background: darken($color: #ffffff, $amount: 7%);
        }
      }
      span {
        display: inline-block;
        position: relative;
        padding: $default-padding/2 $default-padding;
        color: #fff;
        @include font-size(1.3);
        background: $brand-primary;
        margin-bottom: 2px;
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;

        &.first {
          border-top-left-radius: 10px;
        }
        &.last {
          border-bottom-left-radius: 10px;
        }
      }
      &.me {
        span {
          background: $brand-details;
          float: right;
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
          border-bottom-left-radius: 10px;
          border-top-left-radius: 10px;

          &.first {
            border-top-right-radius: 10px;
          }
          &.last {
            border-bottom-right-radius: 10px;
          }

          &:before {
            border-right: 0;
            border-left: 8px solid $brand-details;
            left: 100%;
          }
        }
      }
    }
  }
  footer {
    position: relative;
    border-top: 1px solid darken($color: #ffffff, $amount: 10%);
    textarea {
      width: 100%;
      height: 100%;
      border: none;
      padding: $default-padding;
      resize: none;
    }
    button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      background: $brand-details;
      border: none;
      color: #fff;
      padding: $default-padding;
    }
  }

  @include responsive('mobileM') {
    position: fixed;
    top: $header-height;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    header {
      @include font-size(2.5);
      span i {
        @include font-size(3);
      }
    }
    section {
      height: 80%;
    }
    footer,
    header {
      height: 10%;
    }
  }
}
</style>
