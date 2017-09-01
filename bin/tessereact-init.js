#!/usr/bin/env node

const path = require('path')

const packageJSONPath = path.join(process.cwd(), './package.json')
const packageJSON = JSON.parse(readFileSync(packageJSONPath).toString())

if (
  !packageJSON.devDependencies
    || !packageJSON.devDependencies['react-scripts']
) {
  throw new Error('Non-create-react-app apps and ejected create-react-app apps are not supported yet.')
}

if (!packageJSON.devDependencies['tessereact-scripts']) {
  const tessereactScriptsPackageJSONPath = path.join(__dirname, '../package.json')
  const version = JSON.parse(readFileSync(packageJSONPath).toString()).version
  packageJSON.devDependencies['tessereact-scripts'] = version
}

if (!packageJSON.scripts) {
  packageJSON.scripts = {}
}

packageJSON.scripts['tessereact'] = 'tessereact-start'

fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, '  ') + '\n')
console.log('Please run `npm install` or `yarn` to ensure that all packages are installed and up to date.')
