import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseFile } from "@swc/core";
import { minify } from "terser";
import { CONTEXT_PATH, ISITFAST_COMPILE_PATH, BENCHMARK_PREFIX, COMPILED_FILES } from "../constants.js";

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

  const { code } = await minify(content, { toplevel: true });
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

// TODO: take into account file.path
export const getCompiledBenchmarkPath = (type, file, benchmarkName) => {
  return `${join(ISITFAST_COMPILE_PATH, file.name)}-${benchmarkName}-${type}.js`;
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
        const benchmarkName = node.declaration.declarations[0].id.value;
        const benchmarkPath = getCompiledBenchmarkPath(type, file, benchmarkName);
        const benchmarkObject = node.declaration.declarations[0].init;

        // TODO: add default value ast
        let generator_ast, benchmark_ast;

        for (const prop of benchmarkObject.properties) {
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
          }
        }

        assert(!generator_ast, "No $generator provided");
        assert(!benchmark_ast, "No $function provided");

        promises.push(writeCompiledContent(
          benchmarkPath,
          // TODO: get strings from ASTs
          (await custom({
            body: "",
            generator: "() => {}",
            benchmark: "() => {}"
          }))
        ));

        COMPILED_FILES.set(benchmarkPath, {
          type,
          variableName: benchmarkName,
          fileName: file.name,
          filePath: file.path
        });
      }
    }
  }

  await Promise.all(promises);

  console.log("COMPILE END - ", type);
};
