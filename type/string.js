const string = (v) => typeof v === "string";

export const $string = {
  $default: true,
  $generator: function() {
    return Math.random() > 0.5 ? "hello": 125;
  },
  $function: function(value, blackbox) {
    blackbox(string(value));
  }
};
