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
    config.plugin('html').tap(args => {
      args[0].title = 'Carbio.fit'; // Default title
      return args;
    });
    config.resolve.alias
      .set('~bootstrap', path.resolve(__dirname, 'node_modules/bootstrap'));
  },
  pwa: {
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/carbiofit-icon.svg',
      msTileImage: 'img/icons/mstile-144x144.png'
    },
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
      icons: [
        {
          src: 'img/icons/apple-touch-icon-57x57.png',
          sizes: '57x57',
          type: 'image/png'
        },
        {
          src: 'img/icons/apple-touch-icon-60x60.png',
          sizes: '60x60',
          type: 'image/png'
        },
        {
          src: 'img/icons/apple-touch-icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: 'img/icons/apple-touch-icon-76x76.png',
          sizes: '76x76',
          type: 'image/png'
        },
        {
          src: 'img/icons/apple-touch-icon-114x114.png',
          sizes: '114x114',
          type: 'image/png'
        },
        {
          src: 'img/icons/apple-touch-icon-120x120.png',
          sizes: '120x120',
          type: 'image/png'
        },
        {
          src: 'img/icons/apple-touch-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'img/icons/apple-touch-icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: 'img/icons/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png'
        },
        {
          src: 'img/icons/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png'
        },
        {
          src: 'img/icons/favicon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: 'img/icons/favicon-128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: 'img/icons/favicon-196x196.png',
          sizes: '196x196',
          type: 'image/png'
        },
        {
          src: 'img/icons/mstile-70x70.png',
          sizes: '70x70',
          type: 'image/png'
        },
        {
          src: 'img/icons/mstile-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'img/icons/mstile-150x150.png',
          sizes: '150x150',
          type: 'image/png'
        },
        {
          src: 'img/icons/mstile-310x150.png',
          sizes: '310x150',
          type: 'image/png'
        },
        {
          src: 'img/icons/mstile-310x310.png',
          sizes: '310x310',
          type: 'image/png'
        }
      ]
    },
  }
});

