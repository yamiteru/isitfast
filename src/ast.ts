import { AST_START, COMPILE_DIR, SWC_OPTIONS } from "./constants.js";
import {
  Identifier,
  Expression,
  Span,
  Argument,
  MemberExpression,
  CallExpression,
  BinaryOperator,
  BinaryExpression,
  VariableDeclarationKind,
  VariableDeclarator,
  VariableDeclaration,
  ReturnStatement,
  parseFile,
  transform,
  ArrayExpression,
  StringLiteral,
  ArrowFunctionExpression,
} from "@swc/core";
import { Benchmark } from "./types.js";
import { writeFile } from "fs/promises";

const span = { start: 0, end: 0, ctxt: 0 };

const identifier = (value: string, optional = false): Identifier => ({
  type: "Identifier",
  span,
  value,
  optional,
});

const argument = (expression: Expression, spread?: Span): Argument => ({
  spread,
  expression,
});

const memberExpression = (
  object: Expression,
  property: Identifier,
): MemberExpression => ({
  type: "MemberExpression",
  span,
  object,
  property,
});

const callExpression = (
  callee: MemberExpression | Identifier,
  args: Argument[] = [],
): CallExpression => ({
  type: "CallExpression",
  span,
  callee,
  arguments: args,
});

const binaryExpression = (
  operator: BinaryOperator,
  left: Expression | Identifier,
  right: Expression | Identifier,
): BinaryExpression => ({
  type: "BinaryExpression",
  span,
  left,
  right,
  operator,
});

const variableDeclaration = (
  kind: VariableDeclarationKind,
  declarations: VariableDeclarator[],
  declare = false,
): VariableDeclaration => ({
  type: "VariableDeclaration",
  span,
  kind,
  declare,
  declarations,
});

const variableDeclarator = (
  id: Identifier,
  init?: Expression,
  definite = false,
): VariableDeclarator => ({
  type: "VariableDeclarator",
  span,
  id,
  init,
  definite,
});

const returnStatement = (argument?: Expression): ReturnStatement => ({
  type: "ReturnStatement",
  span,
  argument,
});

const cpu = callExpression(
  memberExpression(
    memberExpression(identifier("process"), identifier("hrtime")),
    identifier("bigint"),
  ),
);

const ram = memberExpression(
  callExpression(
    memberExpression(identifier("process"), identifier("memoryUsage")),
  ),
  identifier("heapUsed"),
);

const measureStart = (expression: Expression) =>
  variableDeclaration("const", [
    variableDeclarator(identifier(AST_START), expression),
  ]);

const measureEnd = (expression: Expression) =>
  returnStatement(
    callExpression(identifier("Number"), [
      argument(binaryExpression("-", expression, identifier(AST_START))),
    ]),
  );

export const BENCHMARK_PROPERTY_NAMES = ["name", "data", "benchmark"] as const;

export const BENCHMARK_PROPERTIES = {
  name: "StringLiteral",
  data: "ArrayExpression",
  benchmark: "ArrowFunctionExpression",
};

export type BenchmarkPropertyName = (typeof BENCHMARK_PROPERTY_NAMES)[number];

export const collectBenchmarksFromFile = async (
  path: string,
): Promise<Benchmark[]> => {
  const input = path.replaceAll("/", "-");
  const ast = await parseFile(path);
  const benchmarks: Benchmark[] = [];

  for (const ModuleItem of ast.body) {
    if (
      ModuleItem.type === "ExportDeclaration" &&
      ModuleItem.declaration.type === "VariableDeclaration" &&
      ModuleItem.declaration.declarations[0].type === "VariableDeclarator" &&
      ModuleItem.declaration.declarations[0].id.type === "Identifier" &&
      ModuleItem.declaration.declarations[0].id.value[0] === "$" &&
      ModuleItem.declaration.declarations[0].init?.type === "ObjectExpression"
    ) {
      const variable = ModuleItem.declaration.declarations[0].id.value;
      const id =
        `${input}-${ModuleItem.declaration.declarations[0].id.value}`.toLowerCase();
      const properties = ModuleItem.declaration.declarations[0].init.properties;

      if (properties.length !== 3) {
        throw Error("Benchmark must have 3 properties");
      }

      const props: {
        name: StringLiteral;
        data: ArrayExpression;
        benchmark: ArrowFunctionExpression;
      } = {
        name: null,
        data: null,
        benchmark: null,
      } as never;

      for (const prop of properties) {
        if (prop.type !== "KeyValueProperty") {
          throw Error("Benchmark properties must be KeyValueProperty");
        }

        if (prop.key.type !== "Identifier") {
          throw Error("Benchmark property keys must be Identifier");
        }

        const valueType =
          BENCHMARK_PROPERTIES[prop.key.value as BenchmarkPropertyName];

        if (!valueType) {
          throw Error(`Benchmark property name ${prop.key.value} is not valid`);
        }

        if (prop.value.type !== valueType) {
          throw Error(
            `Benchmark property ${prop.key.value} should be ${valueType} but instead it is ${prop.value.type}`,
          );
        }

        (props as any)[prop.key.value] = prop.value;
      }

      if (props.benchmark.body.type !== "BlockStatement") {
        throw Error("Benchmark body should be BlockStatement");
      }

      const fileCpu = `${COMPILE_DIR}/${id}_cpu.mjs`;
      const fileRam = `${COMPILE_DIR}/${id}_ram.mjs`;
      const original = props.benchmark.body.stmts;

      props.benchmark.body.stmts = [
        measureStart(cpu),
        ...original,
        measureEnd(cpu),
      ];

      const cpuOutput = await transform(ast, SWC_OPTIONS);

      props.benchmark.body.stmts = original;

      props.benchmark.body.stmts = [
        measureStart(ram),
        ...original,
        measureEnd(ram),
      ];

      const ramOutput = await transform(ast, SWC_OPTIONS);

      props.benchmark.body.stmts = original;

      await Promise.all([
        writeFile(fileCpu, cpuOutput.code),
        writeFile(fileRam, ramOutput.code),
      ]);

      benchmarks.push({
        id,
        variable,
        count: props.data.elements.length,
        name: props.name.value,
        async: props.benchmark.async,
        path: {
          source: path,
          cpu: fileCpu,
          ram: fileRam,
        },
      });
    }
  }

  return benchmarks;
};
