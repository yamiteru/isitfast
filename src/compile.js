import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseFile, transform } from "@swc/core";
import { minify } from "terser";
import { compile_template } from "./ast.js";

export const HERE = process.cwd();
export const SWC_OPTIONS = {
  jsc: {
    parser: {
      syntax: "typescript",
    },
    target: "esnext",
  },
  // minify: {
  //   compress: {
  //     defaults: false
  //   },
  //   mangle: false
  // }
};

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
      const otherNodes = [];

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
          otherNodes.push(node);
        }
      }

      ast.body = otherNodes;

      for (const node of benchmarkNodes) {
        const benchmarkName = node.declaration.declarations[0].id.value;
        const benchmarkKey = `${join(HERE, "compile", file.name)}-${benchmarkName}.js`;
        const benchmarkObject = node.declaration.declarations[0].init;

        let $generator_ast, $benchmark_ast;

        for (const prop of benchmarkObject.properties) {
          assert(prop.key.type !== "Identifier", "Property key has to be an Identifier");

          const propertyKey = prop.key.value;

          if(propertyKey === "$generator") {
            assert(prop.value.type !== "FunctionExpression", "$generator should be a function");
            assert(prop.value.async, "$generator should not be async");
            assert(prop.value.generator, "$generator should not be a generator");

            $generator_ast = prop.value;
          } else if(propertyKey === "$function") {
            assert(prop.value.type !== "FunctionExpression", "$function should be a function");
            assert(prop.value.async, "$function should not be async");
            assert(prop.value.generator, "$function should not be a generator");

            $benchmark_ast = prop.value;
          }
        }

        assert(!$generator_ast, "No $generator provided");
        assert(!$benchmark_ast, "No $function provided");

        const raw_content = await transform(
          compile_template(ast.body, $benchmark_ast, $generator_ast),
          SWC_OPTIONS
        );

        const minified_content = await minify(raw_content.code, { toplevel: true });

        await writeFile(benchmarkKey, minified_content.code);

        remaining.push(benchmarkKey);
      }
    }
  }

  console.log(remaining);
})();
