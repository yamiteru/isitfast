import { transformFile } from "@swc/core";
import { randomUUID } from "node:crypto";
import { homedir } from "node:os";
import {FILE_CACHE} from "@constants";
import {writeFile} from "node:fs/promises";
import {isAsync} from "@utils";
import {Fn, Module, Type} from "@types";

export const loadModule = async (sourcePath: string) => {
  if(!FILE_CACHE.has(sourcePath)) {
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
    const benchmarks: {
      name: string;
      fn: Fn<[], unknown>;
      type: Type;
    }[] = [];

    // TODO: check default function and/or object

    for(const name in module) {
      if(name[0] === "$") {
        const fn = module[name];

        benchmarks.push({
          name,
          fn,
          type: isAsync(fn) ? "async": "sync"
        });
      }
    }

    if (benchmarks.length === 0) {
      throw Error("No benchmark function found");
    }

    FILE_CACHE.set(sourcePath, {
      sourcePath,
      outPath,
      benchmarks
    });
  }

  return FILE_CACHE.get(sourcePath) as Module;
};
