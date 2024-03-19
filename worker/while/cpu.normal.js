export const $fn = (data, set) => {
  const start = process.hrtime.bigint();

  let i = 0;
  while(i < data.length) {
    set(data[++i]);
  }

  const end = process.hrtime.bigint();

  return Number(end - start);
};
