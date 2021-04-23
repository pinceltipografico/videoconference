<template>
    <section class="frame3-popups">
        <div>
            <header>
                <h1>Termo de responsabilidade</h1>
            </header>
            <section>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur ratione delectus dolorem, similique quidem perspiciatis magnam sunt fugit, maxime repellendus nisi facilis ex eum fuga quam adipisci culpa provident.</p>
            </section>
            <footer>
                <check-box v-model="acceptTerms" name='record'>
                    Concordo que li e estou de acordo com os termos acima
                </check-box>
                <button class="frame3-button large" :disabled="!acceptTerms" @click="onAccept()">Iniciar Video Conferencia</button>
            </footer>
        </div>
    </section>
</template>
<script>
import { CheckBox } from '~/components/core'
export default {
  transition: 'fade',
  data () {
    return {
      acceptTerms: false
    }
  },
  components: {
    CheckBox
  },
  methods: {
    onAccept () {
      this.$store.dispatch('setTermsAccepted', true)
      this.$router.replace('/session')
    }
  }
}
</script>
<style lang="scss" scoped>
section{
    display: block !important;
}
</style>

