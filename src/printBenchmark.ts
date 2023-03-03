import { Results } from "./types";

export function printBenchmark({ name, cpu, ram }: Results) {
  const ops =
    cpu.median === 0 ? 1_000_000_000 : Math.round(1_000_000_000 / cpu.median);

  console.log(name);
  console.log(`${ops} op/s | ${ram.median} kb`);
  console.log();
}
