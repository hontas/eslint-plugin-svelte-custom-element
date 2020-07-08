'use strict';

const { RuleTester } = require('eslint');

const rule = require('../../rules/no-svelte-dispatch');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-svelte-dispatch', rule, {
  valid: [
    {
      code: 'element.dispatchEvent(new CustomEvent({}))',
    },
  ],

  invalid: [
    {
      code: 'import { createEventDispatcher } from "svelte";',
      errors: [
        {
          message:
            'Dispatching events with svelte `createEventDispatcher` DOES NOT WORK for custom elements. Use `event.dispatch` from `src/utils/event` instead.',
        },
      ],
    },
    {
      code: 'import { createEventDispatcher as boi } from "svelte";',
      errors: [
        {
          message:
            'Dispatching events with svelte `createEventDispatcher` DOES NOT WORK for custom elements. Use `event.dispatch` from `src/utils/event` instead.',
        },
      ],
    },
  ],
});
