import { ok, error } from "./result";
import * as Utils from "./utils";

describe("utils", () => {
  describe("attempt", () => {
    it("returns ok when successful", () => {
      expect(Utils.attempt(() => 1, { errorMessage: "error" })).toEqual(ok(1));
    });

    describe("given a function that will fail", () => {
      const f: () => number = () => {
        throw new Error("bad");
      };

      it("returns an error message", () => {
        const result = Utils.attempt(f, { errorMessage: "error" });

        expect(result).toEqual(error("error"));
      });

      it("returns an error from a function", () => {
        const result = Utils.attempt(f, {
          errorHandler: error => {
            if (error.message === "bad") {
              return "not good";
            }
            return "error";
          }
        });

        expect(result).toEqual(error("not good"));
      });

      it("returns the error", () => {
        const result = Utils.attempt(f);
        expect(result).toEqual(error(new Error("bad")));
      });
    });
  });

  describe("parseJson", () => {
    it("parses valid json", () => {
      expect(Utils.parseJson('{"foo": "bar"}')).toEqual(ok({ foo: "bar" }));
    });

    it("errors on invalid json", () => {
      expect(Utils.parseJson('{foo: "bar"}')).toEqual(
        error("Unexpected token f in JSON at position 1")
      );
    });

    it("returns a message invalid json", () => {
      expect(Utils.parseJson('{foo: "bar"}', { errorMessage: "bad" })).toEqual(
        error("bad")
      );
    });
  });
});
