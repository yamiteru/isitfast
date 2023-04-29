import { transformFile } from "@swc/core";
import { randomUUID } from "node:crypto";
import { homedir } from "node:os";
import {FILE_CACHE} from "@constants";
import {writeFile} from "node:fs/promises";
import {isAsync} from "@utils";
import {Benchmark, File} from "@types";

export const loadFile = async (sourcePath: string): Promise<File> => {
  if(!FILE_CACHE.has(sourcePath)) {
    const name = sourcePath.split("/").at(-1) as string;
    const outPath = `${homedir()}/.isitfast/cache/${randomUUID()}.mjs`;
    const output = await transformFile(sourcePath, {
      jsc: {
        parser: {
          syntax: sourcePath.endsWith(".ts") ? "typescript": "ecmascript"
        },
        target: "esnext"
      }
    });

    await writeFile(outPath, output.code);

    const module = await import(outPath);
    const benchmarks: Benchmark[] = [];

    for(const name in module) {
      if(name[0] === "$") {
        const fn = module[name];

        benchmarks.push({
          name,
          fn,
          type: isAsync(fn) ? "async": "sync",
          file: outPath
        });
      }
    }

    FILE_CACHE.set(sourcePath, {
      type: "file",
      name,
      path: sourcePath,
      file: outPath,
      benchmarks
    });
  }

  return FILE_CACHE.get(sourcePath) as File;
};
