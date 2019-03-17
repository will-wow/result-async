import { ok, error, Result } from "./result";
import {
  promiseToResult,
  resultify,
  ResultP,
  okChainAsync,
  errorRescueAsync
} from "./async";

type TestCase = [
  Result<any, any>,
  (arg: any) => (result: Result<any, any>) => ResultP<any, any>,
  any,
  Result<any, any>
];

const asyncAdd1Ok = (n: number) => Promise.resolve(ok(n + 1));
const asyncAdd1Error = (n: number) => Promise.resolve(error(n + 1));

describe("async", () => {
  describe("mappers", () => {
    const testCases: TestCase[] = [
      [ok(1), okChainAsync, asyncAdd1Ok, ok(2)],
      [ok(1), okChainAsync, asyncAdd1Error, error(2)],
      [error(1), okChainAsync, asyncAdd1Ok, error(1)],
      [ok(1), errorRescueAsync, asyncAdd1Ok, ok(1)],
      [error(1), errorRescueAsync, asyncAdd1Ok, ok(2)]
    ];

    testCases.map(([result, testedFunction, f, expected]) => {
      it(`uses ${
        testedFunction.name
      } to change ${result.toString()} to ${expected.toString()}`, async () => {
        expect(await testedFunction(f)(result)).toEqual(expected);
      });
    });
  });

  describe("promiseToResult", () => {
    it("converts a resolved promise to an ok", async () => {
      const promise = Promise.resolve(1);

      const result = await promiseToResult(promise);

      expect(result).toEqual(ok(1));
    });

    it("converts a rejected promise to an error", async () => {
      const promise = Promise.reject("bad");

      const result = await promiseToResult(promise);

      expect(result).toEqual(error("bad"));
    });
  });

  describe("resultify", () => {
    it("wraps resolved returns", async () => {
      const asyncAdd = (a: number, b: number) => Promise.resolve(a + b);
      const resultifiedAdd = resultify(asyncAdd);

      const result = await resultifiedAdd(1, 2);

      expect(result).toEqual(ok(3));
    });

    it("wraps rejected returns", async () => {
      const asyncAdd = (_a: number, _b: number) => Promise.reject("bad");
      const resultifiedAdd = resultify(asyncAdd);

      const result = await resultifiedAdd(1, 2);

      expect(result).toEqual(error("bad"));
    });
  });
});
