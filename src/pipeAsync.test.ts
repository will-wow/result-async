import { pipeAsync, createPipeAsync } from "./pipeAsync";

describe("asyncPipe", () => {
  let asyncAddOne: jest.Mock<number, [number]>;

  describe("pipeAsync", () => {
    beforeEach(() => {
      asyncAddOne = jest
        .fn()
        .mockImplementation(async (n: number): Promise<number> => n + 1);
    });

    it("does things async", async () => {
      await pipeAsync(1, asyncAddOne, asyncAddOne);

      expect(asyncAddOne).toHaveBeenCalledTimes(2);

      expect(asyncAddOne).toHaveBeenNthCalledWith(1, 1);
      expect(asyncAddOne).toHaveBeenNthCalledWith(2, 2);
    });
  });

  describe("createPipeAsync", () => {
    it("sets up an async function", async () => {
      const asyncAddTwo = createPipeAsync(asyncAddOne, asyncAddOne);

      expect(await asyncAddTwo(1)).toBe(3);

      expect(asyncAddOne).toHaveBeenCalledTimes(2);

      expect(asyncAddOne).toHaveBeenNthCalledWith(1, 1);
      expect(asyncAddOne).toHaveBeenNthCalledWith(2, 2);
    });
  });
});
