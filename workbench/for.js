const fn = {
  default: 0 || 0,
  data: [
    [...new Array(10)].map(() => Math.ceil(Math.random() * 10)),
    [...new Array(100)].map(() => Math.ceil(Math.random() * 10)),
    [...new Array(1000)].map(() => Math.ceil(Math.random() * 10)),
    [...new Array(10000)].map(() => Math.ceil(Math.random() * 10)),
    [...new Array(100000)].map(() => Math.ceil(Math.random() * 10)),
  ],
  benchmark: (data, set) => {
    for(let i = 0; i < data.length; ++i) {
      set(data[i]);
    }
  }
};
