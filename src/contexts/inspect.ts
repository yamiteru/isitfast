import type { Dispatch, SetStateAction } from "react";
import { createContext, useEffect, useMemo, useState } from "react";
import { Benchmark, Benchmarks, Mode, Nullable } from "../types.js";
import { CommandProps } from "src/commands/index.js";

export const InspectContext = createContext<{
  benchmarks: Benchmarks;
  setBenchmarks: Dispatch<SetStateAction<Benchmarks>>;
  mode: Nullable<Mode>;
  setMode: Dispatch<SetStateAction<Nullable<Mode>>>;
  index: Nullable<number>;
  setIndex: Dispatch<SetStateAction<Nullable<number>>>;
  benchmark: Nullable<Benchmark>;
  setBenchmark: Dispatch<SetStateAction<Nullable<Benchmark>>>;
}>({} as never);

export const useInspectContext = (props: CommandProps) => {
  const [benchmarks, setBenchmarks] = useState<Benchmarks>([]);
  const [mode, setMode] = useState<null | Mode>(null);
  const [index, setIndex] = useState<null | number>(null);
  const [benchmark, setBenchmark] = useState<null | Benchmark>(null);

  // useEffect(() => {
  //
  // }, []);

  // const path = input[1];
  //
  // if (!path) {
  //   throw Error("Missing file");
  // }
  //
  // try {
  //   await access(path);
  // } catch {
  //   throw Error("File does not exist");
  // }
  //
  // const file = parsePath(path);
  // const benchmarks = await parse(file);

  // NOTE: select mode, index and benchmark in TUI
  // const worker = await createWorker({
  //   mode: "cpu",
  //   index: 0,
  //   file,
  //   benchmark: benchmarks[0],
  // });

  // NOTE: pass data into store and render graph in TUI
  // worker.on("message", console.log);

  // NOTE: run infinitely and stop using TUI
  // for (let i = 0; i < 100; ++i) {
  //   worker.postMessage(null);
  // }

  return useMemo(
    () => ({
      benchmarks,
      setBenchmarks,
      mode,
      setMode,
      index,
      setIndex,
      benchmark,
      setBenchmark,
    }),
    [
      benchmarks,
      mode,
      index,
      benchmark,
    ],
  );
};
