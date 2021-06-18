const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')

module.exports = webpackMerge.merge(
  commonConfiguration,
  {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
        DEBUG: false,
      })
    ],
    devServer: {
      host: '0.0.0.0',
      useLocalIp: true,
      contentBase: './dist',
      open: true,
      hot: true,
      overlay: {
        warnings: true,
        errors: true
      },
      stats: {
        assets: false,
        builtAt: true,
        children: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: {
          green: '\u001b[32m',
        },
        depth: false,
        entrypoints: false,
        env: false,
        hash: false,
        outputPath: false,
        publicPath: false,
        timings: false,
        source: false,
        reasons: false,
        modules: false,
        providedExports: false,
        logging: 'info',
        loggingTrace: false,
        version: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  }
)
