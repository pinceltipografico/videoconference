<template>
    <div :class="{'no-name':!showName}" class="active-users">
        <img :src="user.photo" :alt="user.name" v-if="user.photo">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEXp6ekyicju7Orv7eosh8cjhMcbgsbz7+vm6OnS3eVqo9GlwNpZm86FsdWtx923zd/D1OE6jcnd4+ePttdhn8/K2eO0y95Hk8va4eaWuth7q9PG1uKCr9VHkst2qdJTmM2pw9zjWxOzAAAHyElEQVR4nO2d25aqMAyGIU05iXLwBKLi+z/lLqgz6lbk0KbtLL6bvfZcjP6T0KYhTRxnZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZsYyAIABaxH/iP/p/kIyAeYHYborl+foynG9SKpCKP4LMoWxtrtjnLmcc/yh+U+2j8o0t1wl+HlyOGErzX2lFerGZSVsqfuLjgSC3cblb7Q9yRTGXG9t1Aj+9vhN3l0l5/UqsEwjsHTTT95dJC5zpvtb9wcg2Xv95d0NucxtsSNU8VB9LZyvrfBVyM+j9LUas5X5mwesXD5SnwC9TWi2RCg2ow1404gL3SK6gJ07TV+DFxm84qwnGvBmxiw1c+OAYDPhCXySyBcmWhHCkwwDXvGW5klkqYRH8Bce6Rb0CiQDYrR+EgPdmp6ARKoFW4mxSRKZfIFmOSpsFQgUEs+mLDdQSFxFnySasqIGsRqBQqIZ+yKcJW30/4OYGiCRLZQJbAK4XLc+scpI3ghfJOpfUIO9SoEGPIqwVOijDYh6j8RQKRYoJG50CnScWq2PNvCVRiPCxVMuUKynGgPUPFNvQmHEtTYjQqn8KWxALHQpzJVuhb9oi0+JTKjRiIGSM9M7ND2JoDIgfQZdLcspKI7XHuEXDUaElGAvvIO1hhwxO9CZ0HW9rQYjkj2FDRrWGkhIFWLmkys8UzqpDjf1aQW6vCRWCBXhStqANbGbEm73NzxagQ7bEHupyxNaN/WJjhUPCokfxJDaSV2MSMMa4t2wVeiSLjVkR8MHOGn6m3q/bxVWlA8iU/a6qUPhjlKhT5Jke1FIm9+nFyiOF5SLaa5BIR4obRjqUBhRKtxqUUjppVoUkuZqZoVKFO7/vML4zyskXUuLP69Qx47Pl5ReSn/Epz7k+4RvZX4UklYssEiDQtIaN6a6UOidwpBQoAMrDQpJj4eQ0meiiJPeAb3CI+1LUl9R4fNnqIu/2JJaoUe60DS31IjdFF3qN/kB9ds18qsJPkHd5SO02dIG6rw+p68ZKkjdlPbodIWRBt86CoVp33MjuT6HNqzBo47iRMqyLy1FX46zJVtrcKOnSBjIjsEecR3Gj0Kq+kuMdRXrA1FRDXUpzYNC9XeCGjDWpM+hKligTUG9EBLkTfVeeCaIv9HVdmOmJVB+iNJ9xRJSxX6q+/qhcj/FzICuSko3Ra3XK29AobA+yoyuCgofRdyY0d9E2VkYT6b0xGJrJRLRNWCVuaGkNYYZTTHuQCRdInKzeppJl4j6jkwfkOyoyCujLNjgy3zxja6e1FM3/oXL2hf5qTBQYNOUTk50gzwytVMrFLEET0Wkvog3iPXkCI7vSe9VDAbSetLTiGh8v2QIyvGtFpDXZm3z72HheZyrIs8Wpi4xzwA07cpH6Fub7qC/gJNEQ1qyX/UVFjjoL+BUB7evIRG9emGP/e4AFIvY+y4SkbuH1I7n7z/ACcuYd7irUOdl51VgfiP2z4CTr44199oBJU/akHPPjcrKanlXhIKguqyj2vV+4Fl8Lneh83cG6kCDiFvDK8HtB1ZgydccC0CwUv0RgcYZNCJ2OXterHQjYyse7zQ5CsCubgYFoJsoi0UgOHgiHNASrt71tQHXUtEXgGrPr5/gltQaIX0cJaPm0ApO+RMRibD1QumrUJyfozEVZoSqfkyJiNCVLAUOzuX/UTL8JHc9YPnxNaRFfqCJziGM3oXT6G3kuSoEi+xNTotnFHlwWH1KUoi/sZx3ReJ0uX9/JlG3qP1+ePCf8zz+jXEZTt6fhb7482fwWm0yHMLuhChyPGwnxZssWHXoaz4iU1m0D9+T2uJUtEmCkSEAQFievp2ZUeFdUlj1HPZ3Wo8wpIhxk6hX4oMfVKhz2tf1ffMuHOtFOGT+JjAnPZ76Jq8UzaCBQS/rG5Fl6vRRCcwvducMByQgeaxgSR1ejdDM34wWaeB/POs2A3RZmKzrnsMuH373XvrrN39UuUUzZRT3h0USBn47CPgOE4ZjebVbR8J2Q+W1v/kkufPXOIE3le1sXLeOjsvFjXJ53pyuPx/7jkNy4bC/mFyzfpsCfOPt+Nxh8Fqin7IV8WXDXnB5PYdIuz4PgB8l3e6GQkMTjF54ksqHVU+SmYAn5VDM5Bd0SUNKlTvT0OWyP1hPFqi8Un0i04uIc3MfwitT73grnKkmCcwmPYpMQ5OWoUy75a2yDF8aUy7VmO+jDZiN7glC3t1jJOMvtxm/jt4Zu54qumOgADyNytsAxe1JSYybYEJ3F306o4YkaugrP4FR/XmIO+xMZHjDdjAycfGZEYkpW3aKO0MbS9hmwhFGtM2EQ41onwmHGhHIewZKYIgRIbHPhMPa9OiYzyGB/q2WgK49klT6j4dgGobISKH3rJ3cpoj0kb41DPQj1WSBWT+FzMat4kq/DUNDE2Rp9BtjAqQTVCXj9Vpr7Ele/E+f3KktKcT34P77a2EdHfMl0qM1fWC1wB5bot1O2sdNrY3Y7nx3UxveNnXxbTWF1HKB4pTY7abDSixNBN3udxjMrjzwO7507inG90Mwhe5BkHa9rHhP9wA6e14Zfqa7TsrSFNQznS1rc9t3w4auwA2qPyCw8xisY4qTfPD02Ybs+Cds6H4OTRlRB3LFdPRbNLgaeAj88lGhFWVs3+kYBaljuqgCXhbTfwt5jqa5kvl2AAAAAElFTkSuQmCC" :alt="user.name" v-if="!user.photo">
        <span v-if="showName">{{user.name}}<small>{{user.profileType}}</small></span>
    </div>
</template>
<script>
export default {
  /**
   * COMPONENT DATA
   */
  data () {
    return {
      picture: null
    }
  },
  //
  // PROPOS
  props: {
    user: {
      type: Object,
      default: null
    },
    showName: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';
div {
  display: inline-block;
  max-width: 100px;
  text-align: center;
  margin: 0 10px;
  &.no-name {
    flex: none;
  }
  img {
    display: inline-block;
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 2px solid $brand-details;
  }
  span {
    display: block;
    @include font-size(1.5);
    color: #fff;
    small {
      display: block;
      color: #fff;
      background: $brand-details;
      border-radius: 5px;
      padding: 3px;
      @include font-size(1.2);
      font-weight: bold;
    }
  }
  &.small {
    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
