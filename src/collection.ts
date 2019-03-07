import { Result, isOk, isError, ok, error } from "./result";

/**
 * For checking that a collection of computations all succeeded, when you
 * you care about the outcomes.
 *
 * Takes a list of Results. If all are Ok, collects the data
 * in a list and returns ok([data]).
 * If any are Errors, returns the first error(msg)
 * @param results
 */
export function collectOks<OkData, ErrorMessage>(
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
 * Find and return the first ok(data) in the collection. If there are no Ok values, return error(null)
 */
export function firstOk<OkData>(
  results: Result<OkData, any>[]
): Result<OkData, null> {
  return results.find(isOk) || error(null);
}

/**
 * For checking that a collection of computations all succeeded, when
 * you don't care about the outcomes.
 *
 * Takes a list of Results. If all are Ok, returns ok(null). If any are error(msg), returns the first error(msg).
 * @param results
 */
export function allOk<ErrorData>(
  results: Result<any, ErrorData>[]
): Result<null, ErrorData> {
  return results.find(isError) || ok(null);
}
