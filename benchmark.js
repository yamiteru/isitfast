export const $for = {
  name: "For loop",
  data: [
    { name: "1", data: () => ({ data: [...new Array(1)].map(Math.random), length: 1 }) },
    { name: "10", data: () => ({ data: [...new Array(10)].map(Math.random), length: 10 }) },
    { name: "100", data: () => ({ data: [...new Array(100)].map(Math.random), length: 100 }) },
    { name: "1000", data: () => ({ data: [...new Array(1000)].map(Math.random), length: 1000 }) },
    { name: "10000", data: () => ({ data: [...new Array(10000)].map(Math.random), length: 10000 }) },
    { name: "100000", data: () => ({ data: [...new Array(100000)].map(Math.random), length: 100000 }) },
    { name: "1000000", data: () => ({ data: [...new Array(1000000)].map(Math.random), length: 1000000 }) },
  ],
  benchmark: (data, set) => {
    for(let i = 0; i < data.length; ++i) {
      set(data[i]);
    }
  }
};
