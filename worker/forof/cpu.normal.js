export const $fn = (data, set) => {
  const start = process.hrtime.bigint();

  for(const v of data) {
    set(v);
  }

  const end = process.hrtime.bigint();

  return Number(end - start);
};
