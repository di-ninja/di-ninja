const webpack = require('webpack')

module.exports = {
  entry: {
    'browser.dist': ['./test/browser.js']
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/test',
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        APP_ENV: JSON.stringify('browser')
      }
    })
  ],
  devtool: 'source-map'
}
