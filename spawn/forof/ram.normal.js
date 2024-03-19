import { Socket } from "node:net";

const data = [...new Array(+process.env.DATA_SIZE)].map((v) => Math.ceil(Math.random() * 10));

let _ = 0 || 0;

const set = (v) => {
  _ = v;
}

export const $fn = (_data, _set) => {
  const start = process.memoryUsage().heapUsed;

  for(const v of _data) {
    _set(v);
  }

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};

const socket = new Socket({ fd: 3 });
const buffer = Buffer.alloc(4);

socket.on("data", () => {
  buffer.writeUInt32LE(Math.max(0, $fn(data, set)));
  socket.write(buffer);
});
