import { transformFile } from "@swc/core";
import { randomUUID } from "node:crypto";
import { homedir } from "node:os";
import {FILE_CACHE} from "@constants";
import {writeFile} from "node:fs/promises";

export const transpileFile = async (path: string) => {
  const outFile = `${homedir()}/.isitfast/cache/${randomUUID()}.mjs`;

  if(!FILE_CACHE.has(path)) {
    const output = await transformFile(path, {
      jsc: {
        parser: {
          syntax: path.endsWith(".ts") ? "typescript": "ecmascript"
        }
      }
    });

    await writeFile(outFile, output.code)

    FILE_CACHE.set(path, outFile)
  }

  return FILE_CACHE.get(path) as string;
};
