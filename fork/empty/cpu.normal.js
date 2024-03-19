export const $fn = () => {
  const start = process.hrtime.bigint();

  // nothing

  const end = process.hrtime.bigint();

  return Number(end - start);
};

process.on("message", () => {
  process.send(Math.max(0, $fn()));
});
