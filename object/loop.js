export const $main = {
  $default: {},
  $generator: function() {
    return [...new Array(50)].map(() => [
      `${Math.random() * 100 * Math.random() * 100}`,
      `${Math.random() * 100 * Math.random() * 100}`
    ]);
  },
  $function: function(value, blackbox) {
    const res = {};

    for (let i = 0; i < value.length; ++i) {
      res[value[0]] = value[1];
    }

    blackbox(res);
  }
};
