let _ = 0 || 0;

const data = [...new Array(1000)].map(() => Math.ceil(Math.random() * 10));

const set = (v) => { _ = v; };

const benchmark = (_data, _set) => {
  const start = process.memoryUsage().heapUsed;

  for(let i = 0; i < _data.length; ++i) {
    _set(_data[i]);
  }

  const end = process.memoryUsage().heapUsed;

  return Number(end - start);
};

%NeverOptimizeFunction(benchmark);

console.log("CPU (deopt)", benchmark(data, set));
