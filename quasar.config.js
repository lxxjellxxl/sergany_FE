// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

const { configure } = require('quasar/wrappers')
const path = require('path')

module.exports = configure(function (ctx) {
  return {
    boot: ['i18n', 'axios', 'dark'],

    css: ['app.css'],

    extras: ['fontawesome-v6', 'roboto-font', 'material-icons'],

    build: {
      target: {
        browser: ['es2019', 'firefox91', 'chrome91', 'safari13.1'],
        node: 'node18',
      },

      vueRouterMode: 'history',

      env: {
        // Point to the DigitalOcean Server
        API_BASE_URL: 'http://164.90.163.108',
      },

      vitePlugins: [
        [
          '@intlify/vite-plugin-vue-i18n',
          {
            include: path.resolve(__dirname, './src/i18n/**'),
          },
        ],
      ],
    },

    devServer: {
      open: true,
    },

    framework: {
      config: {},
      plugins: ['Notify', 'Dialog', 'Loading', 'Dark'],
    },

    animations: [],
  }
})
