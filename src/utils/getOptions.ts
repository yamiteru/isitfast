import { OPTIONS } from "../constants";
import { DeepPartial, Options } from "../types";

export function getOptions(partialOptions?: DeepPartial<Options>) {
  return {
    cpu: {
      ...OPTIONS.cpu,
      ...(partialOptions?.cpu || {}),
    },
    ram: {
      ...OPTIONS.ram,
      ...(partialOptions?.ram || {}),
    },
    offset: {
      ...OPTIONS.offset,
      ...(partialOptions?.offset || {}),
    },
    gc: {
      ...OPTIONS.gc,
      ...(partialOptions?.gc || {}),
    },
  } satisfies Options;
}
