const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')

module.exports = function choosePorts (host, defaultPort) {
  let webpackPort
  return choosePort(host, defaultPort)
    .then(port => {
      webpackPort = port
      return choosePort(host, port + 1)
    })
    .then(serverPort => {
      return {
        webpackPort,
        serverPort
      }
    })
}
