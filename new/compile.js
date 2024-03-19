import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { parseFile } from "@swc/core";

export const HERE = process.cwd();

export const benchmarks = new Map();
export const remaining = [];

export const assert = (predicate, message) => {
  if(predicate) {
    throw new Error(message);
  }
};

(async () => {
  const files = await readdir(join(HERE, "benchmarks"), { withFileTypes: true, recursive: true });

  for(const file of files) {
    if(file.isFile() && file.name[0] !== "_") {
      const filePath = join(file.path, file.name);
      const ast = await parseFile(filePath);

      const benchmarkNodes = [];
      const newAstBody = [];

      for (const node of ast.body) {
        if(
          node.type === "ExportDeclaration" &&
          node.declaration.type === "VariableDeclaration" &&
          node.declaration.kind === "const" &&
          node.declaration.declarations[0].type === "VariableDeclarator" &&
          node.declaration.declarations[0].id.type === "Identifier" &&
          node.declaration.declarations[0].id.value[0] === "$" &&
          node.declaration.declarations[0].init.type === "ObjectExpression"
        ) {
          benchmarkNodes.push(node);
        } else {
          newAstBody.push(node);
        }
      }

      ast.body = newAstBody;

      for (const node of benchmarkNodes) {
        const benchmarkName = node.declaration.declarations[0].id.value;
        const benchmarkKey = `${filePath}-${benchmarkName}`;
        const benchmarkObject = node.declaration.declarations[0].init;

        const $sample_ast = [];
        const $sample_values = [];

        let $generator_ast, $function_ast;

        for (const prop of benchmarkObject.properties) {
          assert(prop.key.type !== "Identifier", "Property key has to be an Identifier");

          const propertyKey = prop.key.value;

          if(propertyKey === "$samples") {
            assert(prop.value.type !== "ArrayExpression", "$samples should be an array");

            for (let sampleNode of prop.value.elements) {
              if(sampleNode.expression.type === "NumericLiteral" || sampleNode.expression.type === "StringLiteral") {
                $sample_ast.push(sampleNode);
                $sample_values.push(sampleNode.expression.value);
              } else {
                console.warn(`${propertyKey}: Sample [${sampleNode.expression.type}] is not valid`);
              }
            }
          } else if(propertyKey === "$generator") {
            assert(prop.value.type !== "FunctionExpression", "$generator should be a function");
            assert(prop.value.async, "$generator should not be async");
            assert(prop.value.generator, "$generator should not be a generator");

            $generator_ast = prop.value;
          } else if(propertyKey === "$function") {
            assert(prop.value.type !== "FunctionExpression", "$function should be a function");
            assert(prop.value.async, "$function should not be async");
            assert(prop.value.generator, "$function should not be a generator");

            $function_ast = prop.value;
          }
        }

        assert($sample_ast.length === 0, "No valid $samples provided");
        assert(!$generator_ast, "No $generator provided");
        assert(!$function_ast, "No $function provided");

        // TODO: insert benchmark boilerplate into ast.body
        // TODO: save transformed ast into a file

        remaining.push(benchmarkKey);
        benchmarks.set(benchmarkKey, {
          samples: $sample_values
        });
      }
    }
  }

  console.log(remaining);
  console.log(benchmarks);
})();
