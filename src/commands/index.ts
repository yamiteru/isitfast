import { FunctionComponent } from "react";
import { inspect } from "./inspect.js";

export type CommandProps = {
  input: string[];
  flags: Record<string, unknown>
};

export type Command = FunctionComponent<CommandProps>;

export type Commands = Record<string, Command>;

export const COMMANDS = {
  inspect,
} satisfies Commands;
