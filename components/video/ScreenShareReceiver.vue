<template>
    <section :class="{'minimized':minimized}" :minimized="minimized">
        <header>
            <span>Desktop do mediador</span>
            <a @click="onMinimize"><i class="material-icons">indeterminate_check_box</i></a>
        </header>
        <a class="enter-fullscreen" @click="enterFullScreen">
            <i class="material-icons">fullscreen</i>
        </a>
        <div>
          <div class="screen-receiver" id="screenReceiver" v-show="!minimized"></div>
        </div>
    </section>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ScreenShareReceiver',
  data() {
    return {
      receiver: null,
      minimized: false
    }
  },
  mounted() {
    this.addDraggable(this.$el)
    if (!this.getScreenStream) return
    let el = this.$el.querySelector('#screenReceiver')
    this.receiver = this.getSession.subscribe(this.getScreenStream, el, {
      width: '100%',
      height: '100%',
      fitMode: 'contain',
      showControls: false
    })
  },
  beforeDestroy() {
    if (this.getScreenStream) {
      this.getSession.unsubscribe(this.receiver)
    }
  },
  methods: {
    enterFullScreen() {
      this.addFullScreenElement(this.$el)
    },
    onMinimize() {
      this.$el.style = ''
      this.minimized = !this.minimized
    }
  },
  computed: {
    ...mapGetters(['getScreenStream', 'getSession'])
  }
}
</script>
<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';
section {
  position: fixed !important;
  width: 800px;
  height: 600px;
  background: #fff;
  z-index: 1000;
  box-shadow: 2px 4px 7px rgba(#000, 0.4);
  top: $header-height + $default-padding;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.35s;
  overflow: hidden;
  > div {
    position: relative;
    padding: $default-padding;
    box-sizing: border-box;
    height: 530px;
    .screen-receiver {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  header {
    border-bottom: 1px solid $brand-details;
    min-height: 30px;
    a,
    span {
      color: $brand-details;
    }
    a {
      cursor: pointer;
      float: right;
      margin-top: 3px;
    }
    span {
      display: inline-block;
      @include font-size(1.5);
      padding: 5px;
    }
  }
  a.enter-fullscreen {
    position: absolute;
    right: $default-padding;
    bottom: $default-padding;
    cursor: pointer;
    i {
      @include font-size(3);
    }
    &:hover i {
      color: $brand-details;
    }
  }
  &.minimized {
    left: 0;
    transform: translateX(0);
    top: 95%;
    height: 30px;
    width: 180px;
    span {
      @include font-size(1);
      padding: 10px;
    }
    a.enter-fullscreen {
      display: none;
    }
  }
  &:fullscreen {
    > div {
      padding: 0;
      height: 100%;
    }
    header {
      display: none;
    }
  }
  &.no-transition {
    transition: none;
  }
}
</style>
