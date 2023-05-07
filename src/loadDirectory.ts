import { readdir } from "fs/promises";
import { pub } from "ueve/async";
import {$directoryOpen, $directoryClose} from "./events.js";
import {isDirectory} from "./isDirectory.js";
import {joinPath} from "./joinPath.js";
import { loadFile } from "./loadFile.js";
import {Directory, Content} from "./types.js";

export const loadDirectory = async (
  root: string,
  input: string[],
): Promise<Directory> => {
  const name = root.split("/").at(root.at(-1) === "/" ? -2 : -1) as string;
  const promises: Promise<Content>[] = [];

  await pub($directoryOpen, { root, input });

  for (let i = 0; i < input.length; ++i) {
    const path = joinPath(root, input[i]);

    if (await isDirectory(path)) {
      promises.push(
        new Promise<Directory>(async (resolve) => {
          const files = await readdir(path);
          const folder = await loadDirectory(path, files);

          resolve(folder);
        }),
      );
    } else {
      promises.push(loadFile(path) as any);
    }
  }

  const content = await Promise.all(promises);

  await pub($directoryClose, { root, input });

  return {
    type: "directory",
    name,
    path: root,
    content,
  };
};
