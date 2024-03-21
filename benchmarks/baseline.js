export const $baseline = {
  $generator: function() {
    return Math.round(Math.random() * 10);
  },
  $function: function(value, blackbox) {
    blackbox(value + value);
  }
};
