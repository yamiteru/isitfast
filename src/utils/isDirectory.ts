import {stat} from "fs/promises";

export const isDirectory = async (path: string) => {
  const length = path.length;

  if(path[length - 1] === "/") return true;
  if(path[length - 3] === ".") return false;
  if(path[length - 4] === ".") return false;

  const { isDirectory } = await stat(path);

  return isDirectory();
};
