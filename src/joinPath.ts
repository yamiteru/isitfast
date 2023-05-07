export function joinPath(...paths: string[]) {
  let path = "";

  for (let i = 0; i < paths.length; ++i) {
    if (i === 0 || path.at(-1) === "/") path += paths[i];
    else path += `/${paths[i]}`;
  }

  return path;
}
