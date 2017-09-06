# The easiest way to integrate a react app with Tessereact:

First, scaffold an app with create-react-app:

```sh
create-react-app react-app
cd react-app
```

Second, install Tessereact packages:

```sh
yarn add -D https://github.com/tessereact/tessereact.git
yarn add -D https://github.com/tessereact/tessereact-scripts.git

# or

npm install --save-dev tessereact/tessereact tessereact/tessereact-scripts
```

Third, add `tessereact` script to your package.json:

```js
{
  // ...
  "scripts": {
    // ...
    "tessereact": "tessereact-start"
  }
}
```

Finally, run tessereact:

```sh
yarn tessereact

# or

npm run tessereact
```
