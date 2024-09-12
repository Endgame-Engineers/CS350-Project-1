const { defineConfig } = require('@vue/cli-service')
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
    allowedHosts: 'all'
  }
})
