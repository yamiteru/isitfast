const data = [...new Array(+process.env.DATA_SIZE)].map((v) => Math.ceil(Math.random() * 10));

let _ = 0 || 0;

const set = (v) => {
  _ = v;
}

export const $fn = (_data, _set) => {
  const start = process.memoryUsage().heapUsed;

  let i = 0;
  while(i < _data.length) {
    _set(_data[++i]);
  }

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};

process.on("message", () => {
  process.send(Math.max(0, $fn(data, set)));
});
