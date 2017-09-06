const devConfig = require('react-scripts/config/webpack.config.dev')
const fs = require('fs')
const path = require('path')
const VirtualModulePlugin = require('virtual-module-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd());
const srcDirectory = path.join(appDirectory, './src')

const tessereactEntry = `
const cssContext = require.context('${srcDirectory}', true, ${/.css$/})
cssContext.keys().forEach(cssContext)

const scenariosContext = require.context('${srcDirectory}', true, ${/\/scenarios\.jsx?$/})
scenariosContext.keys().forEach(scenariosContext)
`

const testshotConfig = Object.assign({}, devConfig, {
  entry: [
    ...devConfig.entry.slice(0, -1),

    // A virtual file which imports all .css and scenarios.jsx files from src/ directory
    path.join(appDirectory, 'tessereactEntry.js'),

    // Actually run the tessereact UI
    require.resolve('tessereact/entry')
  ],

  output: Object.assign({}, devConfig.output, {
    filename: 'static/js/tessereact.js'
  }),

  plugins: [
    new VirtualModulePlugin({
      moduleName: path.join(appDirectory, 'tessereactEntry.js'),
      contents: tessereactEntry
    }),
    ...devConfig.plugins
  ]
})

module.exports = testshotConfig
