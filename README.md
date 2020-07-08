# eslint-plugin-svelte-custom-element

Eslint plugin with rules for using svelte with custom elements as compile target

```shell
npm install --save-dev eslint-plugin-svelte-custom-element
```

## Use it

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:svelte-custom-element/develop']
};
```

## Develop

```shell
npm run tdd
```

### Publish

```shell
# make sure working directory is empty
npm run release
```
