export const $main = {
  $default: {},
  $generator: function() {
    return [...new Array(50)].map(() => [
      `${Math.random() * 100 * Math.random() * 100}`,
      `${Math.random() * 100 * Math.random() * 100}`
    ]);
  },
  $function: function(value, blackbox) {
    blackbox(Object.fromEntries(value));
  }
};
