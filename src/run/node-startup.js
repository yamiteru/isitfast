import { spawnprocess } from "./utils.js";

export const runNodeStartup = async () => {
  const { stream, kill } = spawnprocess();

  stream.on("data", async (buffer) => {
    // TODO: implement
  });
};
