import { pub } from "ueve/async";
import {
  $compilationEnd,
  $compilationStart,
  $fileClose,
  $fileOpen,
} from "@events";
import {collectBenchmarksFromFile} from "src/utils/ast.js";
import {FILE_CACHE} from "@constants";

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
      benchmarks,
    });

    await pub($compilationEnd, { path });
  }

  await pub($fileClose, { path });

  return FILE_CACHE.get(path) as unknown as File;
};
