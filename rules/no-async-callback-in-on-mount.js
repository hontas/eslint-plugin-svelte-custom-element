/**
 * @fileoverview Warn for async onMount callbacks when they return an onDestroy callback
 * @author hontas
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const t = require('@babel/types');

module.exports = {
  meta: {
    type: 'problem',
    fixable: null,
    schema: []
  },

  create: function(context) {
    return {
      CallExpression(node) {
        if (!t.isIdentifier(node.callee)) return;
        if (node.callee.name !== 'onMount') return;

        const onMount = node.arguments[0];
        if (!t.isFunction(onMount) && !t.isIdentifier(onMount)) {
          context.report({
            node,
            message:
              'First argument to onMount must be a function. See: https://svelte.dev/tutorial/onmount'
          });
        }
        if (onMount.async === false) return;

        if (t.isBlockStatement(onMount.body)) {
          const hasReturn = onMount.body.body.some(t.isReturnStatement);
          if (!hasReturn) return;

          context.report({
            node,
            message: 'onMount callback can not be async if it returns an onDestroy function.'
          });
        }

        if (t.isFunction(onMount.body)) {
          context.report({
            node,
            message: 'onMount callback can not be async if it returns an onDestroy function.'
          });
        }
      }
    };
  }
};
