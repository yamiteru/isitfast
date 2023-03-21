import { build, BuildOptions } from "esbuild";
import { swcPlugin } from "esbuild-plugin-swc";

const shared = {
  bundle: true,
  entryPoints: ["src/index.ts"],
  plugins: [swcPlugin()],
  logLevel: "info",
  minify: true,
  platform: "node",
  sourcemap: "linked",
  treeShaking: true,
  outdir: "dist",
  target: ["esnext", "node18.0.0"],
} as BuildOptions ;

(async () => {
  await Promise.all([
    build({
      ...shared,
      format: "esm",
      outExtension: { ".js": ".esm.js" },
      splitting: true,
    }),
    build({
      ...shared,
      format: "cjs",
      outExtension: { ".js": ".cjs.js" },
    }),
  ]);
})();
