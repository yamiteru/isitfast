import { MODES, TYPES } from "@constants";

export type Either<$Options extends unknown[]> = $Options[number];

export type Fn<$Input extends unknown[], $Output> = (
  ...props: $Input
) => $Output;

export type Benchmark = {
  name: string;
  path: string;
  async: boolean;
  fileCpu: string;
  fileRam: string;
};

export type Content = File | Directory;

export type File = {
  type: "file";
  name: string;
  path: string;
  benchmarks: Benchmark[];
};

export type Directory = {
  type: "directory";
  name: string;
  path: string;
  content: Content[];
};

export type BenchmarkResult = {
  min: number;
  max: number;
  mean: number;
  median: number;
  variance: number;
  deviation: {
    standard: {
      value: number;
      percent: number;
      error: number;
    };
    medianAbsolute: {
      value: number;
      percent: number;
    };
    meanAbsolute: {
      value: number;
      percent: number;
    };
  };
  histogram: {
    "0.001": number;
    "0.01": number;
    "0.1": number;
    "1": number;
    "2.5": number;
    "25": number;
    "50": number;
    "75": number;
    "90": number;
    "97.5": number;
    "99": number;
    "99.9": number;
    "99.99": number;
    "99.999": number;
  };
  iterations: number;
};

export type BenchmarkResults = {
  cpu: BenchmarkResult;
  ram: BenchmarkResult;
};

export type Type = (typeof TYPES)[number];

export type Mode = (typeof MODES)[number];
