import { ParsedFile } from "./parsePath.js";

export type Nullable<T> = T | null;

export type Benchmark = {
  name: string;
  variable: string;
  async: boolean;
  data: string[];
};

export type Benchmarks = Benchmark[];

export type Mode = "cpu" | "ram";

export type WorkerProps = {
  mode: Mode;
  index: number;
  file: ParsedFile;
  benchmark: Benchmark;
};

export type CompiledProps = {
  mode: WorkerProps["mode"];
  file: WorkerProps["file"];
  benchmark: WorkerProps["benchmark"];
};
