import {TYPES, MODES, OPTS} from "./constants.js";

export type Either<$Options extends unknown[]> = $Options[number];

export type Fn<$Input extends unknown[], $Output> = (
  ...props: $Input
) => $Output;

// TODO: rename props since some of them don't make much sense
export type Benchmark = {
  id: string;
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

export type Type = (typeof TYPES)[number];
export type Mode = (typeof MODES)[number];
// TODO: rename since it's not very clear what Opt means
export type Opt = (typeof OPTS)[number];
