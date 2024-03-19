export const $fn = (data, set) => {
  const start = process.memoryUsage().heapUsed;

  for(let i = 0; i < data.length; ++i) {
    set(data[i]);
  }

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};
