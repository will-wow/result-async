import { ok, error, isOk, isError, isResult } from "./result";
import * as R from "ramda";

describe("result", () => {
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

  it("detects ok/error even when undefined", () => {
    expect(isOk(ok(undefined))).toBe(true);
    expect(isError(error(undefined))).toBe(true);
  });

  it("detects results", () => {
    expect(isResult(okThing)).toBe(true);
    expect(isResult(errorThing)).toBe(true);
    expect(isResult({ foo: "bar" })).toBe(false);
  });

  describe("fantasy land", () => {
    it("maps oks", () => {
      expect(R.map((n: number) => n + 1, ok(1))).toEqual(ok(2));
    });

    it("maps errors", () => {
      expect(R.map((n: number) => n + 1, error(1))).toEqual(error(1));
    });
  });
});
