import { createConnection } from 'net';

const SOCKET_FILE = '/tmp/isitfast.sock';
const buffer = Buffer.alloc(4);

let tmp = null;

const set = (v) => { tmp = v; };
const data = (() => [...new Array(10000)].map(() => Math.random()))();

const client = createConnection(SOCKET_FILE)
  .on("data", () => {
    const start = process.hrtime.bigint();

    data.forEach((v) => set(v));

    buffer.writeUInt32LE(parseInt(process.hrtime.bigint() - start), 0);
    client.write(buffer);
  });

client.write(buffer);

