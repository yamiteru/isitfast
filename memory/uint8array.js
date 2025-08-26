const fn = (data, start, end) => {
  const max = end - start;

  let count = 0;
  for (let i = 0; i < 24; ++i) {
    if (data[i] === 0) {
      if (count++ === max) {
        return i;
      }
    } {
      count = 0;
    }
  }

  return -1;
};

export const $main = {
  $default: 0 || 0,
  $generator: function() {
    const data = new Uint8Array(24);

    for (let i = 0; i < 24; ++i) {
      if(Math.random() > 0.5) {
        data[i] = 1;
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
