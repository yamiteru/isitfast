import { STATE, FN_ASYNC, OFFSETS, OFFSET_MIN } from "@isitfast/constants";
import { createStores, getGarbageCollectorFunction } from "./private/index.js";
import { add, onSuiteEnd, onSuiteStart, run, setup } from "./public/index.js";
import { getOptions } from "@isitfast/utils";
import { SuiteInterface, Benchmark, Events, DeepPartial, Options, Fn } from "@isitfast/types";

export class Suite<$Data, $Benchmarks extends string[] = []> implements SuiteInterface<$Data, $Benchmarks> {
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
    STATE.min = OFFSET_MIN;

    // Methods
    this.add = add;
    this.setup = setup;
    this.onSuiteStart = onSuiteStart;
    this.onSuiteEnd = onSuiteEnd;
    this.run = run;
  }
}
