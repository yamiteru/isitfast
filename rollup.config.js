import typescript from "@rollup/plugin-typescript";
import shebang from "rollup-plugin-preserve-shebang";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    compact: true,
    esModule: true,
  },
  cache: true,
  treeshake: true,
  plugins: [typescript(), shebang()]
};
