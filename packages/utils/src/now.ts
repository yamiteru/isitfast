import { IS_NODE } from "@isitfast/constants";

export const now = IS_NODE
  ? process.hrtime.bigint
  : () => BigInt(performance.now());
