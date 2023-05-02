import {Directory} from "@types";
import {runFile} from "./runFile.js";

export async function runDirectory(directory: Directory) {
  for(const content of directory.content) {
    if(content.type === "directory") await runDirectory(content);
    else await runFile(content);
  }
}
