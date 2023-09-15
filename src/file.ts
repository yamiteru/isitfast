import { createWriteStream, WriteStream } from "node:fs";
import { write } from "fs";
import { open } from "fs/promises";
import { Nullable } from "ueve";

let stream: Nullable<WriteStream>;
let current_path: Nullable<string>;

export const ENCODER = new TextEncoder();

export enum Mode {
  sync,
  async,
}

export function assert_stream(stream: unknown): asserts stream is WriteStream {
  if (stream === null) {
    throw Error("Stream not found");
  }
}

export function assert_string(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw Error("Value should be string");
  }
}

export const open_file = (path: string) => {
  stream = createWriteStream(path, "binary");
  current_path = path;
};

export const close_file = async () => {
  await close();
  stream = null;
};

export const close = () =>
  new Promise((resolve) => {
    assert_stream(stream);
    stream.close(resolve);
  });

export const write_stream = (value: Uint8Array) =>
  new Promise((resolve) => {
    assert_stream(stream);
    stream.write(value, "binary", resolve);
  });

export const write_u8 = async (value: number) => {
  await write_stream(Uint8Array.of(value));
};

export const write_u32 = async (value: number) => {
  await write_stream(new Uint8Array(Uint32Array.of(value).buffer));
};

export const write_string = async (value: string) => {
  const byteArray = ENCODER.encode(value);

  await write_u8(byteArray.byteLength);
  await write_stream(byteArray);
};

export const write_benchmark = async (name: string, mode: Mode) => {
  await write_string(name);
  await write_u8(mode);
};

export const write_run = async (value: number) => {
  await write_u8(value);
};

export const write_case = async (name: string) => {
  await write_string(name);
};

export const write_data_init = async () => {
  await write_u8(0);
};

export const write_data_value = async (value: number) => {
  await write_u32(value);
};

export const write_file = async (value: Buffer, position: number) =>
  new Promise(async (resolve) => {
    assert_string(current_path);
    write(
      (await open(current_path)).fd,
      value,
      0,
      value.byteLength,
      position,
      resolve,
    );
  });

export const write_data_count = async (count: number) => {
  assert_stream(stream);
  await write_file(
    Buffer.from(Uint8Array.of(count)),
    // * 4 because uint32 -> uint8
    stream.bytesWritten - count * 4,
  );
};
