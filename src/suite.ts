import { Fn } from "elfs";
import { Mode } from "fs";
import { FN_ASYNC, FN_SYNC, OFFSET, OFFSETS } from "./constants";
import {
  Benchmark,
  DeepPartial,
  Offsets,
  Options,
  Stores,
  Type,
  Offset,
} from "./types";
import { getMedian } from "./utils/getMedian";
import { getOptions } from "./utils/getOptions";
import { positive } from "./utils/positive";
import { getChunkDeviation } from "./utils/getChunkDeviation";
import { now } from "./utils/now";
import { collectGarbage } from "./utils/collectGarbage";
import { pub } from "ueve/async";
import {
  $benchmarkAfterAll,
  $benchmarkAfterEach,
  $benchmarkBeforeAll,
  $benchmarkBeforeEach,
  $suiteAfter,
  $suiteBefore,
} from "./events";

type Events = Partial<{
  beforeOne: Fn<[], Promise<void>>;
  afterOne: Fn<[], Promise<void>>;
  beforeAll: Fn<[], Promise<void>>;
  afterAll: Fn<
    [
      {
        cpu: Offset;
        ram: Offset;
      },
    ],
    Promise<void>
  >;
}>;

type Benchmarks<$Data> = Record<
  string,
  {
    benchmark: Benchmark<$Data>;
    events: Events;
  }
>;

class Suite<$Data, $Benchmarks extends Benchmarks<$Data>> {
  private _options: Options;
  private _setup: Fn<[], $Data>;
  private _before: Fn<[$Data], Promise<void>>;
  private _after: Fn<[$Data], Promise<void>>;
  private _data: $Data;
  private _benchmarks: $Benchmarks;
  private _offsets: Offsets;
  private _stores: Stores;

  public name: string;

  constructor(name: string, options?: DeepPartial<Options>) {
    this._options = getOptions(options);
    this._setup = () => null as $Data;
    this._before = FN_ASYNC;
    this._after = FN_ASYNC;
    this._data = this._setup();
    this._benchmarks = {} as $Benchmarks;
    this._offsets = OFFSETS;
    this._stores = {
      cpu: {
        chunk: this._createStore("cpu"),
        main: this._createStore("cpu"),
      },
      ram: {
        chunk: this._createStore("ram"),
        main: this._createStore("ram"),
      },
    };

    this.name = name;
  }

  public setup<$Type extends $Data>(setup: Fn<[], $Type>) {
    this._setup = setup;

    return this as unknown as Suite<$Type, $Benchmarks>;
  }

  public before(before: Fn<[$Data], Promise<void>>) {
    this._before = before;

    return this;
  }

  public after(after: Fn<[$Data], Promise<void>>) {
    this._after = after;

    return this;
  }

  public add<$Name extends string>(
    name: $Name,
    benchmark: Benchmark<$Data>,
    events: Events = {},
  ) {
    this._benchmarks[name] = { benchmark, events } as any;

    return this as unknown as Suite<
      $Data,
      $Benchmarks &
        Record<
          $Name,
          {
            benchmark: Benchmark<$Data>;
            events: Events;
          }
        >
    >;
  }

  public async run() {
    this._data = this._setup();

    await this._before(this._data);
    await pub($suiteBefore, {
      suiteName: this.name,
      benchmarkNames: Object.keys(this._benchmarks),
    });

    this._offsets = {
      async: {
        cpu: await this._getOffset("async", "cpu"),
        ram: await this._getOffset("async", "ram"),
      },
      sync: {
        cpu: await this._getOffset("sync", "cpu"),
        ram: await this._getOffset("sync", "ram"),
      },
    };

    for (const name in this._benchmarks) {
      await this._benchmarks[name]?.events?.beforeAll?.();
      await pub($benchmarkBeforeAll, {
        suiteName: this.name,
        benchmarkName: name,
      });

      // We GC here so memory from one benchmark doesn't leak to the next one
      collectGarbage();

      const fn = this._benchmarks[name].benchmark;
      const cpu = await this._stats(name, fn, "cpu", this._offsets);
      const ram = await this._stats(name, fn, "ram", this._offsets);

      await this._benchmarks[name]?.events?.afterAll?.({
        cpu,
        ram,
      });
      await pub($benchmarkAfterAll, {
        suiteName: this.name,
        benchmarkName: name,
        cpu,
        ram,
      });
    }

    await this._after(this._data);
    await pub($suiteAfter, { suiteName: this.name });
  }

  private async _getOffset(type: Type, mode: Mode) {
    const fn = type === "async" ? FN_ASYNC : FN_SYNC;
    const result = { ...OFFSET };

    while (true as any) {
      const offset = await this._stats(
        `offset-${type}-${mode}`,
        fn,
        mode,
        OFFSETS,
      );

      if (result.median) {
        const subtracted = offset.median - result.median;

        if (subtracted <= 0) {
          result.median += offset.median + subtracted;
          break;
        } else {
          result.median += offset.median;
        }
      } else {
        result.median += offset.median;
      }
    }

    return result;
  }

  private async _stats(
    name: string,
    benchmark: Benchmark,
    mode: Mode,
    offsets: Offsets,
  ) {
    const { chunk, main } = this._stores[mode];
    const { chunkSize, compareSize, rangePercent } = this._options[mode];
    const type = (benchmark as any) instanceof Promise ? "async" : "sync";

    main.index = -1;
    chunk.index = -1;

    while (true as any) {
      if (chunk.index === chunkSize) {
        const median = getMedian(chunk.array, chunk.index);

        main.array[++main.index] = median;
        chunk.index = -1;

        if (main.index >= compareSize) {
          const deviation = getChunkDeviation(
            median,
            main.array,
            main.index - compareSize,
          );

          if (deviation <= rangePercent) {
            break;
          }
        }
      }

      if (main.index === chunkSize) {
        main.array[0] = getMedian(main.array, main.index);
        main.index = 0;
      }

      await this._collect(name, benchmark, mode, type);
    }

    const { array, index } = main;
    const offset = offsets[type][mode];
    const median = positive(getMedian(array, index) - offset.median);
    const cycles = main.index * chunkSize;
    const deviation = getChunkDeviation(median, array, index - compareSize);

    return {
      median,
      deviation,
      cycles,
    };
  }

  private async _collect(
    name: string,
    benchmark: Benchmark,
    mode: Mode,
    type: Type,
  ) {
    const isAsync = type === "async";
    const store = this._stores[mode].chunk;

    await this._benchmarks[name]?.events?.beforeOne?.();
    await pub($benchmarkBeforeEach, {
      suiteName: this.name,
      benchmarkName: name,
    });

    if (mode === "cpu") {
      const start = now();

      isAsync ? await benchmark(this._data) : benchmark(this._data);

      const end = now();
      const data = Math.round(Number(end - start));

      store.array[++store.index] = data;

      await this._benchmarks[name]?.events?.afterOne?.();
      await pub($benchmarkAfterEach, {
        suiteName: this.name,
        benchmarkName: name,
      });
    } else {
      collectGarbage();

      const start = process.memoryUsage().heapUsed;

      isAsync ? await benchmark(this._data) : benchmark(this._data);

      const end = process.memoryUsage().heapUsed;
      const data = Math.round(Number(end - start));

      store.array[++store.index] = data;

      await this._benchmarks[name]?.events?.afterOne?.();
      await pub($benchmarkAfterEach, {
        suiteName: this.name,
        benchmarkName: name,
      });
    }
  }

  private _createStore(mode: Mode) {
    return {
      array: new Uint32Array(
        new ArrayBuffer(this._options[mode].chunkSize * 4),
      ),
      index: 0,
    };
  }
}

export const suite = (name: string, options?: DeepPartial<Options>) =>
  new Suite(name, options);
