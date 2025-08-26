const fn = (a, b, c, d) => {
  return a + b + c + d;
};

export const $main = {
  $default: 0 || 0,
  $generator: function() {
    return {
      a: Math.round(Math.random() * 10),
      b: Math.round(Math.random() * 10),
      c: Math.round(Math.random() * 10),
      d: Math.round(Math.random() * 10),
    };
  },
  $function: function(value, blackbox) {
    blackbox(fn(value.a, value.b, value.c, value.d));
  }
};
