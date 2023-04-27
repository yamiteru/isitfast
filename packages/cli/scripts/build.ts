import { build, BuildOptions } from "esbuild";

// TODO: use esbuild for the actual build
// TODO: make it importable and use it for on the fly compilation

const options = {
  bundle: true,
  entryPoints: ["src/index.ts"],
  logLevel: "info",
  platform: "node",
  treeShaking: true,
  target: ["esnext", "node18.0.0"],
  format: "esm",
  write: false
} as BuildOptions;

build(options).then((v) => {
  v.outputFiles?.forEach((v) => console.log(v.text))
});
