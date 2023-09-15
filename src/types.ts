import { TYPES, MODES, OPTS } from "./constants.js";

export type Either<$Options extends unknown[]> = $Options[number];

export type Fn<$Input extends unknown[], $Output> = (
  ...props: $Input
) => $Output;

export type Benchmark = {
  id: string;
  variable: string;
  cases: string[];
  name: string;
  async: boolean;
  path: {
    source: string;
    cpu: string;
    ram: string;
  };
};

export type Content = File | Directory;

export type File = {
  type: "file";
  name: string;
  path: string;
  result: string;
  benchmarks: Benchmark[];
};

export type Directory = {
  type: "directory";
  name: string;
  path: string;
  content: Content[];
};

export type Type = (typeof TYPES)[number];
export type Mode = (typeof MODES)[number];
// TODO: rename since it's not very clear what Opt means
export type Opt = (typeof OPTS)[number];
