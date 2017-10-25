#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc. and Tessereact authors.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Currently tessereact-scripts depends on react-scripts installed as a peer.

// Ensure environment variables are read.
require('react-scripts/config/env')

const path = require('path')
const fs = require('fs')
const url = require('url')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const {
  prepareProxy,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')
const paths = require('react-scripts/config/paths')
const config = require('../config/webpack.config.tessereact')
const createDevServerConfig = require('react-scripts/config/webpackDevServer.config')
const tessereactServer = require('tessereact/server')
const choosePorts = require('../lib/choosePorts')
const createCompiler = require('../lib/createCompiler')
const printInstructionsWhenReady = require('../lib/printInstructionsWhenReady')

const isInteractive = process.stdout.isTTY

let userConfig = {}
try {
  userConfig = require(path.join(fs.realpathSync(process.cwd()), process.env.TESSEREACT_CONFIG || 'tessereact.config.json'))
} catch (e) {
  // User config not found
}

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001
const HOST = process.env.HOST || '0.0.0.0'

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePorts(HOST, DEFAULT_PORT)
  .then(({webpackPort, serverPort}) => {
    if (webpackPort == null || serverPort == null) {
      // We have not found a port.
      return
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const urls = prepareUrls(protocol, HOST, webpackPort)
    // Create a webpack compiler
    const compiler = createCompiler(webpack, config, isInteractive)
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic)

    // Serve webpack assets generated by the compiler over a web sever.
    const serverConfig = Object.assign(
      {},
      createDevServerConfig(
        proxyConfig,
        urls.lanUrlForConfig
      ),
      {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    const devServer = new WebpackDevServer(compiler, serverConfig)
    // Launch WebpackDevServer.
    devServer.listen(webpackPort, HOST, err => {
      if (err) {
        return console.log(err)
      }
      if (isInteractive) {
        clearConsole()
      }
      console.log(chalk.cyan('Starting Tessereact...\n'))

      const appName = require(paths.appPackageJson).name
      const tessereactServerUrls = prepareUrls(protocol, HOST, serverPort)

      // Configure webpack compiler with custom messages
      printInstructionsWhenReady(compiler, appName, tessereactServerUrls, isInteractive)

      const tessereactConfig = Object.assign({}, {
        port: serverPort,
        snapshotsPath: 'snapshots',
        entryURL: url.resolve(urls.localUrlForBrowser, 'static/js/tessereact.js'),
        staticURL: urls.localUrlForBrowser
      }, userConfig)

      tessereactServer(process.cwd(), tessereactConfig, () => {
        openBrowser(`http://localhost:${serverPort}`)
      })
    })

    const signals = ['SIGINT', 'SIGTERM']

    signals.forEach(function (sig) {
      process.on(sig, function () {
        devServer.close()
        process.exit()
      })
    })
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })
