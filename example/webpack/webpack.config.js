const dotenv = require('dotenv')

dotenv.config()

const path = require('path')

const webpack = require('webpack')

// const express = require('express')

const DotenvWebpack = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const env = process.env
const DEV = env.NODE_ENV !== 'production'

const SERVER_PORT = env.SERVER_PORT || 80

env.APP_ENV = JSON.stringify('browser')

const config = {

  context: path.resolve(__dirname, 'app'),

  entry: {
    'app': ['./index.js']
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].[hash].js',
    chunkFilename: 'vendor.[hash].js',
    publicPath: '/',
  },

  resolve: {
    symlinks: true,
    alias: {
      'app': path.resolve('./app'),
    },
    modules: [
      'node_modules'
    ]
  },

  node: {
    fs: 'empty'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0 // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 10,
          enforce: true
        }
      }
    }
  },

  plugins: [
    new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html'
    }),
    new DotenvWebpack(),
    new webpack.DefinePlugin({
      'process.env' : {
        APP_TITLE: JSON.stringify(env.APP_TITLE),
        DEBUG: JSON.stringify(env.DEBUG),
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin({
      // Options...
    }),
    new MiniCssExtractPlugin({
      filename: DEV ? '[name].css' : '[name].[hash].css',
      chunkFilename: DEV ? '[id].css' : '[id].[hash].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [

          ],
          presets: [

          ],
          cacheDirectory: true,
          babelrc: true
        }
      },
      {
        test: /\.php$/,
        use: [
          {
            loader: 'webpack-php-loader',
            options: {
              // debug: true
            }
          }
        ]
      },

      {
        test: /\.module\.css$/,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: DEV,
                minimize: !DEV,
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
                camelCase: true,
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: DEV }
            },
          ]
      },
      {
        test: /\.module\.(sass|scss)$/,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: DEV,
                minimize: !DEV,
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
                camelCase: true,
                importLoaders: 3
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: DEV }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: DEV
              }
            },
          ]
      },

      {
        test: /^(?!.*?\.module).*\.css$/,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: DEV,
                minimize: !DEV,
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: DEV }
            },
          ]
      },
      {
        test: /^(?!.*?\.module).*\.(sass|scss)$/,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: DEV,
                minimize: !DEV,
                importLoaders: 3
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: DEV }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: DEV
              }
            },
          ]
      },

      {
        test: /\.less$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: DEV,
              minimize: !DEV,
            }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: DEV }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          },
        ]
      },

      {
        test: /\.(jpg|png|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: '',
            publicPath: ''
          }
        }]
      },
      {
        test: /\.(html)$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      },
    ]
  },

  externals: {

  },
  devtool: 'source-map',
  devServer: {
    hot: true,

    historyApiFallback: { disableDotRule: true },
    contentBase: path.resolve('dist'),
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: '0.0.0.0',

    // allowedHosts: process.env.WEBPACK_DEV_SERVER_ALLOWED_HOSTS.split(','),
    disableHostCheck: true,


    before: function(app){
      // app.use('/plugins', express.static('app/plugins'))
    },

    port: SERVER_PORT,
    // useLocalIp: true,

    public: process.env.WEBPACK_DEV_SERVER_PUBLIC || "localhost",

  },

  watchOptions: {
    // poll: 1000,
  }
}

if(!DEV){
  config.plugins.push(new UglifyJSPlugin({
    sourceMap: true
  }))
}

module.exports = config
