import { Fn } from "elfs";
import { FN_ASYNC, FN_SYNC, IS_NODE, OFFSET, OFFSETS } from "./constants";
import {
  Benchmark,
  DeepPartial,
  Offsets,
  Options,
  Stores,
  Type,
  Benchmarks,
  Events,
  Offset,
  Mode,
} from "./types";
import {
  getMedian,
  clampToZero,
  getOptions,
  getChunkDeviation,
  now,
} from "./utils";
import { pub } from "ueve/async";
import {
  $benchmarkEnd,
  $benchmarkStart,
  $garbageEnd,
  $garbageStart,
  $iterationEnd,
  $iterationStart,
  $offsetEnd,
  $offsetStart,
  $suiteEnd,
  $suiteStart,
} from "./events";

class Suite<$Data, $Benchmarks extends Benchmarks<$Data>> {
  private _name: string;
  private _options: Options;
  private _setup: Fn<[], $Data>;
  private _onSuiteStart: Fn<[$Data], Promise<void>>;
  private _onSuiteEnd: Fn<[$Data], Promise<void>>;
  private _data: $Data;
  private _benchmarks: $Benchmarks;
  private _offsets: Offsets;
  private _stores: Stores;
  private _collectGarbage: Fn<[], void>;

  constructor(name: string, options?: DeepPartial<Options>) {
    this._name = name;
    this._options = getOptions(options);
    this._setup = () => null as $Data;
    this._onSuiteStart = FN_ASYNC;
    this._onSuiteEnd = FN_ASYNC;
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

    this._collectGarbage = this._options.gc.allow
      ? IS_NODE
        ? () => global?.gc?.()
        : () => window?.gc?.()
      : FN_SYNC;
  }

  private async $collectGarbage() {
    await pub($garbageStart, { suiteName: this._name });

    this._collectGarbage();

    await pub($garbageEnd, { suiteName: this._name });
  }

  private async $suiteStart() {
    await this._onSuiteStart(this._data);
    await pub($suiteStart, {
      suiteName: this._name,
      benchmarkNames: Object.keys(this._benchmarks),
    });
  }

  private async $suiteEnd() {
    await this._onSuiteEnd(this._data);
    await pub($suiteEnd, { suiteName: this._name });
  }

  private async $benchmarkStart(name: string) {
    await this._benchmarks[name]?.events?.onBenchmarkStart?.();
    await pub($benchmarkStart, { suiteName: this._name, benchmarkName: name });
  }

  private async $benchmarkEnd(name: string, cpu: Offset, ram: Offset) {
    await this._benchmarks[name]?.events?.onBenchmarkEnd?.({ cpu, ram });
    await pub($benchmarkEnd, {
      suiteName: this._name,
      benchmarkName: name,
      cpu,
      ram,
    });
  }

  private async $offsetStart(name: string) {
    await pub($offsetStart, { suiteName: this._name, offsetName: name });
  }

  private async $offsetEnd(name: string, offset: Offset) {
    await pub($offsetEnd, { suiteName: this._name, offsetName: name, offset });
  }

  private async $iterationStart(name: string, mode: Mode, type: Type) {
    await this._benchmarks[name]?.events?.onIterationStart?.();
    await pub($iterationStart, {
      suiteName: this._name,
      benchmarkName: name,
      mode,
      type,
    });
  }

  private async $iterationEnd(name: string, mode: Mode, type: Type) {
    await this._benchmarks[name]?.events?.onIterationEnd?.();
    await pub($iterationEnd, {
      suiteName: this._name,
      benchmarkName: name,
      mode,
      type,
    });
  }

  public setup<$Type extends $Data>(setup: Fn<[], $Type>) {
    this._setup = setup;
    return this as unknown as Suite<$Type, $Benchmarks>;
  }

  public onSuiteStart(fn: Fn<[], Promise<void>>) {
    this._onSuiteStart = fn;
    return this;
  }

  public onSuiteEnd(fn: Fn<[$Data], Promise<void>>) {
    this._onSuiteEnd = fn;
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

    await this.$suiteStart();

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
      await this.$benchmarkStart(name);
      await this.$collectGarbage();

      const fn = this._benchmarks[name].benchmark;
      const cpu = await this._stats(name, fn, "cpu", this._offsets);
      const ram = await this._stats(name, fn, "ram", this._offsets);

      await this.$benchmarkEnd(name, cpu, ram);
    }

    await this.$suiteEnd();
  }

  private async _getOffset(type: Type, mode: Mode) {
    const name = `offset-${type}-${mode}`;

    await this.$offsetStart(name);

    const fn = type === "async" ? FN_ASYNC : FN_SYNC;
    const result = { ...OFFSET };

    while (true as any) {
      const offset = await this._stats(name, fn, mode, OFFSETS);

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

    await this.$offsetEnd(name, result);

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
    const median = clampToZero(getMedian(array, index) - offset.median);
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

    await this.$iterationStart(name, mode, type);

    if (mode === "cpu") {
      const start = now();

      isAsync ? await benchmark(this._data) : benchmark(this._data);

      const end = now();
      const data = Math.round(Number(end - start));

      store.array[++store.index] = data;

      await this.$iterationEnd(name, mode, type);
    } else {
      await this.$collectGarbage();

      const start = process.memoryUsage().heapUsed;

      isAsync ? await benchmark(this._data) : benchmark(this._data);

      const end = process.memoryUsage().heapUsed;
      const data = Math.round(Number(end - start));

      store.array[++store.index] = data;

      await this.$iterationEnd(name, mode, type);
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
