import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseFile, transform } from "@swc/core";
import { minify } from "terser";
import { CONTEXT_PATH, ISITFAST_COMPILE_PATH, BENCHMARK_PREFIX, BENCHMARKS, SWC_OPTIONS, TEMPLATE_GENERATOR, TEMPLATE_BENCHMARK, ISITFAST_RESULTS_PATH, TEMPLATE_TMP } from "../constants.js";
import { module, variableDeclaration, variableDeclarator } from "../ast.js";

export const assert = (predicate, message) => {
  if(predicate) {
    throw new Error(message);
  }
};

// TODO: recursively find files
export const getFileList = () => readdir(
  CONTEXT_PATH,
  { withFileTypes: true }
);

export const writeCompiledContent = async (benchmarkPath, content) => {
  console.log("WRITE START - ", benchmarkPath);

  const { code } = await minify(content, {
    compress: false,
    ecma: 2020,
    module: true,
    toplevel: true
  });

  await writeFile(benchmarkPath, code);

  console.log("WRITE END - ", benchmarkPath);
};

export const getAstFromFile = (file) => {
  return parseFile(join(file.path, file.name));
};

export const isBenchmarkFile = (file) => {
  return (
    file.isFile() &&
    file.name[0] !== "_" &&
    // TODO: support typescript files
    file.name.split(".").at(-1) === "js"
  );
};

export const compileFiles = async (type, custom) => {
  console.log("COMPILE START - ", type);

  const files = await getFileList();
  const promises = [];

  for (const file of files) {
    if (isBenchmarkFile(file)) {
      const ast = await getAstFromFile(file);
      const benchmarkNodes = [];
      const otherNodes = [];

      for (const node of ast.body) {
        if (
          node.type === "ExportDeclaration" &&
          node.declaration.type === "VariableDeclaration" &&
          node.declaration.kind === "const" &&
          node.declaration.declarations[0].type === "VariableDeclarator" &&
          node.declaration.declarations[0].id.type === "Identifier" &&
          node.declaration.declarations[0].id.value.startsWith(BENCHMARK_PREFIX) &&
          node.declaration.declarations[0].init.type === "ObjectExpression"
        ) {
          benchmarkNodes.push(node);
        } else {
          otherNodes.push(node);
        }
      }

      for (const node of benchmarkNodes) {
        const variable = node.declaration.declarations[0].id.value;
        const definition = node.declaration.declarations[0].init;

        let generator_ast, benchmark_ast, default_ast;

        for (const prop of definition.properties) {
          assert(prop.key.type !== "Identifier", "Property key has to be an Identifier");

          const propertyKey = prop.key.value;

          if (propertyKey === "$generator") {
            assert(prop.value.type !== "FunctionExpression", "$generator should be a function");
            assert(prop.value.async, "$generator should not be async");
            assert(prop.value.generator, "$generator should not be a generator");

            generator_ast = prop.value;
          } else if (propertyKey === "$function") {
            assert(prop.value.type !== "FunctionExpression", "$function should be a function");
            assert(prop.value.async, "$function should not be async");
            assert(prop.value.generator, "$function should not be a generator");

            benchmark_ast = prop.value;
          } else if (propertyKey === "$default") {
            default_ast = prop.value;
          }
        }

        assert(!generator_ast, "No $generator provided");
        assert(!benchmark_ast, "No $function provided");
        assert(!default_ast, "No $default provided");

        const [
          body,
          defaultValue,
          benchmark,
          generator
        ] = await Promise.all([
          transform(module(
            otherNodes
          ), SWC_OPTIONS),
          transform(module([
            variableDeclaration([
              variableDeclarator(TEMPLATE_BENCHMARK, benchmark_ast)
            ])
          ]), SWC_OPTIONS),
          transform(module([
            variableDeclaration([
              variableDeclarator(TEMPLATE_TMP, default_ast)
            ], "let")
          ]), SWC_OPTIONS),
          transform(module([
            variableDeclaration([
              variableDeclarator(TEMPLATE_GENERATOR, generator_ast)
            ])
          ]), SWC_OPTIONS)
        ]);

        const compileName = `${file.name}-${variable}-${type}.mjs`;
        const compileDirectory = ISITFAST_COMPILE_PATH;

        const compile = {
          name: compileName,
          directory: compileDirectory,
          path: join(compileDirectory, compileName)
        };

        promises.push(writeCompiledContent(
          compile.path,
          (await custom({
            body,
            defaultValue,
            generator,
            benchmark
          }))
        ));

        const resultName = `${file.name}-${variable}-${type}.csv`;
        const resultDirectory = ISITFAST_RESULTS_PATH;

        const benchmarkName = `${file.name}-${variable}-${type}`;

        BENCHMARKS.set(benchmarkName, {
          type,
          name: benchmarkName,
          meta: {
            variable: variable,
            // TODO: add id, name, description
          },
          source: {
            name: file.name,
            directory: file.path,
            path: join(file.path, file.name)
          },
          compile,
          result: {
            created: false,
            run: 0,
            iteration: 0,
            name: resultName,
            directory: resultDirectory,
            path: join(resultDirectory, resultName)
          },
        });
      }
    }
  }

  await Promise.all(promises);

  console.log("COMPILE END - ", type);
};
