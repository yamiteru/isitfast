import { getOffset } from "./getOffset";
import { Offsets } from "../types";
import { Name } from "../events";

export async function getOffsets(name: Name): Promise<Offsets> {
  return {
    async: {
      cpu: await getOffset(name, { type: "async", mode: "cpu" }),
      ram: await getOffset(name, { type: "async", mode: "ram" }),
    },
    sync: {
      cpu: await getOffset(name, { type: "sync", mode: "cpu" }),
      ram: await getOffset(name, { type: "sync", mode: "ram" }),
    },
  };
}
