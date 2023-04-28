import { build, BuildOptions } from "esbuild";
import { randomUUID } from "node:crypto";
import { homedir } from "node:os";

const SHARED_OPTIONS = {
  target: ["esnext", "node20.0.0"],
  format: "esm",
} as BuildOptions;

export const transpileFile = async (path: string) => {
  const outfile = `${homedir()}/.isitfast/cache/${randomUUID()}.mjs`;

  await build({
    ...SHARED_OPTIONS,
    platform: "node",
    logLevel: "silent",
    entryPoints: [path],
    outfile,
  });

  return outfile;
};
