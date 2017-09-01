const devConfig = require('react-scripts/config/webpack.config.dev')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const appDirectory = fs.realpathSync(process.cwd());

const testshotConfig = Object.assign({}, devConfig, {
  entry: [
    ...devConfig.entry.slice(0, -1),
    `multi-entry-loader?include[]=${appDirectory}/src/**/*.css,include[]=${appDirectory}/src/**/scenarios.js,include[]=${appDirectory}/src/**/scenarios.jsx!`,
    require.resolve('tessereact/entry')
  ],

  output: Object.assign({}, devConfig.output, {
    filename: 'static/js/testshot.js'
  })
})

module.exports = testshotConfig
