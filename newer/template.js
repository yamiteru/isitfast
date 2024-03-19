"use strict";

import { Socket as socket_class } from "node:net";

const benchmark = () => {};

const socket_instance = new socket_class({ fd: 3, readable: true, writable: true });
const buffer = Buffer.alloc(32);

const generator = () => {};

let tmp = 0;

function blackbox(v) {
  tmp = v;
}

function socket_fn() {
  const data = generator();

  buffer.writeUInt32LE(1, 0);

  buffer.writeBigUInt64LE(process.hrtime.bigint(), 4);
  buffer.writeUInt32LE(process.memoryUsage().heapUsed, 20);

  benchmark(data, blackbox);

  buffer.writeUInt32LE(process.memoryUsage().heapUsed, 24);
  buffer.writeBigUInt64LE(process.hrtime.bigint(), 12);

  socket_instance.write(buffer);
}

socket_instance.on("data", socket_fn);

buffer.writeUInt8(0, 0);
socket_instance.write(buffer);
