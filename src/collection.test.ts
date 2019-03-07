import { ok, error } from "./result";
import { allOk, collectOks, firstOk } from "./collection";

describe("collection", () => {
  describe("allOk", () => {
    it("returns an :ok if all results are :ok", () => {
      expect(allOk([ok(1), ok(2), ok(3)])).toEqual(ok(null));
    });

    it("returns the first :error if any results are :error", () => {
      expect(allOk([ok(1), error(2), ok(3)])).toEqual(error(2));
    });
  });

  describe("collectOks", () => {
    it("returns all :ok messages if all results are :ok", () => {
      expect(collectOks([ok(1), ok(2), ok(3)])).toEqual(ok([1, 2, 3]));
    });

    it("returns the first :error if any results are :error", () => {
      expect(collectOks([ok(1), error(2), ok(3)])).toEqual(error(2));
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
