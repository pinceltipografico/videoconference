<template>
    <section class="frame3-popups about-case">
        <div>
            <header>
                <h1>Sobre seu caso</h1>
            </header>
            <section class="content">
              <ul>
                <li>
                  <div>
                    <h4>Identificador</h4>
                    <span>00001</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h4>Status</h4>
                    <span>Encerrado com acordo</span>
                  </div>
                  <div>
                    <h4>Adesão</h4>
                    <span>Sim</span>
                  </div>
                  <div>
                    <h4>Contraparte</h4>
                    <span>Solicitado Video Conferencia</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h4>Natureza</h4>
                    <span>Extra Judicial</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h4>Escopo</h4>
                    <span>Limite para saque PJ (R$50.000)</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h4>Anotações do caso</h4>
                    <span>Limite para saque PJ (R$50.000)</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h4>Valor do caso</h4>
                    <span>R$ 50.000,00</span>
                  </div>
                </li>
              </ul>
            </section>
            <footer>
              <nuxt-link :to="{name:redirect}">
                <button class="frame3-button large">FECHAR</button>
              </nuxt-link>
            </footer>
        </div>
    </section>
</template>
<script>
export default {
  transition: 'fade',
  props: {
    redirect: {
      type: String,
      default: 'welcome'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

section.content {
  overflow-x: hidden;
  max-height: auto;
  ul {
    margin: 0;
    padding: 0;
    li {
      display: flex;
      margin-bottom: 10px;
      padding: 5px 10px;
      &:nth-of-type(odd) {
        background: darken($color: #ffffff, $amount: 5%);
      }
      div {
        flex: 1 1 auto;
        h4 {
          @include font-size(1.8);
          margin: 0;
          color: $brand-primary;
        }
        span {
          @include font-size(1.5);
        }
      }
    }
  }
}
</style>

