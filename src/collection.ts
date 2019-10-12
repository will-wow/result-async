import { Result, isOk, ok, error } from "./result";
import { okChain } from "./sync";
import { ResultP, promiseToResult } from "./async";

/**
 * For checking that a collection of computations all succeeded.
 * Similar to Promise.all for Results.
 *
 * Takes a list of Results. If all are Ok, collects the data
 * in a list and returns ok([data]).
 * If any are Errors, returns the first error(msg)
 * @param results
 *
 * ```javascript
 * allOk([ok(1), ok(2), ok(3)]) // ok([1, 2, 3])
 *
 * allOk([ok(1), error(2), error(3)]) // error(2)
 * ```
 */
export function allOk<OkData, ErrorMessage>(
  results: Result<OkData, ErrorMessage>[]
): Result<OkData[], ErrorMessage> {
  return results.reduce((acc: Result<OkData[], ErrorMessage>, result): Result<
    OkData[],
    ErrorMessage
  > => {
    if (!isOk(acc)) return acc;

    if (!isOk(result)) return result;

    return ok([...acc.ok, result.ok]);
  }, ok([]));
}

/**
 * For checking that a collection async computations all succeeded.
 * Promise.all for Results wrapped in promises.
 *
 * Takes a list of Promise<Result>s. If all are Ok, collects the data
 * in a list and returns ok([data]).
 * If any are any promise OR result errors, returns the first error(msg)
 *
 * ```javascript
 * function countComments(postId) {
 *   return pipeA
 *     (fetchAllComments(postId)),
 *     (allOkAsync),
 *     (okThen(comments => comments.length))
 *     (errorReplace("some comments didn't load"))
 * }
 * ```
 */
export async function allOkAsync<OkData, ErrorMessage>(
  promises: ResultP<OkData, ErrorMessage>[]
): ResultP<OkData[], ErrorMessage> {
  const results = await promiseToResult(Promise.all(promises));

  return okChain((results: Result<OkData, ErrorMessage>[]) => allOk(results))(
    results
  );
}

/**
 * Find and return the first ok(data) in the collection. If there are no Ok values, return error(null)
 *
 * ```javascript
 * allOk([error(1), error(2), ok(3), ok(4)]) // ok(3)
 * allOk([error(1), error(2)]) // error(null)
 * ```
 */
export function firstOk<OkData>(
  results: Result<OkData, any>[]
): Result<OkData, null> {
  return results.find(isOk) || error(null);
}
