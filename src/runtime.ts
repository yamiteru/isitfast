import { Fn } from "./types.js";

export function benchmarkOne<$Input>(
  input: () => $Input,
  benchmark: Fn<[$Input], void>,
) {
  return {
    input,
    benchmark,
  };
}

export function benchmarkMany<$Input>(
  inputs: (() => $Input)[],
  benchmark: Fn<[$Input], void>,
) {
  return {
    inputs,
    benchmark,
  };
}
