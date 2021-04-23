<template>
    <div class="form-label" :class="{'with-icon':icon}">
        <div class="input-container">
            <i class="material-icons" v-if="icon">{{icon}}</i>
            <slot name="input"></slot>
        </div>
        <div class="messages">
            <transition name="fade">
                <slot name="messages"></slot>
            </transition>
        </div>
    </div>
</template>
<script>
export default {
  name: 'inputs',
  props: {
    icon: {
      type: String,
      default: null
    }
  }
}
</script>
