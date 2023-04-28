import { BenchmarkResult, Mode } from "@types";
import { ARRAY, CHUNK_SIZE, COLLECT_TIMEOUT, DEVIATION_MAX, MATCH_NUMBER, NS_IN_SECOND } from "@constants";
import { getOffset, isAsync as getIsAsync, isNumberFluke, now } from "@utils";
import { thread } from "./thread.js";

export const collect = (sourceFile: string, mode: Mode) => new Promise<BenchmarkResult>(async (resolve, reject) => {
  const timeout = process.hrtime.bigint() + BigInt((COLLECT_TIMEOUT * NS_IN_SECOND) / 1000);
  const worker = await thread(sourceFile, mode);

  ARRAY.index = 0;
  ARRAY.count = 0;

  worker.on("message", async (v) => {
    ARRAY.chunk[ARRAY.index] = v;

    const isOverSampleSize = ARRAY.index >= CHUNK_SIZE;

    const offset = getOffset(
      ARRAY.chunk.slice(
        CHUNK_SIZE,
        isOverSampleSize ? CHUNK_SIZE * 2 : CHUNK_SIZE + ARRAY.index,
      ),
      ARRAY.index,
    );

    if(ARRAY.index && !(ARRAY.index % CHUNK_SIZE)) {
      ARRAY.chunk.copyWithin(CHUNK_SIZE, 0, CHUNK_SIZE);

      const percent = offset.deviation.standard.percent;

      // TODO: get rid of NaN
      if(isNaN(percent) || percent <= DEVIATION_MAX) {
        if(ARRAY.count + 1 === MATCH_NUMBER) {
          resolve(offset);
          worker.terminate();
        }

        ARRAY.count += 1;
      } else {
        ARRAY.count = 0;
      }
    }

    const isFluke = isNumberFluke(
      ARRAY.chunk.slice(0, isOverSampleSize ? CHUNK_SIZE : ARRAY.index),
      ARRAY.index,
      v
    );

    if (now() >= timeout) {
      resolve(offset);
      worker.terminate();
    }

    if(!isFluke) {
      if (isOverSampleSize) {
        for (let i = 0; i < CHUNK_SIZE - 1; ++i) {
          ARRAY.chunk[i] = ARRAY.chunk[i + 1];
        }

        ARRAY.chunk[CHUNK_SIZE - 1] = v;
      } else {
        ARRAY.chunk[ARRAY.index] = v;
      }

      ARRAY.index += 1;
    }

    worker.postMessage(null);
  });

  worker.postMessage(null);
});
