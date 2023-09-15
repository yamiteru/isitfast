# Brainstorming

## Binary file



## CLI

- [ ] `isitfast inspect index.bench.js`
  - Interactively choose benchmark
  - Select mode (cpu/ram/download/parse)
  - Select which dataset to run
  - Inifnitely run selected combination
  - See real-time results in a graph
  - Capture and save all results

- [ ] `isitfast summary index.isitfast`
  - Prints graph of the data (modes separately)
  - Prints stats for each big change in the data
  - Prints the type of result (decreasing, increasing, etc.)

- [ ] `isitfast compare foreach.isitfast for.isitfast forof.isitfast while.isitfast`
  - Prints graph of all the data (modes separately)
  - Prints which one is best in each mode (+ contextual stats depending on each mode)
  - Print out which benchmark scored the most across all modes (but ultimately determining the "best" is kind of hard)

- [ ] `isitfast to csv/json foreach.isitfast`
  - Converts custom binary `.isitfast` format to csv/json

- [ ] `isitfast from foreach.isitfast.csv/json`
  - Converts csv/json to custom binary `.isitfast` format

- [ ] `isitfast noise`
  - Collects noise profile for cpu/ram modes

- [ ] `isitfast run ./src`
  - Recursively runs all benchmarks in all `.bench` files
  - Does real-time statistics to figure out when to stop running benchmarks
  - Saves results into `.isitfast` files
  - Prints out stats overview of all benchmarks

## Nice to have

- Execution of js/jsx/ts/tsx files
- `compare` compares all files in directory
- `to csv/json` converts all files in directory
- `from` converts all files in directory
- `run` runs all files in directory
- `inspect`/`summary`/`compare` can use names/paths to benchmarks (eg. `foreach`/`loops/foreach`)
- Distinguish between files where benchmarks should be compared and files where there's just multiple of different benchmarks that should not be compared
- `summary`/`compare`/`run` can use generated profile and/or generate it if it doesn't exist yet
- `inspect` can inspect system noise






