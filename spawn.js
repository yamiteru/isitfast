import { spawn } from "node:child_process";

const proc = spawn(
  "node",
  ["hello.js"],
  { stdio: ['pipe','pipe','pipe','pipe'] }
);

proc.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

proc.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

proc.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

console.log(proc);
