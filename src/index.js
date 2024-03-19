import { appendFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";

const HERE = process.cwd();
const BENCHMARK = process.env.BENCHMARK;
const FILE = process.env.FILE;
const SAMPLES = 5_000;
const RUNS = 20;
const BUFFER = Buffer.alloc(1);
const STATS_FILE_NAME = join(HERE, "results", "newer", `${FILE}-$${BENCHMARK}.csv`);

export const STATS_COLUMNS = [
  "run",
  "iteration",
  "cpu",
  "ram",
];

export const row = (values) => `${values.join(",")}\n`;
export const header = (values) => `${values.map((v) => `"${v}"`).join(",")}\n`;

let iterationIndex = 0;
let runIndex = 0;

const run = async () => {
  const proc = spawn(
    "node",
    [join(HERE, "compile", `${FILE}-$${BENCHMARK}.js`)],
    { stdio: ["inherit", "inherit", "inherit", "pipe"] }
  );

  const stream = proc.stdio[3];

  stream.on("data", async (buffer) => {
    const type = buffer.readUInt32LE(0);

    if(type === 1) {
        const cpu = Number(buffer.readBigInt64LE(12) - buffer.readBigInt64LE(4));
        const ram = buffer.readUInt32LE(24) - buffer.readUInt32LE(20);

        if(cpu >= 0 && ram >= 0) {
          await appendFile(STATS_FILE_NAME, row([
            runIndex,
            iterationIndex,
            cpu,
            ram,
          ]));

          if(++iterationIndex === SAMPLES) {
            proc.kill();

            if(++runIndex < RUNS) {
              iterationIndex = 0;
              await run();
            }
          } else {
            stream.write(BUFFER);
          }
        } else {
          stream.write(BUFFER);
        }
    } else {
      stream.write(BUFFER);
    }
  });
};

(async () => {
  await writeFile(STATS_FILE_NAME, header(STATS_COLUMNS));
  await run();
})();
