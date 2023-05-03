import { transformFile } from "@swc/core";
import { randomUUID } from "node:crypto";
import { CACHE_DIR, FILE_CACHE } from "@constants";
import { writeFile } from "node:fs/promises";
import { getType } from "@utils";
import { Benchmark, File } from "@types";
import {pub} from "ueve/async";
import {$compilationEnd, $compilationStart, $fileClose, $fileOpen} from "@events";

export const loadFile = async (path: string): Promise<File> => {
  await pub($fileOpen, { path });

  if(!FILE_CACHE.has(path)) {
    await pub($compilationStart, { path });

    const name = path.split("/").at(-1) as string;
    const outPath = `${CACHE_DIR}${randomUUID()}.mjs`;
    const output = await transformFile(path, {
      jsc: {
        parser: {
          syntax: path.endsWith(".ts") ? "typescript": "ecmascript"
        },
        target: "esnext"
      }
    });

    await writeFile(outPath, output.code);

    const module = await import(outPath);
    const benchmarks: Benchmark[] = [];

    if(typeof module.default === "function") {
      benchmarks.push({
        name,
        path: "default",
        fn: module.default,
        type: getType(module.default),
        file: outPath
      });
    } else {
      for(const name in module) {
        if(name[0] === "$") {
          const fn = module[name];

          benchmarks.push({
            name,
            path: name,
            fn,
            type: getType(fn),
            file: outPath
          });
        }
      }
    }

    FILE_CACHE.set(path, {
      type: "file",
      name,
      path: path,
      file: outPath,
      benchmarks
    });

    await pub($compilationEnd, { path });
  }

  await pub($fileClose, { path });

  return FILE_CACHE.get(path) as File;
};
