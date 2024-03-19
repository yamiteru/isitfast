import { stat, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createServer } from "node:net";
import { exec } from "child_process";

const HERE = process.cwd();
const FILE_DATASETS = 4;
const INPUT_FILE = "foreach";
const SOCKET_FILE = '/tmp/isitfast.sock';
const RUNS = 1000;
const buffer = Buffer.alloc(1);

let stats = [];
let runCount = 0;
let datasetIndex = 0;

const next = () => {
  if(datasetIndex < FILE_DATASETS) {
    const cmd = `node ${join(HERE, ".isitfast", `${INPUT_FILE}.${datasetIndex}.cpu.normal.js`)}`;

    console.log(`Run: ${cmd}`);

    exec(cmd, (e) => {
      if (e) {
        console.log(e);
      } else {
        datasetIndex++;
        next();
      }
    });
  }
};

(async () => {
  try {
    await stat(SOCKET_FILE);
    await unlink(SOCKET_FILE);
  } catch {
    // nothing
  }

  const server = createServer((stream) => {
    stats = [];
    runCount = 0;

    stream.write(buffer);

    stream.on("data", async (buffer) => {
      stats.push(buffer.readUint32LE(0));

      if (++runCount === RUNS) {
        stream.end();

        const file = `${INPUT_FILE}.${datasetIndex}.cpu.normal.json`;

        console.log(`Save: ${file}`);

        await writeFile(join(HERE, file), JSON.stringify(stats));
      } else {
        stream.write(buffer);
      }
    });
  }).listen(SOCKET_FILE);

  process.on('SIGINT', () => {
    server.close();
    process.exit(0);
  });

  next();
})();
