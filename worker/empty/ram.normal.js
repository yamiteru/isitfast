export const $fn = () => {
  const start = process.memoryUsage().heapUsed;

  // nothing

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};
