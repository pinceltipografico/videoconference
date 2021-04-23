<template>
  <!-- PLAYER -->
  <section class="frame3-player">

    <!-- HEADER -->
    <header :class="{white:!isSectionActive || (isSidebarVisible && $device.isMobile) || !getStreams.length}" 
            v-if="isSectionActive || (!isSectionActive && !$device.isMobile)">
      <div class="logo">
        <logo-novo-white v-if="!$device.isMobile" class="hide-white"></logo-novo-white>
        <logo-novo class="show-white" v-if="!$device.isMobile"></logo-novo>
        <!-- <img src="~/assets/logo.png" alt="Video Conferencia" v-if="!$device.isMobile"> -->
        <img src="~/assets/logo-icon.png" alt="Video Conferencia" v-if="$device.isMobile">
      </div>
      <h1>Sessão de Video Conferencia: {{getSessionName}}</h1>
      <a @click="$store.dispatch('setSideBarState',!isSidebarVisible)"
         v-if="$device.isMobile">
        <i class="material-icons">{{isSidebarVisible ? 'close':'menu'}}</i>
      </a>

      <!-- select type of user -->
      <template v-if="$env === 'development'">
        <label for="profileType"></label>
        <select id="profileType" @change="onSelectProfile">
          <option value="mediado">Mediado</option>
          <option value="mediador">Mediador</option>
          <option value="suporte">Suporte</option>
        </select>
      </template> <!--select type of user -->

    </header><!-- HEADER -->

    <!-- ROUTER CONTENT -->
    <nuxt class="frame3-player-content"
          :class="{'full-content':!isSidebarVisible, 'action-active':isSidebarOpen}"/><!-- ROUTER CONTENT -->
    
    <!-- ASIDE BAR -->
    <transition name="sideBar">
      <!-- DESKTOP VERSION -->
      <aside class="desktop-menu"
             :class="{'action-active':isSidebarOpen}"
             v-if="isSidebarVisible && !$device.isMobile">
        <ul class="actions">

          <!-- REQUEST HELP BUTTON -->
          <li v-if="this.getUser.profileType !== 'suporte'"
              data-intro="Clique aqui para solicitar ajuda do suporte.">
            <action-button icon="help"
                          label="Solicitar Ajuda"
                          dispatch="requestHelp"></action-button>
          </li><!-- REQUEST HELP BUTTON -->

          <li class="space"></li>

           <!-- REQUEST HELP BUTTON -->
          <li data-intro="Clique aqui para mudar a visualização do video principal."
              v-if="getStreams.length > 1">
            <action-button icon="view_module"
                          label="Mudar Visualização"
                          dispatch="changeViewMode"
                          :value="!getChangeViewMode"
                          :class="{'action-active':getChangeViewMode}"></action-button>
          </li><!-- REQUEST HELP BUTTON -->

          <!-- TRANSMISSÃO PRIORITÁRIA -->
          <li v-if="this.getUser.profileType === 'suporte' && getIsPublishing"
              data-intro="Clique aqui para enviar uma transmissão prioritária.">
            <action-button icon="switch_camera"
                          label="Transmissão Prioritária"
                          dispatch="requestPriority"
                          :value="!prioritySelected"
                          :class="{'action-active':prioritySelected}"></action-button>
          </li><!-- TRANSMISSÃO PRIORITÁRIA -->

          <!-- ACTIVE USERS ON THIS SESSION -->
          <li v-if="this.getUser.profileType === 'suporte'"
              data-intro="Sair ou entrar em modo invisível">
            <action-button :icon="getIsPublishing ? 'visibility':'visibility_off'"
                           :label="getIsPublishing ? 'Ficar Invisível':'Ficar Visível'"
                           dispatch="setIsPublishing"
                           :value="!getIsPublishing"
                           :class="{'action-active':getIsPublishing}"></action-button>
          </li><!-- ACTIVE USERS ON THIS SESSION -->

          <!-- ACTIVE USERS ON THIS SESSION -->
          <li v-if="this.getUser.profileType.match(/(suporte|mediador)/g)"
              data-intro="Clique aqui para ver todos os usuários da sessão.">
            <action-button icon="people"
                          label="Usuários"
                          dispatch="setSideBarContentActive"
                          :openSideBar="getSideBarActiveContent !== 'active-users'"
                          :value="getSideBarActiveContent === 'active-users' ? '' : 'active-users'"
                          :class="{'action-active':getSideBarActiveContent === 'active-users'}"></action-button>
          </li><!-- ACTIVE USERS ON THIS SESSION -->

          <!-- STOP RECORDING -->
          <li v-if="this.getUser.profileType === 'mediador' "
              data-intro="Clique aqui para parar a gravação dessa sessão.">
            <action-button :class="{'action-active red':getCanRecord}"
                          dispatch="setCanRecord"
                          icon="fiber_manual_record"
                          :value="!getCanRecord"
                          label="Parar gravação"></action-button>
          </li><!-- STOP RECORDING -->

          <!-- CHAT BUTTON -->
          <li data-intro="Clique aqui para abrir o chat da sessão.">
            <action-button :class="{'action-active':getChatWindows.length > 0}"
                          dispatch="addChatWindow"
                          :value="{to: 'Chat da Sessão'}"
                          icon="chat_bubble_outline"
                          label="Chat"></action-button>
          </li><!-- CHAT BUTTON -->

          <!-- SCREEN SHARE BUTTON -->
          <li v-if="this.getUser.profileType.match(/(suporte|mediador)/g)"
              data-intro="Clique aqui para compartilhar sua tela">
            <action-button icon="screen_share"
                          :label="!getIsSharingScreen ? 'Compartilhar tela':'Parar'"
                          dispatch="setScreenSharing"
                          :value="!getIsSharingScreen"
                          :class="{'deactive':getIsSharingScreen}"></action-button>
          </li><!-- SCREEN SHARE BUTTON -->

          <li class="space"></li>

          <template v-if="getIsPublishing">

            <!-- MUTE BUTTON -->
            <li v-if="!globalMuted"
                data-intro="Clique aqui para habilitar ou desabilitar seu microfone">
              <action-button :icon="getMicActive ? 'mic':'mic_off'"
                            :label="!getMicActive ? 'Habilitar Microfone':'Desabilitar Microfone'"
                            dispatch="setMicActive"  
                            :value="!getMicActive"
                            :class="{'deactive':!getMicActive}"></action-button>
            </li><!-- MUTE BUTTON -->

            <!-- CAM ACTIVE BUTTON -->
            <li data-intro="Clique aqui para habilitar ou desabilitar sua camera">
              <action-button :icon="getCamerActive ? 'videocam':'videocam_off'"
                            :label="(!getCamerActive) ? 'Habilitar Camera':'Desabilitar Camera'"
                            dispatch="setCamActive"
                            :value="!getCamerActive"
                            :class="{'deactive':!getCamerActive}"></action-button>
            </li><!-- CAM ACTIVE BUTTON -->

          </template>

          <!-- FULLSCREEN BUTTON -->
          <li data-intro="Clique aqui para entrar em modo fullscreen (tela cheia)" data-position="auto">
            <action-button icon="fullscreen"
                          :value="true"
                          dispatch="enterFullScreen"
                          label="Fullscreen"></action-button>
          </li><!-- FULLSCREEN BUTTON -->
        </ul>

        <!-- PANELS -->
        <active-users-panel v-if="getSideBarActiveContent === 'active-users'"></active-users-panel>
        <!-- PANELS -->

      </aside><!-- DESKTOP VERSION -->
    </transition><!-- ASIDE BAR -->

    <!-- ASIDE BAR -->
    <transition name="mobile">
      <!-- DESKTOP VERSION -->
      <aside class="mobile-menu" v-if="isSidebarVisible && $device.isMobile">
        <ul class="actions">

          <!-- TOGGLE VISIBILITY -->
          <li v-if="this.getUser.profileType === 'suporte'"
              data-intro="Sair ou entrar em modo invisível">
            <action-button :icon="getIsPublishing ? 'visibility':'visibility_off'"
                           :label="getIsPublishing ? 'Ficar Invisível':'Ficar Visível'"
                           dispatch="setIsPublishing"
                           :value="!getIsPublishing"
                           :class="{'action-active':getIsPublishing}"></action-button>
          </li><!-- TOGGLE VISIBILITY -->
          
          <!-- REQUEST HELP BUTTON -->
          <li v-if="this.getUser.profileType !== 'suporte'">
            <action-button icon="help"
                          label="Solicitar Ajuda"
                          dispatch="requestHelp"></action-button>
          </li><!-- REQUEST HELP BUTTON -->

          <li class="space"></li>

          <!-- TRANSMISSÃO PRIORITÁRIA -->
          <li v-if="this.getUser.profileType === 'suporte'">
            <action-button icon="switch_camera"
                          label="Transmissão Prioritária"
                          dispatch="requestPriority"
                          :value="!prioritySelected"
                          :class="{'action-active':prioritySelected}"></action-button>
          </li><!-- TRANSMISSÃO PRIORITÁRIA -->

          <!-- CHAT BUTTON -->
          <li>
            <action-button dispatch="addChatWindow"
                          :value="{to: 'Chat da Sessão'}"
                          icon="chat_bubble_outline"
                          label="Chat"></action-button>
          </li><!-- CHAT BUTTON -->

          <li v-if="this.getUser.profileType.match(/(suporte|mediador)/g)">
            <action-button icon="screen_share"
                          :label="!getIsSharingScreen ? 'Compartilhar tela':'Parar'"
                          dispatch="setScreenSharing"
                          :value="!getIsSharingScreen"
                          :class="{'deactive':getIsSharingScreen}"></action-button>
          </li>
          <li class="about-case">
             <!-- ABOUT CASE BUTTON -->
            <nuxt-link :to="{name:'session-about-case'}">
              <i class="material-icons">insert_drive_file</i>
              <span>Sobre seu caso</span>
            </nuxt-link><!-- ABOUT CASE BUTTON -->
          </li>
        </ul>
      </aside><!-- DESKTOP VERSION -->
    </transition><!-- ASIDE BAR -->

    <!-- SCREEN SHARE -->
    <transition name="fade">
      <screen-share-receiver v-if="getScreenStream"></screen-share-receiver>
    </transition><!-- SCREEN SHARE -->

    <!-- CONTAINER CHAT PANELS -->
    <div class="chats-container" id="chatsContainer" :class="{'action-active':isSidebarOpen}">
      <transition-group :name="$device.isMobile ? 'chat':'fade'">
        <chat-window v-for="chatWindow in getChatWindows" :key="chatWindow.to" :to="chatWindow.to"></chat-window>
      </transition-group>
    </div><!-- CONTAINER CHAT PANELS -->

    <!-- PERSONAL ACTIONS MOBILE -->
    <div class="mobile-actions" v-if="$device.isMobile && isSectionActive">
      <ul>
        <li>
            <action-button :icon="getMicActive ? 'mic':'mic_off'"
                          dispatch="setMicActive"  
                          :value="!getMicActive"
                          :class="{'deactive':!getMicActive}"></action-button>
          </li>
          <li>
            <action-button :icon="getCamerActive ? 'videocam':'videocam_off'"
                          dispatch="setCamActive"
                          :value="!getCamerActive"
                          :class="{'deactive':!getCamerActive}"></action-button>
          </li>
          <li>
            <action-button icon="fullscreen"
                          :value="true"
                          dispatch="enterFullScreen"></action-button>
          </li>
      </ul>
    </div> <!-- PERSONAL ACTIONS MOBILE -->

  </section>
  <!-- PLAYER -->
</template>

<script>
import { ActionButton } from '../components/core'
import { ScreenShareReceiver } from '../components/video'
import { ChatWindow, ActiveUsersPanel } from '../components/panels'
import { mapGetters } from 'vuex'
import LogoNovo from '~/assets/logo-novo.svg'
import LogoNovoWhite from '~/assets/logo-novo-white.svg'
import * as types from '../store/types'

export default {
  /**
   *------------------------------------------------------------------------
   * COMPONENT DATA
   *------------------------------------------------------------------------
   */
  data () {
    return {
      prioritySelected: false,
      globalMuted: false,
      types: types
    }
  },
  /**
   *------------------------------------------------------------------------
   * LOCAL COMPONENTS
   *------------------------------------------------------------------------
   */
  components: {
    ActionButton,
    ScreenShareReceiver,
    ChatWindow,
    ActiveUsersPanel,
    LogoNovo,
    LogoNovoWhite
  },
  /**
   *------------------------------------------------------------------------
   * WHEN COMPONENT WAS MOUNTED
   *------------------------------------------------------------------------
   */
  mounted () {
    document.addEventListener('keyup', this.whenKeyPressed.bind(this))
    this.addEvents()
    if (this.$device.isMobile) {
      this.startMobileTouch()
    }
  },
  /**
   *------------------------------------------------------------------------
   * REMOVE LISTENER OF KEYUO
   * WHEN COMPONENT WAS DESTROYED
   *------------------------------------------------------------------------
   */
  destroyed () {
    document.removeEventListener('keyup', this.whenKeyPressed.bind(this))
  },

  /**
   *------------------------------------------------------------------------
   * PUBLIC METHODS
   *------------------------------------------------------------------------
   */
  methods: {
    /**
     * ADD BUS EVENTS
     */
    addEvents () {
      // listen mutation events
      this.$store.subscribe((mutation, state) => {
        let { type, payload } = mutation

        switch (type) {
          // request priority
          case types.REQUEST_PRIORITY:
            this.prioritySelected = !this.prioritySelected
            break

          // chat window open
          case types.ADD_CHAT_WINDOW:
            if (this.$device.isMobile) {
              this.$store.dispatch('setSideBarState', false)
            }
            break

          // global muted
          case types.GLOBAL_MUTED:
            this.globalMuted = payload
            break

          default:
            break
        }
      })
    },

    /**
     * HIDE THE SIDE BAR
     */
    whenKeyPressed (event) {
      if (event.which === 27) {
        this.$store.dispatch('setSideBarOpen', false)
        this.$store.dispatch('setSideBarContentActive', 'none')
        this.$store.dispatch('escPressed', true)
      }
    },

    /**
     * START MOBILE TOUCJ
     */
    startMobileTouch () {
      let Hammer = require('hammerjs')
      let touchElement = new Hammer(this.$el)
      touchElement.on('swipe', event => {
        if (event.deltaX > 50) {
          this.$store.dispatch('setSideBarState', true)
        } else if (event.deltaX < -50) {
          this.$store.dispatch('setSideBarState', false)
        }
      })
    },

    /**
     * ON SELECT PROFILE TYPE
     * @TEMP temp method
     */
    onSelectProfile (event) {
      this.$store.dispatch(
        'setUser',
        Object.assign(this.getUser, { profileType: event.target.value })
      )
    }
  },
  /**
   *------------------------------------------------------------------------
   * COMPUTED
   *------------------------------------------------------------------------
   */
  computed: {
    ...mapGetters([
      'isSectionActive',
      'isSidebarVisible',
      'isSidebarOpen',
      'getSideBarActiveContent',
      'getCamerActive',
      'getMicActive',
      'getIsSharingScreen',
      'getScreenStream',
      'getPriorityStreamId',
      'getChatWindows',
      'getCanRecord',
      'getIsPublishing',
      'getSession',
      'getStreams',
      'getUser',
      'getChangeViewMode',
      'getSessionName'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import 'node_modules/susy/sass/_susy';
@import '~@/scss/variables';
@import '~@/scss/mixins';

section.frame3-player {
  display: table;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: darken($color: #000000, $amount: 90%);

  //
  // HEADER CONTENT
  header {
    position: relative;
    display: flex;
    height: $header-height;
    padding: $default-padding;
    align-content: center;
    z-index: 99;
    background: transparent;
    transition: all 0.35s;

    h1 {
      color: #fff;
      font-weight: 400;
      @include font-size(1.8);
      &:before,
      &:after {
        color: #fff;
      }
      &:before {
        content: ':: ';
      }
      &:after {
        content: ' ::';
      }

      // MEDIUM MOBILE
      @include responsive('mobileM') {
        @include font-size(1.2);
        margin-left: 15px;
        &:before,
        &:after {
          display: none;
        }
        small {
          display: block;
          font-weight: bold;
          @include font-size(1.8);
        }
      }
    }
    > * {
      flex: 1 1 auto;
      &.logo {
        max-width: 150px;
        svg,
        img {
          height: 100%;
          width: auto;
        }

        .show-white{
          display: none;
        }

        // MEDIUM MOBILE
        @include responsive('mobileM') {
          max-width: 45px;
        }
        @include responsive('mobileM', true) {
          display: none;
        }
      }
      &.actions {
        max-width: 200px;
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        a {
          cursor: pointer;
        }
        a i {
          @include font-size(3);
          color: $brand-primary;
          transition: color 0.35s;
        }
        a:hover {
          animation: buttonRotation 0.35s forwards;
          i {
            color: $brand-details;
          }
        }
      }
    }

    a {
      position: absolute;
      right: $default-padding;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      i {
        @include font-size(4.5);
        color: $brand-primary;
      }
    }

    &.white {
      background: #fff;
      box-shadow: 0 4px 4px rgba(#000, 0.3);
      border-bottom: 2px solid $brand-details;

      h1 {
        color: $brand-primary;
      }
      .logo .hide-white{
        display: none;
      }
      .logo .show-white{
        display: block;
      }
    }
  }

  //
  // VIDEO CONTENT
  .frame3-player-content {
    background: $brand-dark-color;
    position: absolute;
    top: 0;
    left: 0;
    right: $aside-width;
    bottom: 0;
    z-index: 1;
    transition: right 0.35s;
    &.full-content {
      right: 0;
    }
    &.action-active {
      right: $aside-open-width;
    }

    // MEDIUM MOBILE
    @include responsive('mobileM') {
      right: 0;
    }
  }

  /*
  * -------------------------------------------------
  * MENUS 
  * -------------------------------------------------
  */
  aside.mobile-menu,
  aside.desktop-menu {
    position: absolute;
    bottom: 0;
    transition: width 0.35s, transform 0.35s;
    border-bottom: 8px solid $brand-dark-color;
    border-top: 8px solid $brand-dark-color;
  }

  // desktop version
  aside.desktop-menu {
    width: $aside-width;
    top: 0;
    right: 0;
    background: darken(#fff, 90%);
    box-shadow: -7px 0 4px rgba(#000, 0.2);
    z-index: 3;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;

    &.action-active {
      width: $aside-open-width;
    }
    div.action-panel,
    ul.actions {
      position: absolute;
    }

    ul.actions {
      width: $aside-width;
      padding: $default-padding;
      bottom: 0;
      li {
        display: inline-block;
        width: 100%;
        margin: 10px 0;
        &.space {
          margin: 20px 0;
        }
      }
    }
  }

  // MOBILE VERSION
  aside.mobile-menu {
    background: #fff;
    border-right: 1px solid $brand-details;
    top: $header-height + 1;
    width: 250px;
    z-index: 10;
    transition: transform 0.35s;
    ul {
      list-style: none;
      margin: 0;
      padding: 20px 0;
      li {
        display: block;
        width: 100%;
        &.space {
          height: 1px;
          background: darken(#fff, 15%);
          margin: 20px 0;
        }

        &.about-case a {
          display: flex;
          align-items: center;
          text-align: left;
          padding: $default-padding;
          span {
            margin-left: 15px;
            @include font-size(1.5);
            color: $text-color;
          }
          i {
            color: darken(#fff, 15%);
            @include font-size(3.3);
            transition: color 0.35s;
          }
          &:hover {
            i {
              color: $brand-details;
            }
          }
        }
      }
    }
  }

  .sideBar-enter-active,
  .sideBar-leave-active {
    transition: transform 0.35s;
    transform: translateX(0);
  }
  .sideBar-enter,
  .sideBar-leave-to {
    transform: translateX(100%);
  }

  .mobile-enter-active,
  .mobile-leave-active {
    transform: translateX(0);
  }
  .mobile-enter,
  .mobile-leave-to {
    transform: translateX(-100%);
  }

  /**
  * -------------------------------------------------
  * MOBILE ACTIONS
  * -------------------------------------------------
  */
  div.mobile-actions {
    position: fixed;
    bottom: 30px;
    width: 100%;
    z-index: 9;
    ul {
      padding: 0;
      margin: 0;
      text-align: center;
      li {
        display: inline-block;
        width: 53px;
        height: 53px;
        background: $brand-primary;
        border-radius: 50%;
        margin: 0 5px;
        text-align: center;
      }
    }
  }

  /**
  *------------------------------------------------------------------------
  * CHAT CONTAINER
  *------------------------------------------------------------------------
  */
  div.chats-container {
    position: fixed;
    z-index: 9;
    bottom: 0;
    right: $aside-width + 10;
  }

  //
  // ANIMATIONS
  @keyframes buttonRotation {
    0% {
      transform: rotate(0deg) scale(0.8);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
}
.chat-enter-active,
.chat-leave-active {
  transition: all 0.35s;
  transform: translateY(0);
}
.chat-enter,
.chat-leave-to {
  transform: translateY(100%);
}
</style>
<style lang="scss">
@import 'node_modules/susy/sass/_susy';
@import '~@/scss/variables';
@import '~@/scss/mixins';

body.explain-screen {
  aside.desktop-menu {
    ul {
      bottom: 120px !important;
    }
  }
}

div.action-panel {
  top: 0;
  left: $aside-width;
  bottom: 0;
  right: 0;
  height: 100%;
  background: #fff;
  border-left: 2px solid $brand-details;
  h1 {
    @include font-size(2);
    padding: $default-padding;
    color: $text-color;
    border-bottom: 1px solid $brand-details;
  }
  section {
    padding: $default-padding;
  }
}
</style>
