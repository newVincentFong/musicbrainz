const { merge } = require('webpack-merge')
const base = require('./webpack.base.js')

module.exports = () => base({
  transpileOnly: true,
}).map(
  config => merge(config, {
    mode: 'development',
    devtool: 'inline-cheap-source-map',
  }),
)
