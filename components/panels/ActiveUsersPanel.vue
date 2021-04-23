<template>
    <div class="action-panel" :class="{'with-padding':!getStreams.length}">
        <h1>Usuários Ativos na Sessão</h1>
        <ul class="users-infos">
            <li v-for="user in users" :key="user.id">
                <active-user :user="user" :showName="false" class="small"></active-user>
                <div>
                    <h4>{{user.name}}</h4>
                    <span><strong><i class="material-icons">mail</i> </strong>{{user.email}}</span>
                    <span><strong><i class="material-icons">phone</i> </strong>{{user.phone}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { ActiveUser } from '../core'
import Worker from '../../workers/requests.worker'
export default {
  data () {
    return {
      users: null,
      worker: new Worker()
    }
  },
  components: {
    ActiveUser
  },
  mounted () {
    this.worker.postMessage({method: 'GET', endPoint: `users?sessionId=${this.getSession.id}`})
    this.worker.onmessage = (event) => {
      this.users = event.data
    }
  },
  computed: {
    ...mapGetters(['getSession', 'getStreams'])
  },
  beforeDestroy () {
    this.worker.terminate()
  }
}
</script>
<style lang="scss">
@import '~@/scss/variables';
div.action-panel.with-padding{
  padding-top: 70px;
}
ul.users-infos {
  list-style: none;
  padding: 0;
  li {
    display: flex;
    align-items: center;
    color: lighten($color: #000000, $amount: 20%);
    padding: 5px 0;
    &:nth-of-type(odd) {
      background: darken($color: #ffffff, $amount: 5%);
    }
    h4 {
      padding: 0;
      margin: 0;
    }
    span {
      display: block;
      &:after {
        content: '';
        display: table;
        clear: both;
      }
      i {
        font-size: 14px;
        float: left;
        margin-right: 5px;
      }
    }
  }
}
</style>

