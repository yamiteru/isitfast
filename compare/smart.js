const fn = (v) => v - (10 + ((((v - 15) >>> 31) ^ 1) & 1) * 5);

export const $main = {
  $default: 0,
  $generator: function() {
    return Math.floor(Math.random() * 17);
  },
  $function: function(value, blackbox) {
    blackbox(fn(value));
  }
};
