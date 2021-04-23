<template>
  <div class="logo-animation">
    <logo-novo></logo-novo>
    <div class="la-ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <h2 v-if="texto">{{texto}}</h2>
  </div>
</template>
<script>
import LogoNovo from '../../assets/logo-novo.svg'
export default {
  props: {
    texto: {
      type: String,
      default: null
    }
  },
  components: {
    LogoNovo
  }
}
</script>
<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';
div.logo-animation {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  width: 140px;
  height: 150px;
  text-align: center;
  svg {
    width: 140px;
    height: 120px;
  }
  div.la-ball-pulse {
    color: $brand-details;
    margin: -20px auto 0 auto;
  }
  h2 {
    color: $brand-primary;
  }
}
</style>
