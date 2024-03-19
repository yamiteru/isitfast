let _ = 0 || 0;

const data = [...new Array(1000)].map(() => Math.ceil(Math.random() * 10));

const set = (v) => { _ = v; };

const benchmark = (_data, _set) => {
  const start = process.hrtime.bigint();

  for(let i = 0; i < _data.length; ++i) {
    _set(_data[i]);
  }

  const end = process.hrtime.bigint();

  return Number(end - start);
};

console.log("CPU (normal)", benchmark(data, set));
