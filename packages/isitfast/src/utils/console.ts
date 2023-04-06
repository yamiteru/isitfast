export const writeLine = (value: string) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(value);
};

export const newLine = () => console.log();
