import {Identifier, Expression, Span, Argument, MemberExpression, CallExpression, BinaryOperator, BinaryExpression, VariableDeclarationKind, VariableDeclarator, VariableDeclaration, ReturnStatement, Module} from "@swc/core";
import {Mode} from "@types";

const span = { start: 0, end: 0, ctxt: 0 };

const identifier = (value: string, optional = false): Identifier => ({
  type: "Identifier",
  span,
  value,
  optional
});

const argument = (expression: Expression, spread?: Span): Argument => ({
  spread,
  expression
});

const memberExpression = (object: Expression, property: Identifier): MemberExpression => ({
  type: "MemberExpression",
  span,
  object,
  property
});

const callExpression = (callee: MemberExpression | Identifier, args: Argument[] = []): CallExpression => ({
  type: "CallExpression",
  span,
  callee,
  arguments: args
});

const binaryExpression = (operator: BinaryOperator, left: Expression | Identifier, right: Expression | Identifier): BinaryExpression => ({
  type: "BinaryExpression",
  span,
  left,
  right,
  operator
});

const variableDeclaration = (kind: VariableDeclarationKind, declarations: VariableDeclarator[], declare = false): VariableDeclaration => ({
  type: "VariableDeclaration",
  span,
  kind,
  declare,
  declarations
});

const variableDeclarator = (id: Identifier, init?: Expression,  definite = false): VariableDeclarator => ({
  type: "VariableDeclarator",
  span,
  id,
  init,
  definite
});

const returnStatement = (argument?: Expression): ReturnStatement => ({
  type: "ReturnStatement",
  span,
  argument
});

const cpu = callExpression(
  memberExpression(
    memberExpression(
      identifier("process"),
      identifier("hrtime")
    ),
    identifier("bigint")
  )
);


const ram = memberExpression(
  callExpression(
    memberExpression(
      identifier("process"),
      identifier("memoryUsage")
    ),
  ),
  identifier("heapUsed")
);

const measureStart = (expression: Expression) => variableDeclaration("const", [
  variableDeclarator(
    identifier("start"),
    expression
  )
]);

const measureEnd = (expression: Expression) => returnStatement(
  callExpression(
    identifier("Number"),
    [
      argument(
        binaryExpression(
          "-",
          expression,
          identifier("start")
        )
      )
    ]
  )
);

export const inlineMeasurementCode = (ast: Module, name: string, mode: Mode) => {
  const measure = mode === "cpu" ? cpu: ram;

  for (const ModuleItem of ast.body) {
    if(ModuleItem.type === "ExportDeclaration" && ModuleItem.declaration.type === "VariableDeclaration") {
      for (const VariableDeclarator of ModuleItem.declaration.declarations) {
        if(VariableDeclarator.id.type === "Identifier" && VariableDeclarator.id.value === name) {
          if(VariableDeclarator.init?.type === "ArrowFunctionExpression" && VariableDeclarator.init.body.type === "BlockStatement") {
            VariableDeclarator.init.body.stmts = [
              measureStart(measure),
              ...VariableDeclarator.init.body.stmts,
              measureEnd(measure)
            ];
          }
        }
      }
    }
  }
};
