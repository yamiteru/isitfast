import {FN_ASYNC, BENCHMARK_TIMEOUT, NS_IN_SECOND, CURRENT, CHUNK_SIZE, SAMPLE_SIZE, ARRAY_CHUNK, DEVIATION_MAX, MATCH_NUMBER} from "@isitfast/constants";
import {BenchmarkFunction, BenchmarkResult, Fn, Mode, Type} from "@isitfast/types";
import {getOffset, isNumberFluke, mem, now} from "@isitfast/utils";
import {collectGarbage, sample, iterationStart, iterationEnd} from "./events.js";

let iterations = 0;
let shouldStop = false;
let start = 0;
let end = 0;
let data = 0;
let counter = 0;

export async function collect<$Data>({mode, type, fn}: {mode: Mode,
  type: Type,
  fn: BenchmarkFunction<$Data>}
): Promise<BenchmarkResult> {
  const isCpu = mode === "cpu";
  const measure = (isCpu ? now : mem) as Fn<[], number>;
  const gc = isCpu ? FN_ASYNC : collectGarbage;
  const timeout = now() + BigInt(BENCHMARK_TIMEOUT * NS_IN_SECOND / 1000);

  CURRENT.mode = mode;

  iterations = 0;
  shouldStop = false;
  start = 0;
  end = 0;
  data = 0;
  counter = 0;

  while (true) {
    const isOverSampleSize = iterations >= CHUNK_SIZE;

    if(iterations && !(iterations % SAMPLE_SIZE)) {
      ARRAY_CHUNK.copyWithin(CHUNK_SIZE, 0, CHUNK_SIZE);

      const offset = getOffset(ARRAY_CHUNK
        .slice(CHUNK_SIZE, isOverSampleSize
          ? CHUNK_SIZE*2
          : CHUNK_SIZE + iterations),
        iterations);

      await sample({ offset });

      if(shouldStop || offset.deviation.standard.percent <= DEVIATION_MAX) {
        if(counter + 1 === MATCH_NUMBER) {
          return offset;
        }

        counter += 1;
      } else {
        counter = 0;
      }
    }

    await iterationStart();
    await gc();

    if(type === "async") {
      start = measure();
      await fn(CURRENT.data);
      end = measure();
    } else {
      start = measure();
      fn(CURRENT.data);
      end = measure();
    }

    data = Math.round(Number(end - start));

    const isFluke = isNumberFluke(ARRAY_CHUNK.slice(0, isOverSampleSize? CHUNK_SIZE: iterations), iterations, data);
    const time = now();

    if(time >= timeout) {
      shouldStop = true;
    }

    if(!isFluke) {
      if(isOverSampleSize) {
        for(let i = 0; i < CHUNK_SIZE - 1; ++i) {
          ARRAY_CHUNK[i] = ARRAY_CHUNK[i + 1];
        }

        ARRAY_CHUNK[CHUNK_SIZE - 1] = data;
      } else {
        ARRAY_CHUNK[iterations] = data;
      }

      iterations += 1;
    }

    await iterationEnd({ data, isFluke });
  }
}
