import { build, BuildOptions } from "esbuild";
import { Generator } from "npm-dts";
import { source, main as cjs, module as esm, types } from "../package.json";
import { swcPlugin } from "esbuild-plugin-swc";

const shared: BuildOptions = {
  bundle: true,
  entryPoints: [source],
  plugins: [swcPlugin()],
  logLevel: "info",
  minify: true,
  sourcemap: true,
};

const buildEsm = () =>
  build({
    ...shared,
    format: "esm",
    outfile: esm,
    target: ["esnext", "node18.0.0"],
  });

const buildCjs = () =>
  build({
    ...shared,
    format: "cjs",
    outfile: cjs,
    target: ["esnext", "node18.0.0"],
  });

const buildTypes = () =>
  new Generator({
    entry: source,
    output: types,
  }).generate();

(async () => {
  await Promise.all([buildEsm(), buildCjs(), buildTypes()]);
})();
