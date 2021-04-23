<template>
  <section class="session-infos">
    <nuxt-child />
    <section class="logo" v-if="$device.isMobile">
      <logo-novo></logo-novo>
    </section>
    <section class="active-on-session">
      <h2 :class="{'no-users':!sessionMembers.length && getStreams.length}">
        {{sessionMembers.length && getStreams.length ? 'Estão ativos agora nesta sessão.'
        :'Ainda não há ninguém conectado a esta sessão. Necessário aguardar o mediador ou o suporte entrar na sala'}}
        <div class="la-ball-pulse la-sm" style="color:#fff;">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </h2>
      <active-user v-for="user in sessionMembers" :key="user.id" :user="user" v-if="canShow(user)"></active-user>
    </section>

     <!-- SEND LOADER -->
    <div class="la-ball-pulse la-sm" v-if="sending">
      <div></div>
      <div></div>
      <div></div>
    </div><!-- SEND LOADER -->
    
    <template v-if="!sending">

      <!-- CLICK TO SEE MEDIATION DETAILS -->
      <section class="case-details-actions">
        <nuxt-link :to="{name:'welcome-about-case'}">
          <div class="big-nutton">
            <i class="material-icons">insert_drive_file</i>
          </div>
          <span>Clique aqui para ver<br/> detalhes de sua Video Conferencia</span>
        </nuxt-link>
      </section><!-- CLICK TO SEE MEDIATION DETAILS -->

      <!-- PROFILE DATA -->
      <section :class="{'no-active-on-session':!getStreams.length}">
        <form @submit.prevent="checkCanEnter">
          <h2 v-if="!$device.isMobile">Por favor preencha ou confirme seus dados</h2>
          <section class="form-container">
            <inputs icon="person" :class="{'invalid':$v.model.name.$error}">
              <input type="text" 
                    placeholder="Insira seu nome"
                    slot="input"
                    v-model.trim="model.name"
                    @input="$v.model.name.$touch()"
                    @keypress="onKeyPress"/>
              <span slot="messages" v-if="!$v.model.name.required && $v.model.name.$dirty">Este campo é obrigatório</span>
              <span slot="messages" v-if="!$v.model.name.minLength && $v.model.name.$dirty">Mínimo 10 caracteres</span>
            </inputs>
            <inputs icon="mail" :class="{'invalid':$v.model.email.$error}">>
              <input type="text"
                    placeholder="Insira seu email"
                    slot="input"
                    v-model.trim="model.email"
                    @input="$v.model.email.$touch()" />
              <span slot="messages" v-if="(!$v.model.email.required || !$v.model.email.email) && $v.model.email.$dirty">
                {{$v.model.email.required ?'Formato de email inválido' :'Este campo é obrigatório'}}
              </span>
            </inputs>
            <inputs icon="phone" :class="{'invalid':$v.model.phone.$error}">>
              <the-mask type="text"
                    placeholder="Insira seu telefone"
                    slot="input"
                    v-model.trim="model.phone" @input="$v.model.phone.$touch()"
                    :mask="['(##) ####-####','(##) #####-####']"></the-mask>
              <span slot="messages" v-if="!$v.model.phone.required && $v.model.phone.$dirty">Este campo é obrigatório</span>
            </inputs>
          </section>
          <footer>
            <button type="submit"
                    class="frame3-button medium"
                    :disabled="$v.model.$invalid">Entrar</button>
          </footer>
        </form>
      </section> <!-- PROFILE DATA -->

    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { Inputs, ActiveUser } from '~/components/core'
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'
import { UserService } from '../resources'
import LogoNovo from '../assets/logo-novo.svg'
import Worker from '../workers/requests.worker'

export default {
  layout: 'player',
  //
  // DATA
  data () {
    return {
      model: { canRecord: true, name: '', email: '', phone: '' },
      session: null,
      activeUsers: [],
      sending: false,
      worker: new Worker(),
      sessionMembers: []
    }
  },

  /*
  * VALIDATIONS MIXINS
  */
  mixins: [validationMixin],

  /*
  * VALIDATIONS RULES
  */
  validations: {
    model: {
      name: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      },
      phone: {
        required
      }
    }
  },

  /**
   * COMPONENTS
   */
  components: {
    Inputs,
    ActiveUser,
    LogoNovo
  },

  /**
   * WHEN COMPONENT WAS MOUNTED
   */
  mounted () {
    this.session = this.getSession
    this.model = Object.assign({}, this.getUser)
    this.logger = this.$debugger('Welcome.vue')
    this.logger.debug('Start Welcome Screen')

    //
    // VERIFY IF THERES SOMEONE ON THE SESSION
    //
    this.worker.postMessage({
      method: 'GET',
      endPoint: `users?sessionId=${this.getSession.id}`,
      interval: 2000
    })
    this.worker.onmessage = event => {
      this.sessionMembers = event.data
    }
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'add_stream') {
        this.checkCanEnter()
      }
    })

    //
    // VERIFY IF A STREAM WAS ADDED
    // AND IF CAN ENTER ON SESSION
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'add_stream') {
        this.checkCanEnter()
      }
      console.log(mutation.type)
    })

    // IF USER ALREADY EXISTS
    // AND HAVE STREAMS
    if (this.getUser && this.getStreams.length) {
      this.checkCanEnter()
    }
  },

  /**
   * ------------------------------------------------------
   *  METHODS
   * ------------------------------------------------------
   */
  methods: {
    checkCanEnter () {
      if (
        !this.canEnterSession &&
        !this.getUser.profileType.match(/(suporte|mediador)/g)
      ) {
        this.addClass(this.$el, 'wait-sessions-member')
      } else {
        this.onEnter()
      }
    },
    /**
     * WHEN USER ACCEPT TO ENTER
     */
    onEnter () {
      this.model.sessionId = this.getSession.id
      this.$store.dispatch('setUser', this.model)
      this.sending = true
      UserService.save(this.getUser).then(res => {
        this.$store.dispatch('setUser', Object.assign(this.getUser, res.data))
        this.$router.replace({
          name:
            this.getUser.termsAccepted ||
            this.getUser.profileType.match(/(mediador|suporte)/g)
              ? 'session'
              : 'welcome-license-agree'
        })
      })
    },

    /**
     * WHEN CLICK ON CANCEL
     */
    onCancel () {
      window.location.href = 'https://google.com'
    },

    /**
     * CHECK IF THE USER WANTS TO RECORD
     * THE SESSION
     * @Unused
     */
    onRecordAccpetChange (value) {
      this.$store.dispatch('setCanRecord', value)
    },

    /**
     * USED TO PREVENT USER TO INPUT NUMBER
     * AND SPECIAL CHARACTERS ON NAME
     */
    onKeyPress (event) {
      let _event = event || window.event
      if (!_event.key.match(/[A-Z\sÀ-ü]/gi)) {
        _event.preventDefault()
      }
    },
    canShow: function (user) {
      let isOnStreams = this.getStreams.filter(item => {
        return JSON.parse(item.name).id === user.id
      })
      return isOnStreams.length
    }
  },

  /** COMPUTED */
  computed: {
    ...mapGetters(['getSession', 'getStreams', 'getUser', 'canEnterSession'])
  },

  /**
   * BEFORE DESTROY THE SESSION
   */
  beforeDestroy () {
    this.worker.terminate()
  }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/variables";
@import "~@/scss/mixins";
section.session-infos {
  background: #fff !important;
  padding-top: 50px;
  min-height: 100%;

  .logo {
    text-align: center;
    padding: 20px;
    svg {
      max-width: 130px;
    }
  }

  h2 {
    padding: 20px;
    @include font-size(2);
    font-weight: 100;
    color: $brand-primary;
    text-align: center;

    .la-ball-pulse {
      display: none;
    }

    // MEDIUM MOBILE
    @include responsive("mobileM") {
      @include font-size(1.5);
      font-weight: bold;
    }
  }

  section.active-on-session {
    text-align: center;
    background: $brand-primary;
    padding: $default-padding * 3;
    min-height: 150px;
    h2 {
      width: 40%;
      padding: 10px;
      margin: 0 auto;
      color: #fff;
      &.no-users {
        margin-top: 30px;
      }

      // medium mobile
      @include responsive("mobileM") {
        width: 90%;
      }
    }

    @include responsive("mobileM") {
      padding: $default-padding;
    }
  }

  section.case-details-actions {
    background: darken($color: #ffffff, $amount: 5%);
    text-align: center;
    padding: 70px 0;
    div.big-nutton {
      display: inline-block;
      width: 70px;
      height: 70px;
      background: $brand-details;
      border-radius: 50%;
      i {
        color: #fff;
        line-height: 70px;
        @include font-size(4);
      }
    }
    span {
      display: block;
      text-align: center;
      @include font-size(1.5);
      color: $text-color;
    }
    /**
    *------------------------------------------------------------------------
    * MOBILE MEDIUM
    *------------------------------------------------------------------------
    */
    @include responsive("mobileM") {
      padding: 20px 0;
    }
  }

  .no-active-on-session {
    // MEDIUM MOBILE
    @include responsive("mobileM") {
      padding-top: 40px;
    }
  }

  /**
  *------------------------------------------------------------------------
  * FORM STYLES
  *------------------------------------------------------------------------
  */
  form {
    max-width: 80%;
    margin: 0 auto;
    padding-bottom: 50px;

    footer {
      margin: 50px 0 0 0;
      text-align: center;
      button {
        margin: 0 $default-padding / 2;

        // medium mobile
        @include responsive("mobileM") {
          margin: 0;
          width: 50%;
          @include font-size(2);
        }
      }
    }

    // medium mobile
    @include responsive("mobileM") {
      max-width: 90%;
    }
  }

  &.wait-sessions-member {
    section {
      display: none;
    }
    section.active-on-session {
      display: table;
      height: 100%;
      width: 100%;
      h2 {
        display: table-cell;
        height: 100%;
        vertical-align: middle;
        padding: 0 20%;

        .la-ball-pulse {
          display: block;
        }
      }
      .active-users{
        display: none !important;
      }
    }
  }

  // MEDIUM MOBILE
  @include responsive("mobileM") {
    padding-top: 0;
  }
}
</style>
