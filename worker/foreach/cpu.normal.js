export const $fn = (data, set) => {
  const start = process.hrtime.bigint();

  data.forEach((v) => {
    set(v);
  });

  const end = process.hrtime.bigint();

  return Number(end - start);
};
