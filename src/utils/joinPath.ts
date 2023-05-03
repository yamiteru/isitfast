export function joinPath(...paths: string[]) {
  let path = "";

  for (let i = 0; i < paths.length; ++i) {
    if (path.at(-1) === "/") path += paths[i];
    else path += `/${paths[i]}`;
  }

  return path;
}
