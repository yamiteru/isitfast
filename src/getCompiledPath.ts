import { join } from "path";
import { COMPILE_FOLDER } from "./constants.js";
import { CompiledProps } from "./types.js";

export const getCompiledPath = ({ mode, file, benchmark }: CompiledProps) =>
  join(
    COMPILE_FOLDER,
    `${file.folders.join("/")}/${file.name}-${benchmark.variable}-${mode}.${
      file.type
    }`,
  );
