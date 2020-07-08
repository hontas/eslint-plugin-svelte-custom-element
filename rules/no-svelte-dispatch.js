/**
 * @fileoverview Warn for extraneous imports
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
    schema: []
  },

  create: function(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'svelte') return;
        if (!node.specifiers || node.specifiers.length === 0) return;

        node.specifiers.forEach((spec) => {
          if (!spec.imported) return;
          if (spec.imported.name === 'createEventDispatcher') {
            context.report({
              node,
              message:
                'Dispatching events with svelte `createEventDispatcher` DOES NOT WORK for custom elements. Use `event.dispatch` from `src/utils/event` instead.'
            });
          }
        });
      }
    };
  }
};
