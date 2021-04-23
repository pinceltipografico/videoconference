<template>
    <label :for="'label-'+name" :class="{'checked': value}">
        <input ref="$inputCheck" type="checkbox" :id="'label-'+name" v-bind:value="value" @change="onChange()">
        <span class="checkbox">
          <transition name="fade">
            <i class="material-icons" v-if="value">check</i>
          </transition>
        </span>
        <span class="label"><slot>Replaced content</slot></span>
    </label>
</template>
<script>
export default {
  data() {
    return {
      id: null
    }
  },
  props: ['value', 'name', 'checked'],
  methods: {
    onChange() {
      this.$emit('input', this.$refs.$inputCheck.checked)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/scss/mixins';
@import '~@/scss/variables';
label {
  position: relative;
  display: flex !important;
  align-items: center;
  @include font-size(1.8);
  margin: $default-padding * 2 0;
  cursor: pointer;

  input {
    visibility: hidden;
    opacity: 0;
    display: none;
  }
  span.checkbox {
    width: 30px;
    height: 30px;
    position: relative;
    float: left;
    border: 1px solid lighten(#000, 70%);
    text-align: center;
    line-height: 30px;
    margin-right: $default-padding;
    i {
      @include font-size(3);
    }

    // MDIUM MOBILE
    @include responsive('mobileM') {
      display: block;
      width: 50px;
    }
  }
  span.label {
    float: left;
  }

  &:hover,
  &.checked {
    color: $brand-details;
    span {
      border-color: $brand-details;
    }
  }
}
</style>
