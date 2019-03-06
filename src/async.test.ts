import { ok, error } from "./types";
import { promiseToResult, resultify } from "./async";

describe("Result", () => {
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
