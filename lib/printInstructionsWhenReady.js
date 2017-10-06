const clearConsole = require('react-dev-utils/clearConsole')
const chalk = require('chalk')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

module.exports = function printInstructionsWhenReady (compiler, appName, urls, isInteractive) {
  let isFirstCompile = true

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', stats => {
    if (isInteractive) {
      clearConsole()
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true))
    const isSuccessful = !messages.errors.length && !messages.warnings.length
    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'))
    }
    if (isSuccessful && (isInteractive || isFirstCompile)) {
      printInstructions(appName, urls)
    }
    isFirstCompile = false

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }
      console.log(chalk.red('Failed to compile.\n'))
      console.log(messages.errors.join('\n\n'))
      return
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'))
      console.log(messages.warnings.join('\n\n'))

      // Teach some ESLint tricks.
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      )
      console.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n'
      )
    }
  })
}

function printInstructions (appName, urls) {
  console.log()
  console.log(`You can now view the Tessereact UI of ${chalk.bold(appName)} in the browser.`)
  console.log()

  if (urls.lanUrlForTerminal) {
    console.log(
      `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
    )
    console.log(
      `  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`
    )
  } else {
    console.log(`  ${urls.localUrlForTerminal}`)
  }
  console.log()
}
