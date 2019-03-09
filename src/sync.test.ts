import { ok, error, Result } from "./result";
import {
  errorOrThrow,
  okOrThrow,
  chainError,
  chainOk,
  either,
  ifError,
  ifOk,
  replaceError,
  replaceOk,
  resultToBoolean
} from "./sync";

const add1 = (n: number) => n + 1;
const subtract1 = (n: number) => n - 1;
const add1Ok = (n: number) => ok(n + 1);
const add1Error = (n: number) => error(n + 1);

type TestCase = [
  Result<any, any>,
  (arg: any) => (result: Result<any, any>) => Result<any, any>,
  any,
  Result<any, any>
];

describe("mappers", () => {
  const testCases: TestCase[] = [
    [ok(1), ifOk, add1, ok(2)],
    [error(1), ifOk, add1, error(1)],
    [ok(1), ifError, add1, ok(1)],
    [error(1), ifError, add1, error(2)],
    [ok(1), chainOk, add1Ok, ok(2)],
    [ok(1), chainOk, add1Error, error(2)],
    [error(1), chainOk, add1Ok, error(1)],
    [ok(1), chainError, add1Ok, ok(1)],
    [error(1), chainError, add1Ok, ok(2)],
    [error(1), chainError, add1Error, error(2)],
    [ok(1), replaceOk, "good", ok("good")],
    [error(1), replaceOk, "good", error(1)],
    [ok(1), replaceError, "bad", ok(1)],
    [error(1), replaceError, "bad", error("bad")]
  ];

  testCases.map(([result, testedFunction, f, expected]) => {
    it(`uses ${
      testedFunction.name
    } to change ${result.toString()} to ${expected.toString()}`, () => {
      expect(testedFunction(f)(result)).toEqual(expected);
    });
  });
});

describe("sync", () => {
  it("wraps with ok", () => {
    expect(ok(1)).toEqual(ok(1));
  });

  it("wraps an error", () => {
    expect(error(1)).toEqual(error(1));
  });

  describe("resultToBoolean", () => {
    it("converts ok to true", () => {
      expect(resultToBoolean(ok(1))).toBe(true);
    });

    it("converts error to false", () => {
      expect(resultToBoolean(error(1))).toBe(false);
    });
  });

  describe("either", () => {
    it("runs the ok function", () => {
      expect(either(ok(0), add1, subtract1)).toBe(1);
    });

    it("runs the error function", () => {
      expect(either(error(0), add1, subtract1)).toBe(-1);
    });

    it("raises on invalid input", () => {
      const badResult: any = { foo: "bar" };
      expect(() => either(badResult, add1, subtract1)).toThrow();
    });
  });

  describe("okOrThrow", () => {
    it("returns an ok payload", () => {
      expect(okOrThrow(ok(1))).toBe(1);
    });

    it("throws on an error", () => {
      expect(() => okOrThrow(error("bad"))).toThrow("bad");
    });
  });

  describe("errorOrThrow", () => {
    it("returns an error message", () => {
      expect(errorOrThrow(error(1))).toBe(1);
    });

    it("throws on an error", () => {
      expect(() => errorOrThrow(ok("good"))).toThrow("good");
    });
  });
});
