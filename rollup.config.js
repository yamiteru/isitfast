import typescript from "@rollup/plugin-typescript";
import shebang from "rollup-plugin-preserve-shebang";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    compact: true,
    esModule: true,
    format: "esm",
    exports: "auto",
  },
  cache: true,
  treeshake: true,
  plugins: [typescript(), shebang()]
};
