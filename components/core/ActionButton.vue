<template>
  <a @click="onClick">
    <i class="material-icons">{{icon}}</i>
    <span :class="{'tooltip':!$device.isMobile}" v-if="label">{{label}}</span>
  </a>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'ActionButton',
  /**
   *------------------------------------------------------------------------
   * private data
   *------------------------------------------------------------------------
   */
  data() {
    return {
      canClick: true
    }
  },
  /**
   *------------------------------------------------------------------------
   * PUBLIC PROPERTIES
   *------------------------------------------------------------------------
   */
  props: {
    icon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: null
    },
    eventType: {
      type: String,
      default: null
    },
    openSideBar: {
      type: Boolean,
      default: false
    },
    dispatch: {
      type: String,
      default: 'setSideBarContentActive'
    },
    params: {
      default: null
    },
    value: {
      default: null
    }
  },
  /**
   *------------------------------------------------------------------------
   * PUBLIC METHODS
   *------------------------------------------------------------------------
   */
  methods: {
    onClick($event) {
      $event.preventDefault()
      if (!this.canClick) return

      // case need to open side ba
      this.$store.dispatch('setSideBarOpen', this.openSideBar)

      // SET STORE VALUE
      this.$store.dispatch(this.dispatch, this.value)
      this.canClick = false
      setTimeout(() => {
        this.canClick = true
      }, 400)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/scss/mixins';
@import '~@/scss/variables';

a {
  position: relative;
  display: inline-block;
  width: 100%;
  text-align: center;
  cursor: pointer;
  i {
    @include font-size(3.3);
    color: darken(#fff, 65%);
    transition: color 0.35s;
  }

  // TOOL TIP FORMAT
  span.tooltip {
    position: absolute;
    width: 100px;
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    background: $brand-primary;
    padding: $default-padding/2;
    border-radius: 5px;
    color: #fff;
    transition: opacity 0.35s;
    visibility: hidden;
    opacity: 0;
    @include font-size(1.3);
    &:after {
      content: '';
      display: block;
      position: absolute;
      border-left: 8px solid $brand-primary;
      border-bottom: 8px solid transparent;
      border-top: 8px solid transparent;
      left: 100%;
      top: 50%;
      margin-top: -8px;
    }
  }

  &.small {
    i {
      @include font-size(2.5);
      color: darken(#fff, 20%);
    }
  }
  @include responsive('mobileM') {
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
    }
  }
}
a:hover {
  span {
    opacity: 1;
    visibility: visible;
  }
}
a:hover,
a.action-active {
  i {
    color: $brand-details;
  }
}
a.deactive {
  i {
    color: darken(red, 30%);
  }
}

a.red {
  i {
    animation: onRecord 1s ease-in-out infinite alternate;
  }
}
@keyframes onRecord {
  from {
    color: darken(#fff, 65%);
  }
  to {
    color: darken($color: red, $amount: 20%);
  }
}
</style>
