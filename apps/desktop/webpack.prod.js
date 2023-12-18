const { merge } = require('webpack-merge')
const common = require('./webpack.base.js')

module.exports = env =>
  common(env).map(config =>
    merge(config, {
      mode: 'production',
      devtool: 'source-map',
    }),
  )
