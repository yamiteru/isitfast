import { IS_NODE } from "@isitfast/constants";

export const gc = IS_NODE ? () => global?.gc?.() : () => window?.gc?.();
