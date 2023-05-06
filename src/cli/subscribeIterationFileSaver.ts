import {$iterationEnd, $collectStart, $collectEnd} from "@events";
import {getResultFileName} from "@utils";
import {appendFile, rm} from "fs/promises";
import {sub} from "ueve";

export function subscribeIterationFileSaver() {
  let first = true;

  sub($iterationEnd, async ({benchmark, median, mode, opt}) => {
      await appendFile(getResultFileName(benchmark, mode, opt), `${first ? "": ","}${median}`);

      first = false
  });

  sub($collectStart, async ({benchmark, mode, opt}) => {
    const name = getResultFileName(benchmark, mode, opt);

    first = true;

    await rm(name, { force: true });
    await appendFile(name, "[");
  });

  sub($collectEnd, async ({benchmark, mode, opt}) => {
    await appendFile(getResultFileName(benchmark, mode, opt), "]");
  });
}
