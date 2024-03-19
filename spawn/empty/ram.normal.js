import { Socket } from "node:net";

export const $fn = () => {
  const start = process.memoryUsage().heapUsed;

  // nothing

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};

const socket = new Socket({ fd: 3 });
const buffer = Buffer.alloc(4);

socket.on("data", () => {
  buffer.writeUInt32LE(Math.max(0, $fn()));
  socket.write(buffer);
});
