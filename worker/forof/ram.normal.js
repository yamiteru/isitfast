export const $fn = (data, set) => {
  const start = process.memoryUsage().heapUsed;

  for(const v of data) {
    set(v);
  }

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};
