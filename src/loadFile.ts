import { pub } from "ueve/async";
import { collectBenchmarksFromFile } from "./ast.js";
import { FILE_CACHE, RESULTS_DIR } from "./constants.js";
import {
  $fileOpen,
  $compilationStart,
  $compilationEnd,
  $fileClose,
} from "./events.js";

export const loadFile = async (path: string): Promise<File> => {
  await pub($fileOpen, { path });

  if (!FILE_CACHE.has(path)) {
    await pub($compilationStart, { path });

    const name = path.split("/").at(-1) as string;
    const benchmarks = await collectBenchmarksFromFile(path);

    FILE_CACHE.set(path, {
      type: "file",
      name,
      path: path,
      result: `${RESULTS_DIR}/${name.split(".").at(0)}`,
      benchmarks,
    });

    await pub($compilationEnd, { path });
  }

  await pub($fileClose, { path });

  return FILE_CACHE.get(path) as unknown as File;
};
