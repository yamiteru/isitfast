import { Socket } from "node:net";

const _data = [...new Array(+process.env.DATA_SIZE)].map((v) => Math.ceil(Math.random() * 10));

let _ = 0 || 0;

const _set = (v) => {
  _ = v;
}

export const $fn = (data, set) => {
  const start = process.hrtime.bigint();

  for(let i = 0; i < data.length; ++i) {
    set(data[i]);
  }

  const end = process.hrtime.bigint();

  return Number(end - start);
};

const socket = new Socket({ fd: 3 });
const buffer = Buffer.alloc(4);

socket.on("data", () => {
  buffer.writeUInt32LE(Math.max(0, $fn(_data, _set)), 0);
  socket.write(buffer);
});
