const buffer = new ArrayBuffer(8, { maxByteLength: 128 });
const array = new Uint8Array(buffer);

export const $main = {
  $default: 0 || 0,
  $generator: function() {
    return Math.round(Math.random() * 128);
  },
  $function: function(value) {
    buffer.resize(value);
  }
};
