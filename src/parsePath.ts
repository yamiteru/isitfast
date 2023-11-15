export type ParsedFile = {
  path: string;
  folders: string[];
  filename: string;
  type: string;
  name: string;
};

export const parsePath = (path: string): ParsedFile => {
  const split = path.split("/");
  const folders = split.slice(0, split.length - 1);
  const filename = split.at(-1) as string;
  const type = filename.split(".").at(-1) as string;
  const name = filename.split(".")[0] as string;

  return {
    path,
    folders,
    filename,
    type,
    name,
  };
};
