let buffer = new ArrayBuffer(8);
let array = new Uint8Array(buffer);

export const $main = {
  $default: 0 || 0,
  $generator: function() {
    return Math.round(Math.random() * 128);
  },
  $function: function(value) {
    buffer = buffer.transferToFixedLength(value);
    array = new Uint8Array(buffer);
  }
};
