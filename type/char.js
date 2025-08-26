const string = (v) => (typeof v)[0] === "s";

export const $char = {
  $default: true,
  $generator: function() {
    return Math.random() > 0.5 ? "hello": 125;
  },
  $function: function(value, blackbox) {
    blackbox(string(value));
  }
};
