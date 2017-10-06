const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')

module.exports = function choosePorts (host, defaultPort) {
  let webpackPort
  let serverPort
  return choosePort(host, defaultPort)
    .then(port => {
      webpackPort = port
      return choosePort(host, port + 1)
    })
    .then(port => {
      serverPort = port
      return choosePort(host, port + 1)
    })
    .then(chromedriverPort => {
      return {
        webpackPort,
        serverPort,
        chromedriverPort
      }
    })
}
