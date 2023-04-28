import {collect} from "./collect.js";

export * from "./meow.js";

export async function benchmark(root: string, file: string) {
  // TODO: run before benchmark

  const cpu = await collect(`${root}/${file}`, "cpu");
  const ram = await collect(`${root}/${file}`, "ram");

  // TODO: run after benchmark

  return { cpu, ram };
}
