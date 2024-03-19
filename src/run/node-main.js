import { spawnprocess } from "./utils.js";

export const runNodeMain = async () => {
  const { stream, kill } = spawnprocess();

  stream.on("data", async (buffer) => {
    // TODO: implement
  });
};
