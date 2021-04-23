<template>
  <div>
    <div class="loadingBackdrop" v-show="show"></div>
    <div class="loadingContainer" v-show="show">
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import _ from 'lodash'

  export default {
    name: 'loading',

    data() {
      return {
        delay: _.debounce(v => { this.show = v }, 300),
        show: this.value
      }
    },

    computed: {
      ...mapState({ value: state => state.loading.loading })
    },

    watch: {
      value(v) {
        if (v)
          this.delay(v)
        else {
          this.delay.cancel()
          this.show = false
        }
      }
    }
  }
</script>

<style scoped>
  .loadingBackdrop {
    z-index: 9998;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ccc;
    opacity: 0.8;
  }
  .loadingContainer {
    z-index: 9999;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -46px 0 0 -49px
  }
</style>