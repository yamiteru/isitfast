export const $baseline = {
  $default: 0 || 0,
  $generator: function() {
    return Math.round(Math.random() * 10);
  },
  $function: function(value, blackbox) {
    blackbox(value + value);
  }
};
