const doctrine = require('doctrine');

const isVariableDeclaration = ({ type }) => type === 'VariableDeclarator';
const hasDefaultValue = ({ init }) => init && typeof init.value !== 'undefined';

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'warn on problematic-boolean props',
      category: 'Possible Errors',
      recommended: true,
      url: ''
    },
    schema: [] // no options
  },
  create(context) {
    const problematicNode = {};
    const sourceCode = context.getSourceCode();
    let currLevel;

    const getJSDocComment = (node) => {
      const comments = sourceCode.getCommentsBefore(node);
      const lastComment = comments[comments.length - 1];
      if (!lastComment || lastComment.type !== 'Block') return null;

      return doctrine.parse(`/*${lastComment.value}*/`, { unwrap: true });
    };

    /**
     * Get types from JSDoc comment
     * @param {ast} node
     * @returns {array}
     */
    const getTypeFromJSDocComment = (node) => {
      const jsDoc = getJSDocComment(node);
      if (!jsDoc) return [];

      const typeTag = jsDoc.tags.find(({ title }) => title === 'type');
      if (!typeTag || !typeTag.type) return null;

      if (typeTag.type.type === 'NameExpression') return [typeTag.type.name];
      if (typeTag.type.type === 'UnionType') return typeTag.type.elements.map(({ name }) => name);
      if (typeTag.type.type === 'TypeApplication') return [typeTag.type.expression.name];

      console.warn('Unhandled type', typeTag, context.getFilename());

      return [];
    };

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration == null) return;

        const { type, kind, declarations } = node.declaration;

        if (type === 'VariableDeclaration' && kind === 'let') {
          declarations.forEach((declaration) => {
            if (!isVariableDeclaration(declaration)) return;

            if (hasDefaultValue(declaration)) {
              if (typeof declaration.init.value === 'boolean') {
                if (declaration.init.value) {
                  context.report({
                    node,
                    message:
                      "Don't use true as default value because it can never be set to false. Invert it instead."
                  });
                } else {
                  problematicNode[currLevel][declaration.id.name] = node;
                }
              }
            } else {
              const types = getTypeFromJSDocComment(node);
              if (types && types.length && types.includes('boolean')) {
                problematicNode[currLevel][declaration.id.name] = node;
              }
            }
          });
        }
      },
      LabeledStatement(node) {
        if (node.body.type === 'BlockStatement') {
          node.body.body.forEach((childNode) => {
            if (childNode.type !== 'ExpressionStatement') return;
            if (childNode.expression.type !== 'AssignmentExpression') return;

            const { left, right } = childNode.expression;

            if (left.type !== 'Identifier') return;
            if (right.type !== 'CallExpression') return;
            if (right.callee.name !== 'getBooleanAttributeValue') return;
            if (left.name !== right.arguments[0].name) return;

            const identifier = left.name;

            delete problematicNode[currLevel][identifier];
          });
        }
      },
      onCodePathStart(codePath) {
        currLevel = codePath.id;
        problematicNode[codePath.id] = {};
      },
      onCodePathEnd(codePath) {
        if (codePath.upper) currLevel = codePath.upper.id;
        Object.entries(problematicNode[codePath.id]).forEach(([name, node]) => {
          context.report(
            node,
            `Exported boolean property '${name}' must convert '' (empty string) to true, cause '' === true in the DOM. $: { if (isBoolAttr(${name}) ${name} = true; ) }`
          );
        });

        if (problematicNode[codePath.id]) {
          delete problematicNode[codePath.id];
        }
      }
    };
  }
};
