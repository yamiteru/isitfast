module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "no-constant-condition": "off"
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
};
