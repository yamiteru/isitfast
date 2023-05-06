import cuid from "cuid";
import {AST_START, COMPILE_DIR, SWC_OPTIONS} from "@constants";
import {Identifier, Expression, Span, Argument, MemberExpression, CallExpression, BinaryOperator, BinaryExpression, VariableDeclarationKind, VariableDeclarator, VariableDeclaration, ReturnStatement, parseFile, transform} from "@swc/core";
import {Benchmark} from "@types";
import {writeFile} from "fs/promises";

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

// TODO: support default exports
// TODO: get rid of duplicate code
export const collectBenchmarksFromFile = async (path: string): Promise<Benchmark[]> => {
  const ast = await parseFile(path);
  const benchmarks: Benchmark[] = [];

  for (const ModuleItem of ast.body) {
    if(ModuleItem.type === "ExportDeclaration") {
      // export const xyz = () => {};
      if(ModuleItem.declaration.type === "VariableDeclaration") {
        const VariableDeclarator = ModuleItem.declaration.declarations[0];

        if(VariableDeclarator.id.type === "Identifier" && VariableDeclarator.init?.type === "ArrowFunctionExpression" && (VariableDeclarator.id.value === "$$benchmark" || VariableDeclarator.id.value[0] === "$")) {
          if(VariableDeclarator.init.body.type === "BlockStatement") {
            const id = path.split("/").join("-").replace(".", "-").toLowerCase();
            const name = VariableDeclarator.id.value;
            const fileCpu = `${COMPILE_DIR}/${id}_${name}_cpu.mjs`;
            const fileRam = `${COMPILE_DIR}/${id}_${name}_ram.mjs`;
            const original = VariableDeclarator.init.body.stmts;

            VariableDeclarator.init.body.stmts = [
              measureStart(cpu),
              ...original,
              measureEnd(cpu)
            ];

            const cpuOutput = await transform(ast, SWC_OPTIONS);

            VariableDeclarator.init.body.stmts = original;

            VariableDeclarator.init.body.stmts = [
              measureStart(ram),
              ...original,
              measureEnd(ram)
            ];

            const ramOutput = await transform(ast, SWC_OPTIONS);

            VariableDeclarator.init.body.stmts = original;

            await Promise.all([
              writeFile(fileCpu, cpuOutput.code),
              writeFile(fileRam, ramOutput.code),
            ]);

            benchmarks.push({
              id,
              name,
              path: name,
              async: VariableDeclarator.init.async,
              fileCpu,
              fileRam,
            });
          }
        }
      }

      // export function xyz() {}
      else if(ModuleItem.declaration.type === "FunctionDeclaration") {
        if(ModuleItem.declaration.body) {
          const id = path.split("/").join("-").replace(".", "-").toLowerCase();
          const name = ModuleItem.declaration.identifier.value;
          const fileCpu = `${COMPILE_DIR}/${id}_${name}_cpu.mjs`;
          const fileRam = `${COMPILE_DIR}/${id}_${name}_ram.mjs`;
          const original = ModuleItem.declaration.body.stmts;

          ModuleItem.declaration.body.stmts = [
            measureStart(cpu),
            ...original,
            measureEnd(cpu)
          ];

          const cpuOutput = await transform(ast, SWC_OPTIONS);

          ModuleItem.declaration.body.stmts = original;

          ModuleItem.declaration.body.stmts = [
            measureStart(ram),
            ...original,
            measureEnd(ram)
          ];

          const ramOutput = await transform(ast, SWC_OPTIONS);

          ModuleItem.declaration.body.stmts = original;

          await Promise.all([
            writeFile(fileCpu, cpuOutput.code),
            writeFile(fileRam, ramOutput.code),
          ]);

          benchmarks.push({
            id,
            name,
            path: name,
            async: ModuleItem.declaration.async,
            fileCpu,
            fileRam,
          });
        }
      }
    }
  }

  return benchmarks;
};
