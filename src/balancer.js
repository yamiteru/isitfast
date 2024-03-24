import { appendFile, writeFile } from "node:fs/promises";
import { CSV_COLUMN_MAP, BENCHMARKS, BUFFER_TYPE_INDEX, BUFFER_CPU_AFTER_INDEX, BUFFER_CPU_BEFORE_INDEX, BUFFER_RAM_AFTER_INDEX, BUFFER_RAM_BEFORE_INDEX, BUFFER, MAIN_SAMPLES, RUNS, BUFFER_DURATION_INDEX, STARTUP_SAMPLES } from "./constants.js";
import { spawn } from "node:child_process";
import { header, row } from "./csv.js";
import { randomItem } from "./utils.js";

export let now = process.hrtime.bigint();
export let activeItem;
export let activeProcess;
export let activeStream;
export let remaining = [];

async function runMain(buffer) {
  const { name, result } = activeItem;
  const type = buffer.readUInt32LE(BUFFER_TYPE_INDEX);

  if(type === 1) {
    const cpu = Number(buffer.readBigInt64LE(BUFFER_CPU_AFTER_INDEX) - buffer.readBigInt64LE(BUFFER_CPU_BEFORE_INDEX));
    const ram = buffer.readUInt32LE(BUFFER_RAM_AFTER_INDEX) - buffer.readUInt32LE(BUFFER_RAM_BEFORE_INDEX);

    if(cpu >= 0 && ram >= 0) {
      await appendFile(result.path, row([
        result.run,
        result.iteration,
        cpu,
        ram,
      ]));

      if(++result.iteration === MAIN_SAMPLES) {
        activeProcess.kill();

        if(++result.run >= RUNS) {
          remaining = remaining.filter((v) => v !== name);
        }

        result.iteration = 0;
        next();
      } else {
        activeStream.write(BUFFER);
      }
    } else {
      activeStream.write(BUFFER);
    }
  } else {
    activeStream.write(BUFFER);
  }
}

async function runStartup(buffer) {
  const { name, result } = activeItem;
  const duration = Number(buffer.readBigInt64LE(BUFFER_DURATION_INDEX) - now);

  await appendFile(result.path, row([
    result.iteration,
    duration,
  ]));

  activeProcess.kill();

  if(++result.iteration === STARTUP_SAMPLES) {
    remaining = remaining.filter((v) => v !== name);
  }

  next();
}

const RUN_MAP = {
  main: runMain,
  startup: runStartup
};

export const init = () => {
  remaining = [...BENCHMARKS.keys()];
};

export const next = () => {
  if(remaining.length === 0) return;

  activeItem = BENCHMARKS.get(randomItem(activeItem, remaining));

  console.log("RUN - ", activeItem);

  (async () => {
    const {
      type,
      compile,
      result
    } = activeItem;

    if(!result.created) {
      await writeFile(
        result.path,
        header(CSV_COLUMN_MAP[type])
      );

      result.created = true;
    }

    now = process.hrtime.bigint();
    activeProcess = spawn(
      "node",
      [compile.path],
      { stdio: ["inherit", "inherit", "inherit", "pipe"] }
    );

    activeStream = activeProcess.stdio[3];
    activeStream.on("data", RUN_MAP[type]);
  })();
};
