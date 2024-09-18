const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  outputDir: '../backend/dist/public/',
  publicPath: '/',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/': {
        target: 'https://8081--main--cs350--perc85.coder.galifrey.dev/',
        changeOrigin: true,
        ws: true,
      },
    },
    allowedHosts: 'all',
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('~bootstrap', path.resolve(__dirname, 'node_modules/bootstrap'));
  },
  pwa: {
    name: 'Carbio.fit',
    themeColor: '#E5955B',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      short_name: 'Carbio',
      start_url: '.',
      display: 'standalone',
      background_color: '#212529',
    },
    icons: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/carbiofit-icon.svg',
      msTileImage: 'img/icons/mstile-144x144.png'
    },
  }
});

