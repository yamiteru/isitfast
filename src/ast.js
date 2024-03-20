export const span = { start: 0, end: 0, ctxt: 0 };

export const variableDeclarator = (name, ast) => {
  return {
    type: 'VariableDeclarator',
    span,
    id: {
      type: 'Identifier',
      span,
      value: name,
      optional: false,
      typeAnnotation: null
    },
    init: ast,
    definite: false
  };
};

export const variableDeclaration = (declarations) => {
  return {
    type: 'VariableDeclaration',
    span,
    kind: 'const',
    declare: false,
    declarations
  };
};

export const module = (body) => {
  return {
    type: 'Module',
    span: { ...span, start: 1 },
    body,
    interpreter: null
  };
};
