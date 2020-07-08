module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['svelte3', 'svelte-custom-element'],
  settings: {
    'svelte3/compiler-options': { customElement: true },
    'svelte3/ignore-styles': ({ lang }) => lang,
  },
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'svelte-custom-element/no-uppercase-in-export': 'error',
        'svelte-custom-element/problematic-boolean': 'error',
        'svelte-custom-element/no-svelte-dispatch': 'error',
        'svelte-custom-element/no-svelte-on-destroy': 'error',
        'svelte-custom-element/no-async-callback-in-on-mount': 'error',
      },
    }
  ],
};
