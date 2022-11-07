 const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  chainWebpack: (config) => {
    config.module
    .rule("html")
    .test(/\.html$/)
    .use("html-loader")
    .loader("html-loader")
    
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8085,
    // host: 'open.hzgsedu.cn',
    host: '127.0.0.1',
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/api': {
        // target:'http://211.138.120.145:5188',
        // target: 'http://192.168.3.26:5188',
        // target: 'http://192.168.0.69:5188',
        // target: 'http://192.168.0.80:5188',
        // target: 'http://179.10.34.127',
        // target: 'http://192.168.0.8:9528',
        target: 'http://47.103.126.125:8899',
        // target: 'http://192.168.0.217',
        // target: 'http://192.168.30.8',
        // ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
      },
      '/backend/': {
        // target:'http://211.138.120.145:5188',
        // target: 'http://192.168.3.26:5188',
        // target: 'http://192.168.0.69:5188',
        // target: 'http://192.168.0.80:5188',
        // target: 'http://179.10.34.127',
        // target: 'http://192.168.0.8:9528',
        // target: 'http://192.168.30.17/',
        target: 'http://192.168.100.10/',
        // target: 'http://192.168.30.8/',
        // ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/backend/': ''
        },
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
