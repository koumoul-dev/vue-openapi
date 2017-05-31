var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './test/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './test'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }, {
        test: /\.css$/,
        loader: process.env.NODE_ENV !== 'development' ? 'style-loader!css-loader?minimize' : 'style-loader!css-loader?-minimize'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: false,
    noInfo: false,
    proxy: [{
      context: ['/wotapps', '/avatars', '/registry'],
      target: 'http://localhost:9999',
      secure: false
    }]
  },
  devtool: '#eval'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
