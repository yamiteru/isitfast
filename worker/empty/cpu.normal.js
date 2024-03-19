export const $fn = () => {
  const start = process.hrtime.bigint();

  // nothing

  const end = process.hrtime.bigint();

  return Number(end - start);
};
