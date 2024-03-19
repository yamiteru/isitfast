export const $forEach = {
  data: [
    () => [...new Array(10)].map(() => Math.random()),
    () => [...new Array(100)].map(() => Math.random()),
    () => [...new Array(1000)].map(() => Math.random()),
    () => [...new Array(10000)].map(() => Math.random())
  ],
  benchmark: (data, set) => {
    data.forEach((v) => set(v));
  }
};
