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
export function okChainAsync<OkData, ErrorMessage, OkOutput, ErrorOutput>(
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
export const errorRescueAsync = <OkData, ErrorMessage, OkOutput, ErrorOutput>(
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
 * Runs a function for side effects on the payload, only if the result is Ok.
 *
 * @param f - the async function to run on the ok data
 * @param result - The result to match against
 * @returns A promise of the the original result
 *
 * ```javascript
 * okDo(console.log, ok("hi")) // Logs "hi"
 * okDo(console.log, error(1)) // No log
 * ```
 */
export function okDoAsync<OkData, ErrorMessage>(f: (ok: OkData) => any) {
  return async function(
    result: Result<OkData, ErrorMessage>
  ): ResultP<OkData, ErrorMessage> {
    if (isOk(result)) {
      await f(result.ok);
    }
    return result;
  };
}

/**
 * Runs a function for side effects on the payload, only if the result is Error. Waits for the side effect to complete before returning.
 *
 * @param f - the function to run on the error message
 * @param result - The result to match against
 * @returns a promise of the original Result
 *
 * ```javascript
 * errorDo(console.error)(ok("hi")) // No log
 * errorDo(console.error)(error(1)) // Logs 1
 * ```
 */
export function errorDoAsync<OkData, ErrorMessage>(
  f: (ok: ErrorMessage) => any
) {
  return async function(
    result: Result<OkData, ErrorMessage>
  ): ResultP<OkData, ErrorMessage> {
    if (isError(result)) {
      await f(result.error);
    }
    return result;
  };
}

/**
 * Awaits a promise, and returns a result based on the outcome
 * @param promise
 * @returns Ok if the promise resolved, Error if it was rejected.
 */
export function promiseToResult<OkData>(
  promise: Promise<OkData>
): ResultP<OkData, any> {
  return promise.then(ok).catch(error);
}

/**
 * Converts a function that returns a promise to one that always resolved to a Result
 * @param f A function that returns a promise
 * @returns a resolved Ok if the the promise resolved, a resolved Error if the promise was rejected.
 */
export function resultify<Args extends any[], OkData>(
  f: (...args: Args) => Promise<OkData>
) {
  return function(...args: Args): ResultP<OkData, any> {
    return promiseToResult(f(...args));
  };
}
