module.exports = {
  rules: {
    'no-uppercase-in-export': require('./rules/no-uppercase-in-export'),
    'problematic-boolean': require('./rules/problematic-boolean'),
    'no-svelte-dispatch': require('./rules/no-svelte-dispatch'),
    'no-svelte-on-destroy': require('./rules/no-svelte-on-destroy'),
    'no-async-callback-in-on-mount': require('./rules/no-async-callback-in-on-mount'),
  },
  configs: {
    recommended: require('./configs/recommended')
  },
};
