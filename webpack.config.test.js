module.exports = {
  entry: {
    'test/browser.dist': ['./test/browser.js']
  },
  output: {
    filename: '[name].js'
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
  devtool: 'source-map'
}
