import {Directory} from "@types";
import {runFile} from "./runFile.js";

export async function runDirectory(directory: Directory) {
  // TODO: open directory

  for(const content of directory.content) {
    if(content.type === "directory") await runDirectory(content);
    else await runFile(content);
  }

  // TODO: close directory
}
