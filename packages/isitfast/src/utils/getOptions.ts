import { OPTIONS } from "../constants";
import { DeepPartial, Options } from "../types";

export function getOptions(options?: DeepPartial<Options>) {
  return {
    cpu: {
      ...OPTIONS.cpu,
      ...(options?.cpu || {}),
    },
    ram: {
      ...OPTIONS.ram,
      ...(options?.ram || {}),
    },
    offset: {
      ...OPTIONS.offset,
      ...(options?.offset || {}),
    },
    gc: {
      ...OPTIONS.gc,
      ...(options?.gc || {}),
    },
  } satisfies Options;
}
