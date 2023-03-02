import { OPTIONS } from "./constants";
import { DeepPartial, Options } from "./types";

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
    general: {
      ...OPTIONS.general,
      ...(partialOptions?.general || {}),
    },
  } satisfies Options;
}
