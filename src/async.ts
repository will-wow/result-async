import { Result, ok, error, isOk, isError } from "./result";

/**
 * A Result, wrapped in a promise. The promise should never be rejected,
 * and should always resolve to an Ok or Error.
 */
export type ResultP<OkData, ErrorMessage> = Promise<
  Result<OkData, ErrorMessage>
>;
// Solves an error with returning ResultP from an async function.
// tslint:disable-next-line:variable-name
export const ResultP = Promise;

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
 *
 * ```javascript
 * pipeA
 *   (fetchUser())
 *   (okChainAsync(user => fetchComments(user.id)))
 *   (okDo(comments => console.log('total comments:', comments.length))
 *   .value
 * ```
 */
export function okChainAsync<OkData, OkOutput, ErrorOutput>(
  f: (ok: OkData) => ResultP<OkOutput, ErrorOutput>
) {
  return async function<ErrorMessage>(
    result: Result<OkData, ErrorMessage>
  ): ResultP<OkOutput, ErrorMessage | ErrorOutput> {
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
 *
 * ```javascript
 * const fetchData = () => fetch("https://example.com/data");
 * pipeA
 *   (getCachedData)
 *   (errorRescueAsync(fetchData))
 *   (okThen(transformData))
 *   .value
 * ```
 */
export function errorRescueAsync<ErrorMessage, OkOutput, ErrorOutput>(
  f: (ok: ErrorMessage) => ResultP<OkOutput, ErrorOutput>
) {
  return async function<OkData>(
    result: Result<OkData, ErrorMessage>
  ): ResultP<OkData | OkOutput, ErrorOutput> {
    if (isOk(result)) {
      return result;
    }

    return f(result.error);
  };
}

/**
 * Runs a function for side effects on the payload, only if the result is Ok.
 *
 * @param f - the async function to run on the ok data
 * @param result - The result to match against
 * @returns A promise of the the original result
 *
 * ```javascript
 * pipeA(
 *   (fetchData)
 *   // Saves to cache, and awaits completion before moving on.
 *   (okDoAsync(saveToCache))
 *   (okThen(transformData))
 * ```
 */
export function okDoAsync<OkData>(f: (ok: OkData) => any) {
  return async function<ErrorMessage>(
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
 * pipeA(
 *   (fetchData)
 *   // Logs an error, and awaits completion before moving on.
 *   (errorDoAsync(logError))
 *   (okThen(transformData))
 * ```
 */
export function errorDoAsync<ErrorMessage>(f: (ok: ErrorMessage) => any) {
  return async function<OkData>(
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
 *
 * Note that the Error case isn't typesafe, since promises don't have an
 * error type, just a success one. It's probably a good idea to use a
 * `errorThen` or `errorReplace` to handle errors and soon as possible.
 *
 * @param promise
 * @returns Ok if the promise resolved, Error if it was rejected.
 *
 * ```javascript
 * pipeA(
 *   (promiseToResult(fetch("http://example.com/data")))
 *   (errorThen(handleError))
 *   (okThen(transformData))
 * ```
 */
export function promiseToResult<OkData>(
  promise: Promise<OkData>
): ResultP<OkData, any> {
  return promise.then(ok).catch(error);
}

/**
 * Converts a function that returns a promise to one that always resolved to a Result
 *
 * Note that the Error case isn't typesafe, since promises don't have an
 * error type, just a success one. It's probably a good idea to use a
 * `errorThen` or `errorReplace` to handle errors and soon as possible.
 *
 * @param f A function that returns a promise
 * @returns a function that returns a promise that always resolves to a Result
 *
 * ```javascript
 * const writeFile = resultify(promisify(fs.writeFile));
 *
 * pipeA(
 *   (writeFile("path/to/file"))
 *   (errorThen(handleError))
 *   (okThen(transformFileData))
 * )
 * ```
 */
export function resultify<Args extends any[], OkData>(
  f: (...args: Args) => Promise<OkData>
) {
  return function(...args: Args): ResultP<OkData, any> {
    return promiseToResult(f(...args));
  };
}
