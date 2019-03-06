import { ok, error, isOk, isError, isResult } from "./types";

describe("types", () => {
  const okThing = ok(1);
  const errorThing = error(1);

  it("detects oks", () => {
    expect(isOk(okThing)).toBe(true);
    expect(isError(okThing)).toBe(false);
  });

  it("detects errors", () => {
    expect(isError(errorThing)).toBe(true);
    expect(isOk(errorThing)).toBe(false);
  });

  it("detects results", () => {
    expect(isResult(okThing)).toBe(true);
    expect(isResult(errorThing)).toBe(true);
    expect(isResult({ foo: "bar" })).toBe(false);
  });
});
