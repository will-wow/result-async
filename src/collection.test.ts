import { ok, error } from "./result";
import { allOk, allOkAsync, firstOk } from "./collection";

describe("collection", () => {
  describe("allOk", () => {
    it("returns all :ok messages if all results are :ok", () => {
      expect(allOk([ok(1), ok(2), ok(3)])).toEqual(ok([1, 2, 3]));
    });

    it("returns the first :error if any results are :error", () => {
      expect(allOk([ok(1), error(2), error(3), ok(4)])).toEqual(error(2));
    });
  });

  describe("allOkAsync", () => {
    it("returns all ok messages if all results are ok", async () => {
      expect(
        await allOkAsync([
          Promise.resolve(ok(1)),
          Promise.resolve(ok(2)),
          Promise.resolve(ok(3))
        ])
      ).toEqual(ok([1, 2, 3]));
    });

    it("returns the first error if any results are error", async () => {
      expect(
        await allOkAsync([
          Promise.resolve(ok(1)),
          Promise.resolve(error(2)),
          Promise.resolve(ok(3))
        ])
      ).toEqual(error(2));
    });

    it("returns the first error if any promises are rejected", async () => {
      expect(
        await allOkAsync([
          Promise.resolve(ok(1)),
          Promise.reject(ok(2)),
          Promise.resolve(ok(3))
        ])
      ).toEqual(error(ok(2)));
    });
  });

  describe("firstOk", () => {
    it("finds an OK", () => {
      const results = [error(1), ok(2), ok(3)];
      expect(firstOk(results)).toEqual(ok(2));
    });

    it("doesn't find an ok", () => {
      const results = [error(1), error(2), error(3)];
      expect(firstOk(results)).toEqual(error(null));
    });
  });
});
