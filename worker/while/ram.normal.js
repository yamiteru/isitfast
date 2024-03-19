export const $fn = (data, set) => {
  const start = process.memoryUsage().heapUsed;

  let i = 0;
  while(i < data.length) {
    set(data[++i]);
  }

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};
