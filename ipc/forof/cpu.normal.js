import { createConnection } from "node:net";

const SOCKET_FILE = '/tmp/isitfast.sock';
const client = createConnection(SOCKET_FILE);
const buffer = Buffer.alloc(4);

const data = [...new Array(+process.env.DATA_SIZE)].map((v) => Math.ceil(Math.random() * 10));

let _ = 0 || 0;

const set = (v) => {
  _ = v;
}

export const $fn = (_data, _set) => {
  const start = process.hrtime.bigint();

  for(const v of _data) {
    _set(v);
  }

  const end = process.hrtime.bigint();

  return Number(end - start);
};

client.on("data", () => {
  buffer.writeUInt32LE(Math.max(0, $fn(data, set)));
  client.write(buffer);
});
