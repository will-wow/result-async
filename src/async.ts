import { Result, ok, error, isOk, isError } from "./result";

export type ResultP<OkData, ErrorMessage> = Promise<
  Result<OkData, ErrorMessage>
>;

/**
 * Chains together async operations that may succeed or fail
 *
 * Takes a Result and a mapping function.
 * If the result is an Ok, applies the function to the data.
 * If the result is an Error, passes the Result through unchanged.
 *
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 * @returns - The Result from function f or the Error
 */
export function asyncChainOk<OkData, ErrorMessage, OkOutput, ErrorOutput>(
  f: (ok: OkData) => ResultP<OkOutput, ErrorOutput>
) {
  return async (
    result: Result<OkData, ErrorMessage>
  ): ResultP<OkOutput, ErrorMessage | ErrorOutput> => {
    if (isError(result)) {
      return result;
    }

    return f(result.ok);
  };
}

/**
 * Chains together async operations that may succeed or fail
 *
 * Takes a Result and a mapping function.
 * If the result is an Error, applies the function to the data and returns the new promise-wrapped result.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * @param f - the function to run on the error message
 * @param result - The result to match against
 * @returns - The Result from function f or the Ok result
 */
export const asyncChainError = <OkData, ErrorMessage, OkOutput, ErrorOutput>(
  f: (ok: ErrorMessage) => ResultP<OkOutput, ErrorOutput>
) => async (
  result: Result<OkData, ErrorMessage>
): ResultP<OkData | OkOutput, ErrorOutput> => {
  if (isOk(result)) {
    return result;
  }

  return f(result.error);
};

/**
 * Awaits a promise, and returns a result based on the outcome
 * @param promise
 * @returns Ok if the promise resolved, Error if it was rejected.
 */
export const promiseToResult = <OkData, ErrorMessage>(
  promise: Promise<OkData>
): ResultP<OkData, ErrorMessage> => promise.then(ok).catch(error);

/**
 * Converts a function that returns a promise to one that always resolved to a Result
 * @param f A function that returns a promise
 * @returns a resolved Ok if the the promise resolved, a resolved Error if the promise was rejected.
 */
export function resultify<Args extends any[], OkData, ErrorMessage = any>(
  f: (...args: Args) => Promise<OkData>
) {
  return (...args: Args): ResultP<OkData, ErrorMessage> =>
    promiseToResult(f(...args));
}
