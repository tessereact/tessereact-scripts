const prodConfig = require('react-scripts/config/webpack.config.prod')
const fs = require('fs')
const path = require('path')
const VirtualModulePlugin = require('virtual-module-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd());
const srcDirectory = path.join(appDirectory, './src')

const tessereactEntry = `
const cssContext = require.context('${srcDirectory}', true, ${/\.css$/})
cssContext.keys().forEach(cssContext)

const scenariosContext = require.context('${srcDirectory}', true, ${/[/.]scenarios?\.jsx?$/})
scenariosContext.keys().forEach(scenariosContext)
`

const tessereactConfig = Object.assign({}, prodConfig, {
  entry: [
    ...prodConfig.entry.slice(0, -1),

    // A virtual file which imports all .css and scenarios.jsx files from src/ directory
    path.join(appDirectory, 'tessereactEntry.js'),

    // Actually run the tessereact UI
    require.resolve('tessereact/entry')
  ],

  plugins: [
    new VirtualModulePlugin({
      moduleName: path.join(appDirectory, 'tessereactEntry.js'),
      contents: tessereactEntry
    }),
    ...prodConfig.plugins
  ]
})

module.exports = tessereactConfig
