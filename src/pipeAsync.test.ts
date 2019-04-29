import { pipeAsync, createPipeAsync } from "./pipeAsync";

describe("asyncPipe", () => {
  let asyncAddOne: jest.Mock<Promise<number>, [number]>;

  describe("pipeAsync", () => {
    beforeEach(() => {
      asyncAddOne = jest
        .fn()
        .mockImplementation(async (n: number): Promise<number> => n + 1);
    });

    it("does things async", async () => {
      const answer = await pipeAsync(1, asyncAddOne, asyncAddOne);

      expect(answer).toBe(3);

      expect(asyncAddOne).toHaveBeenCalledTimes(2);

      expect(asyncAddOne).toHaveBeenNthCalledWith(1, 1);
      expect(asyncAddOne).toHaveBeenNthCalledWith(2, 2);
    });

    it("works with a starting promise", async () => {
      const answer = await pipeAsync(
        Promise.resolve(1),
        asyncAddOne,
        asyncAddOne
      );

      expect(answer).toBe(3);

      expect(asyncAddOne).toHaveBeenCalledTimes(2);
    });
  });

  describe("createPipeAsync", () => {
    it("sets up an async function", async () => {
      const asyncAddTwo: (n: number) => Promise<number> = createPipeAsync(
        asyncAddOne,
        asyncAddOne
      );

      expect(await asyncAddTwo(1)).toBe(3);

      expect(asyncAddOne).toHaveBeenCalledTimes(2);

      expect(asyncAddOne).toHaveBeenNthCalledWith(1, 1);
      expect(asyncAddOne).toHaveBeenNthCalledWith(2, 2);
    });
  });
});
