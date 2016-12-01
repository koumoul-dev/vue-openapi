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
      test: /\.json$/,
      loader: 'json-loader'
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
