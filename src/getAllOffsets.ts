import { getOffset } from "./getOffset";
import { Offsets } from "./types";

export async function getAllOffsets(): Promise<Offsets> {
  return {
    async: {
      cpu: await getOffset({ type: "async", mode: "cpu" }),
      ram: await getOffset({ type: "async", mode: "ram" }),
    },
    sync: {
      cpu: await getOffset({ type: "sync", mode: "cpu" }),
      ram: await getOffset({ type: "sync", mode: "ram" }),
    },
  };
}
