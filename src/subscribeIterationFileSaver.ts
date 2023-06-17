import { writeFile } from "fs/promises";
import { sub } from "ueve";
import { ARRAY } from "./constants.js";
import { $collectEnd } from "./events.js";
import { getResultFileName } from "./getResultFileName.js";

export function subscribeIterationFileSaver() {
  sub($collectEnd, async ({ benchmark, mode, opt, run, index }) => {
    await writeFile(getResultFileName(benchmark, mode, opt, run, index), ARRAY);
  });
}
