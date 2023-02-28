import { add } from "../src";

describe("Add", () => {
  it("should add two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });

  it("should add multiple numbers", () => {
    expect(add(1, 2, 3, 4)).toBe(10);
  });
});
