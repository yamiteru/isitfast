export const $fn = (data, set) => {
  const start = process.hrtime.bigint();

  for(let i = 0; i < data.length; ++i) {
    set(data[i]);
  }

  const end = process.hrtime.bigint();

  return Number(end - start);
};
