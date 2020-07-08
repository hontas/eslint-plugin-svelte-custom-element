/**
 * @fileoverview Warn for using onDestroy (which does not work)
 * @author hontas
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    fixable: null,
    schema: [],
  },

  create: function (context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'svelte') return;
        if (!node.specifiers || node.specifiers.length === 0) return;

        node.specifiers.forEach((spec) => {
          if (!spec.imported) return;
          if (spec.imported.name === 'onDestroy') {
            context.report({
              node,
              message:
                'Using `onDestroy` DOES NOT WORK for custom elements. Use `onMount(() => () => { /* on_disconnect */ })` instead.',
            });
          }
        });
      },
    };
  },
};
