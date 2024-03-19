import { Socket } from "node:net";

const data = [...new Array(+process.env.DATA_SIZE)].map((v) => Math.ceil(Math.random() * 10));

let _ = 0 || 0;

const set = (v) => {
  _ = v;
}

export const $fn = (_data, _set) => {
  const start = process.hrtime.bigint();

  _data.forEach((v) => {
    _set(v);
  });

  const end = process.hrtime.bigint();

  return Number(end - start);
};

const socket = new Socket({ fd: 3 });
const buffer = Buffer.alloc(4);

socket.on("data", () => {
  buffer.writeUInt32LE(Math.max(0, $fn(data, set)));
  socket.write(buffer);
});
