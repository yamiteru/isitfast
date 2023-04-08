import { Fn } from "elfs";
import { STATE, FN_ASYNC, OFFSETS } from "./constants";
import { createStores, getGarbageCollectorFunction } from "./private";
import { add, onSuiteEnd, onSuiteStart, run, setup } from "./public";
import {
  Benchmark,
  Events,
  DeepPartial,
  Options,
} from "./types";
import { getOptions } from "./utils";

export class Suite<$Data, $Benchmarks extends string[] = []> {
  public setup: <$$Data extends $Data>(
    fn: Fn<[], $$Data>,
  ) => Suite<$$Data, $Benchmarks>;

  public add: <$Name extends string>(
    name: $Name,
    benchmark: Benchmark<$Data>,
    events?: Events,
  ) => Suite<$Data, [...$Benchmarks, $Name]>;

  public onSuiteStart: Fn<[Fn<[], Promise<void>>], Suite<$Data, $Benchmarks>>;

  public onSuiteEnd: Fn<[Fn<[], Promise<void>>], Suite<$Data, $Benchmarks>>;

  public run: Fn<[], Promise<void>>;

  constructor(name: string, options?: DeepPartial<Options>) {
    // Variables
    STATE.name = name;
    STATE.options = getOptions(options);
    STATE.setup = () => null;
    STATE.onSuiteStart = FN_ASYNC;
    STATE.onSuiteEnd = FN_ASYNC;
    STATE.data = STATE.setup();
    STATE.benchmarks = {};
    STATE.offsets = OFFSETS;
    STATE.stores = createStores();
    STATE.collectGarbage = getGarbageCollectorFunction();

    // Methods
    this.add = add;
    this.setup = setup;
    this.onSuiteStart = onSuiteStart;
    this.onSuiteEnd = onSuiteEnd;
    this.run = run;
  }
}
