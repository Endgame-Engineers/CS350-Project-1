const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
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
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~bootstrap/scss/bootstrap.scss";`,
      },
    },
  },
});

