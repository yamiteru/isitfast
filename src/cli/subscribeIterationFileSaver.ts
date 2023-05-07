import {ARRAY} from "@constants";
import {$collectEnd} from "@events";
import {getResultFileName} from "@utils";
import {writeFile} from "fs/promises";
import {sub} from "ueve";

export function subscribeIterationFileSaver() {
  sub($collectEnd, async ({benchmark, mode, opt, run}) => {
    await writeFile(getResultFileName(benchmark, mode, opt, run), ARRAY);
  });
}
