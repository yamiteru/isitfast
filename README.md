# TS Package 

Template for creating publishable TypeScript package. It uses SWC for compilation.

## TODOs

- [ ] Implement output mode

- [ ] Add ability to stop benchmark execution after N ms
- [ ] Add ability to stop benchmark execution after N iterations
- [ ] Clean up and restructure/refactor the codebase
- [ ] Figure out ways to optimize the lib
- [ ] Optimize the code (the less users have to wait the better) 
- [ ] Create examples (should also work as tests)

- [ ] Write docs
- [ ] Compare this lib to other libs (definitely against benchmark.js)
- [ ] Publish alpha version

## Notes

- It should probably have a static and interactive mode
	- Static mode should be the main focus
	- I should design TUI for the interactive mode

## Interactive mode

- Shows real-time data from all benchmark iterations
- It should have different "screen" per each benchmark
- I can switch between different screens
- I should be able to also show all results in one big graph
- I should be able to re-run a benchmark from the TUI
- The re-run data should be merged instead of using the latest (maybe??)
- The cold part should have different color from the hot results

## Static mode

- Shows real-time data but can't use keyboard
- Doesn't show a graph, only the basic info
- Should be clear what is happening and why is user waiting

## Output mode

- Outputs markdown into a file
- Data should be in a table with all important data
- If possible should generate SVG graphs and include them into the markdown file
