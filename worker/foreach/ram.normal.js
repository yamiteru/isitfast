export const $fn = (data, set) => {
  const start = process.memoryUsage().heapUsed;

  data.forEach((v) => {
    set(v);
  });

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};
