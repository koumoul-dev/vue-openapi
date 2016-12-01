var webpack = require('webpack')

module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: './',
    publicPath: '/',
    chunkFilename: '[id].[hash].app.js'
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.css$/,
      loader: process.env.NODE_ENV !== 'development' ? 'style!css?minimize' : 'style!css?-minimize'
    }, {
      test: /\.less$/,
      loader: process.env.NODE_ENV !== 'development' ? 'style!css?minimize!less' : 'style!css?-minimize!less'
    }, {
      test: /\.svg$/,
      exclude: /assets\/.*$/,
      loader: 'svg-url-loader'
    }, {
      test: /assets\/.*$/,
      loader: 'file?name=assets/[name].svg'
    }, {
      test: [/flags\/(1x1|4x3)\/.*\.svg$/, /moment\/locale\/(?!fr)/],
      exclude: /flags\/(1x1|4x3)\/(gb|fr)\.svg$/,
      loader: 'ignore-loader'
    }]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devtool: process.env.NODE_ENV !== 'development' ? 'source-map' : 'eval',
  plugins: process.env.NODE_ENV !== 'development' ? [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin()
  ] : []
}
