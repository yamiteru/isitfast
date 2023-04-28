import { Worker, parentPort } from "worker_threads";

const worker = new Worker(
  `
  postMessage("I'm working before postMessage('ali').");

  onmessage = (event) => {
    postMessage("hi", event.data);
  };
`,
  { eval: true },
);

parentPort?.on("message", () => console.log("msg"));

worker.postMessage("ali");
