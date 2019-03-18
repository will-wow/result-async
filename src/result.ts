/**
 * Represents the result of an operation that could succeed or fail.
 */
export type Result<OkData, ErrorMessage> =
  | OkResult<OkData>
  | ErrorResult<ErrorMessage>;

/**
 * Wraps data in an Ok.
 * @param data The success payload
 *
 * ```javascript
 * ok(1)
 * ```
 */
export const ok = <T>(data: T): OkResult<T> => new OkResult(data);

/**
 * Wraps a message in an Error.
 * @param data The success payload
 *
 * ```javascript
 * error("not found")
 * ```
 */
export const error = <T>(message: T): ErrorResult<T> =>
  new ErrorResult(message);

/**
 * Type guard to check if a Result is Ok
 * @param result - The result to check
 *
 * ```javascript
 * const result = ok(1);
 *
 * if (isOk(result)) {
 *   result.ok // exists
 * }
 * ```
 */
export function isOk(result: Result<any, any>): result is OkResult<any> {
  return "ok" in result;
}

/**
 * Type guard to check if a Result is an Error
 * @param result - The result to check
 *
 * ```javascript
 * const result = error("not found");
 *
 * if (isError(result)) {
 *   result.error // exists
 * }
 * ```
 */
export function isError(result: Result<any, any>): result is ErrorResult<any> {
  return "error" in result;
}

/**
 * Type guard to check if an object is a Result.
 * @param result - The object to check
 *
 * ```javascript
 * const result = ;
 *
 * isResult(error("not found")) // true
 * ```
 */
export const isResult = (
  result: Result<any, any> | any
): result is Result<any, any> => isOk(result) || isError(result);

/* tslint:disable:function-name */

/**
 * Represents the result of a successful operation.
 * Create one with Result.ok(data)
 * Fantasy-land Functor
 */
class OkResult<T> {
  constructor(public ok: T) {}

  toString() {
    return `{ok: ${this.ok}}`;
  }

  map<U>(f: (ok: T) => U): OkResult<U> {
    return ok(f(this.ok));
  }

  "fantasy-land/map"<U>(f: (ok: T) => U): OkResult<U> {
    return this.map(f);
  }
}

/**
 * Represents the result of an unsuccessful operation.
 * Create one with Result.ok(data)
 * Fantasy-land Functor
 */
class ErrorResult<T> {
  constructor(public error: T) {}

  toString() {
    return `{error: ${this.error}}`;
  }

  map(_f: (ok: any) => any): ErrorResult<T> {
    return this;
  }

  "fantasy-land/map"(f: (ok: any) => any): ErrorResult<T> {
    return this.map(f);
  }
}
