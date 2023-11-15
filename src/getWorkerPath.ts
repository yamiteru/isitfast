import { join } from "path";
import { WorkerProps } from "./types.js";
import { WORKERS_FOLDER } from "./constants.js";

export const getWorkerPath = ({ mode, index, file, benchmark }: WorkerProps) =>
  join(
    WORKERS_FOLDER,
    `${file.folders.join("/")}/${file.name}-${
      benchmark.variable
    }-${mode}-${index}.js`,
  );
