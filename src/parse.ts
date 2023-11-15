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
} from "@swc/core";
import { AST_START, SWC_OPTIONS } from "./constants.js";
import { writeFile } from "fs/promises";
import { ParsedFile } from "./parsePath.js";
import { Benchmark, Benchmarks } from "./types.js";
import { getCompiledPath } from "./getCompiledPath.js";

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

export const parse = async (file: ParsedFile) => {
  const module = await parseFile(file.path);
  const benchmarks: Benchmarks = [];

  if (module.type === "Module") {
    for (const ast of module.body) {
      if (
        ast.type === "ExportDeclaration" &&
        ast.declaration.type == "VariableDeclaration" &&
        ast.declaration.declarations?.[0].type === "VariableDeclarator"
      ) {
        const variable = ast.declaration.declarations[0];
        const benchmark: Benchmark = {
          async: false,
          name: "",
          variable: "",
          data: [],
        };

        if (variable.id.type === "Identifier") {
          benchmark.variable = variable.id.value;
        } else {
          throw Error("Variable ID type is not Identifier");
        }

        if (variable.init?.type === "ObjectExpression") {
          const props = { name: false, benchmark: false, data: false };

          for (const property of variable.init.properties) {
            if (
              property.type === "KeyValueProperty" &&
              property.key.type === "Identifier" &&
              property.key.value in props
            ) {
              const key = property.key.value;

              (props as any)[key] = true;

              switch (key) {
                case "name":
                  if (property.value.type === "StringLiteral") {
                    benchmark.name = property.value.value;
                  } else {
                    throw Error("Benchmark name type is not StringLiteral");
                  }
                  break;
                case "benchmark":
                  if (property.value.type === "ArrowFunctionExpression") {
                    benchmark.async = property.value.async;

                    if (property.value.body.type === "BlockStatement") {
                      const original = property.value.body.stmts;

                      property.value.body.stmts = [
                        measureStart(cpu),
                        ...original,
                        measureEnd(cpu),
                      ];

                      await writeFile(
                        getCompiledPath({
                          mode: "cpu",
                          file,
                          benchmark,
                        }),
                        (await transform(module, SWC_OPTIONS)).code,
                      );

                      property.value.body.stmts = [
                        measureStart(ram),
                        ...original,
                        measureEnd(ram),
                      ];

                      await writeFile(
                        getCompiledPath({
                          mode: "ram",
                          file,
                          benchmark,
                        }),
                        (await transform(module, SWC_OPTIONS)).code,
                      );

                      property.value.body.stmts = original;
                    }
                  } else {
                    throw Error(
                      "Benchmark benchmark type is not ArrowFunctionExpression",
                    );
                  }
                  break;
                case "data":
                  if (property.value.type === "ArrayExpression") {
                    for (const element of property.value.elements) {
                      if (element?.expression?.type === "ObjectExpression") {
                        const properties = element.expression.properties;

                        if (properties.length !== 2) {
                          throw Error("Benchmark data object length is not 2");
                        }

                        const props = { name: false, data: false };

                        for (const property of properties) {
                          if (
                            property.type === "KeyValueProperty" &&
                            property.key.type === "Identifier"
                          ) {
                            const key = property.key.value;

                            (props as any)[key] = true;

                            switch (key) {
                              case "name":
                                if (property.value.type === "StringLiteral") {
                                  // NOTE: data might be created dynamically
                                  // in the future we should load the file
                                  // and let the code execute and extract it
                                  // only after it's been executed
                                  benchmark.data.push(property.value.value);
                                } else {
                                  throw Error(
                                    "Benchmark data element name type is not StringLiteral",
                                  );
                                }
                                break;
                              case "data":
                                if (
                                  property.value.type !==
                                  "ArrowFunctionExpression"
                                ) {
                                  throw Error(
                                    "Benchmark data element data type is not ArrowFunctionExpression",
                                  );
                                }
                                break;
                            }
                          } else {
                            throw Error(
                              "Benchmark data element property type is not KeyValueProperty",
                            );
                          }
                        }

                        for (const key in props) {
                          if ((props as any)[key] === false) {
                            throw Error(
                              `Benchmark data is missing property ${key}`,
                            );
                          }
                        }
                      } else {
                        throw Error(
                          "Benchmark data element type is not ObjectExpression",
                        );
                      }
                    }
                  } else {
                    throw Error("Benchmark data type is not ArrayExpression");
                  }
                  break;
              }
            }
          }
        } else {
          throw Error("Variable init type is not ObjectExpression");
        }

        benchmarks.push(benchmark);
      }
    }
  }

  return benchmarks;
};
