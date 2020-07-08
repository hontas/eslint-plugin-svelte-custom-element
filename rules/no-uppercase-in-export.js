module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow capital letters in exported props',
      category: 'Possible Errors',
      recommended: true,
      url: ''
    },
    schema: [] // no options
  },
  create(context) {
    const allLowerCase = /^[a-z]+$/;
    return {
      ExportNamedDeclaration(node) {
        if (node.declaration == null) return;

        const { type, kind, declarations } = node.declaration;

        if (type === 'VariableDeclaration' && kind === 'let') {
          declarations.forEach((declaration) => {
            if (allLowerCase.test(declaration.id.name)) return;
            context.report(
              node,
              `Exported property '${declaration.id.name}' cannot contain capital letters (wont work in the DOM)`
            );
          });
        }
      }
    };
  }
};
