import { Either, Fn } from "@types";

export function isAsync<$Props extends unknown[], $Return>(
  fn: Either<[Fn<$Props, $Return>, Fn<$Props, Promise<$Return>>]>,
): fn is Fn<$Props, Promise<$Return>> {
  return (
    fn?.constructor?.name === "AsyncFunction" ||
    (typeof fn === "function" &&
      typeof fn === "object" &&
      typeof (fn as any).then === "function") ||
    fn instanceof Promise
  );
}
