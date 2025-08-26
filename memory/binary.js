const fn = (data, start, end) => {
  const max = end - start;

  for (let i = 0; i < (24 - max); ++i) {
    if((data & (((1 << max) - 1) << (24 - max - start)) === 0)) {
      return i;
    }
  }

  return -1;
};

export const $main = {
  $default: 0 || 0,
  $generator: function() {
    let data = 0b000000000000000000000000;

    for (let i = 0; i < 24; ++i) {
      if (Math.random() > 0.5) {
        data |= (1 << i);
      }
    }

    return {
      data,
      start: Math.ceil(Math.random() * 8),
      end: Math.ceil(Math.random() * 16) + 8,
    };
  },
  $function: function(value, blackbox) {
    blackbox(fn(value.data, value.start, value.end));
  }
};
