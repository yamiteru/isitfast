export const $main = {
  $default: 0 || 0,
  $generator: function() {
    return {
      a: Math.round(Math.random() * 10),
      b: Math.round(Math.random() * 10),
      c: Math.round(Math.random() * 10),
      d: Math.round(Math.random() * 10),
      e: Math.round(Math.random() * 10),
      f: Math.round(Math.random() * 10),
      g: Math.round(Math.random() * 10),
      h: Math.round(Math.random() * 10),
      i: Math.round(Math.random() * 10),
      j: Math.round(Math.random() * 10),
    };
  },
  $function: function(value, blackbox) {
    const keys = Object.keys(value);
    let sum = 0;

    for (let i = 0; i < keys.length; ++i) {
      sum += value[keys[i]];
    }

    blackbox(sum);
  }
};
