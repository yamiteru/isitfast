import { Socket } from "node:net";

export const $fn = () => {
  const start = process.hrtime.bigint();

  // nothing

  const end = process.hrtime.bigint();

  return Number(end - start);
};

const socket = new Socket({ fd: 3 });
const buffer = Buffer.alloc(4);

socket.on("data", () => {
  buffer.writeUInt32LE(Math.max(0, $fn()));
  socket.write(buffer);
});
