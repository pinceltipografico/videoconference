module.exports = {
  router: {
    middleware: 'session'
  },

  /**
   * PWA CONFIGURATION
   */
  modules: ['nuxt-device-detect', '@nuxtjs/pwa'],
  manifest: {
    name: 'Video Conferencia',
    lang: 'pt-br',
    orientation: 'portrait',
    shortname: 'frame3'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'Sessão de Video Conferencia',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Sessão de Video Conferencia'
      },
      { name: 'theme-color', content: '#0073b5' },
      { name: 'msapplication-navbutton-color', content: '#0073b5' },
      { name: 'apple-mobile-web-app-status-bar-style', content: '0073b5' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Asap:400,500'
      }
    ],
    script: [{ src: 'https://static.opentok.com/v2/js/opentok.min.js' }]
  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios'],
    extend(config, { dev, isClent }) {
      config.module.rules.push(
        {
          test: /\.svg$/,
          loader: 'vue-svg-loader',
          options: {
            svgs: {
              plugins: [{ removeDocType: true, removeComments: true }]
            }
          }
        },
        {
          test: /\.worker\.js$/,
          loader: 'worker-loader'
        }
      )
      const urlLoader = config.module.rules.find(
        loader => loader.loader === 'url-loader'
      )
      urlLoader.test = /\.(png|jpe?g|gif)$/
    }
  },

  /**
   * PLUGINS
   */
  plugins: [
    '~/plugins/axios',
    '~/plugins/vmask',
    '~/plugins/utils',
    '~/plugins/socket',
    '~/plugins/debug'
  ],

  css: [
    {
      src: '~/scss/globals.scss',
      lang: 'scss'
    }
  ]
}
