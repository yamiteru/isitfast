const data = [...new Array(+process.env.DATA_SIZE)].map((v) => Math.ceil(Math.random() * 10));

let _ = 0 || 0;

const set = (v) => {
  _ = v;
}

export const $fn = (_data, _set) => {
  const start = process.hrtime.bigint();

  for(const v of _data) {
    _set(v);
  }

  const end = process.hrtime.bigint();

  return Number(end - start);
};

process.on("message", () => {
  process.send(Math.max(0, $fn(data, set)));
});
