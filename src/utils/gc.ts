import { IS_NODE } from "@constants";

export const gc = IS_NODE ? () => global?.gc?.() : () => window?.gc?.();
