import {Identifier, Expression, Span, Argument, MemberExpression, CallExpression, BinaryOperator, BinaryExpression, VariableDeclarationKind, VariableDeclarator, VariableDeclaration, ReturnStatement, parseFile, transform, Module, ModuleItem, Statement, FunctionDeclaration, ImportDeclaration, ExportDeclaration, ExportNamedDeclaration, ExportDefaultDeclaration, ExportAllDeclaration, TsImportEqualsDeclaration, TsExportAssignment, TsNamespaceDeclaration, BlockStatement, EmptyStatement, DebuggerStatement, WithStatement, LabeledStatement, BreakStatement, ContinueStatement, IfStatement, SwitchStatement, ThrowStatement, TryStatement, WhileStatement, Declaration, ExpressionStatement, DoWhileStatement, ForStatement, ForInStatement, ForOfStatement, ExportDefaultExpression} from "@swc/core";
import {writeFile} from "fs/promises";
import {AST_START, COMPILE_DIR, SWC_OPTIONS} from "./constants.js";
import {Benchmark} from "./types.js";

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
    identifier(AST_START),
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
          identifier(AST_START)
        )
      )
    ]
  )
);

type Modules = {
  VariableDeclaration: VariableDeclaration;
  ReturnStatement: ReturnStatement;
  ImportDeclaration: ImportDeclaration;
  ExportDeclaration: ExportDeclaration;
  ExportNamedDeclaration: ExportNamedDeclaration;
  ExportDefaultDeclaration: ExportDefaultDeclaration;
  ExportDefaultExpression: ExportDefaultExpression;
  ExportAllDeclaration: ExportAllDeclaration;
  TsImportEqualsDeclaration: TsImportEqualsDeclaration;
  TsExportAssignment: TsExportAssignment;
  TsNamespaceExportDeclaration: TsNamespaceDeclaration;
  BlockStatement: BlockStatement;
  EmptyStatement: EmptyStatement;
  DebuggerStatement: DebuggerStatement;
  WithStatement: WithStatement;
  LabeledStatement: LabeledStatement;
  BreakStatement: BreakStatement;
  ContinueStatement: ContinueStatement;
  IfStatement: IfStatement;
  SwitchStatement: SwitchStatement;
  ThrowStatement: ThrowStatement;
  TryStatement: TryStatement;
  WhileStatement: WhileStatement;
  DoWholeStatement: DoWhileStatement;
  ForStatement: ForStatement;
  ForInStatement: ForInStatement;
  ForOfStatement: ForOfStatement;
  Declaration: Declaration;
  ExpressionStatement: ExpressionStatement;
};

const getReferences = (modules: ModuleItem[]) => {
  const functionReferences: Map<string, ModuleItem> = new Map();
  const variableReferences: Map<string, ModuleItem> = new Map();

  for(const module of modules) {
    switch (module.type) {
      case "ImportDeclaration": {}
      case "FunctionDeclaration": {}
      case "VariableDeclaration": {}
      case "ExportDeclaration": {}
      case "ExportNamedDeclaration": {}
    }
  }


  // for(const module of modules) {
  //   switch (module.type) {
  //     case "ImportDeclaration": {
  //       importReferences.push(module);
  //
  //       break;
  //     }
  //     case "VariableDeclaration": {
  //       for(const declaration of module.declarations) {
  //         switch (declaration.id.type) {
  //           case "Identifier": {
  //             const name = declaration.id.value;
  //
  //             (name[0] === "$" ? benchmarkReferences: otherReferences).set(
  //               name,
  //               variableDeclaration(module.kind, [declaration])
  //             );
  //
  //             break;
  //           }
  //         }
  //       }
  //
  //       break;
  //     }
  //     case "FunctionDeclaration": {
  //       const name = (module as FunctionDeclaration).identifier.value;
  //
  //       (name[0] === "$" ? benchmarkReferences: otherReferences).set(name, module);
  //
  //       break;
  //     }
  //   }
  // }
  //
  // return {
  //   importReferences,
  //   benchmarkReferences,
  //   otherReferences
  // };
};

export const getBenchmarksFromFile = async (path: string): Promise<Benchmark[]> => {
  const ast = await parseFile(path);
  const modules = ast.body;
  const benchmarks: Benchmark[] = [];
  const references = getReferences(modules);

  console.log(references);

  return benchmarks;
};
