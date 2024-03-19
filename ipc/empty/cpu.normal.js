import { createConnection } from "node:net";

const SOCKET_FILE = '/tmp/isitfast.sock';
const client = createConnection(SOCKET_FILE);
const buffer = Buffer.alloc(4);

export const $fn = () => {
  const start = process.hrtime.bigint();

  // nothing

  const end = process.hrtime.bigint();

  return Number(end - start);
};

client.on("data", () => {
  buffer.writeUInt32LE(Math.max(0, $fn()));
  client.write(buffer);
});
