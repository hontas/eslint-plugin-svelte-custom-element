'use strict';

const { RuleTester } = require('eslint');

const rule = require('../../rules/no-async-callback-in-on-mount');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
});

ruleTester.run('no-async-callback-in-on-mount', rule, {
  valid: [
    {
      code: 'function handleOnMount() {}; onMount(handleOnMount);'
    },
    {
      code: 'onMount(async function onMount() {});'
    },
    {
      code: 'onMount(function onMount() { return () => {}; });'
    },
    {
      code: 'onMount(async () => {});'
    },
    {
      code: 'onMount(() => { return () => {}; });'
    },
    {
      code: 'onMount(() => () => {});'
    },
    {
      code: 'onMount(() => { return function onDestroy() {}; });'
    }
  ],

  invalid: [
    {
      code: 'onMount(async () => () => {})',
      errors: [
        {
          message: 'onMount callback can not be async if it returns an onDestroy function.'
        }
      ]
    },
    {
      code: 'onMount(async function onMount() { return function onDestroy() {}; })',
      errors: [
        {
          message: 'onMount callback can not be async if it returns an onDestroy function.'
        }
      ]
    }
  ]
});
