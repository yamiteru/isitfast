import { stat } from "fs/promises";

export const isDirectory = async (path: string) => {
  if (path.at(-1) === "/") return true;
  if (path.at(-3) === ".") return false;
  if (path.at(-4) === ".") return false;

  const { isDirectory } = await stat(path);

  return isDirectory();
};
