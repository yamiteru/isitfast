import { OPTIONS } from "@isitfast/constants";
import {DeepPartial, Options} from "@isitfast/types";

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
