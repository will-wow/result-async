/**
 * Represents the result of an operation that could succeed or fail.
 */
export type Result<OkData, ErrorMessage> =
  | OkResult<OkData>
  | ErrorResult<ErrorMessage>;

/**
 * Wraps data in an Ok.
 * @param data The success payload
 */
export const ok = <T>(data: T): OkResult<T> => new OkResult(data);

/**
 * Wraps a message in an Error.
 * @param data The success payload
 */
export const error = <T>(message: T): ErrorResult<T> =>
  new ErrorResult(message);

/**
 * Type guard to check if a Result is Ok
 * @param result - The result to check
 */
export const isOk = (result: Result<any, any>): result is OkResult<any> =>
  (result as OkResult<any>).ok !== undefined;

/**
 * Type guard to check if a Result is an Error
 * @param result - The result to check
 */
export const isError = (result: Result<any, any>): result is ErrorResult<any> =>
  (result as ErrorResult<any>).error !== undefined;

/**
 * Type guard to check if an object is a Result.
 * @param result - The object to check
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

  "fantasy-land/map"<U>(f: (ok: T) => U): U {
    return f(this.ok);
  }
}

/**
 * Represents the result of an unsuccessful operation.
 * Create one with Result.ok(data)
 * Fantasy-land: Functor
 */
class ErrorResult<T> {
  constructor(public error: T) {}

  toString() {
    return `{error: ${this.error}}`;
  }

  "fantasy-land/map"(f: (ok: any) => any): T {
    return f(this.error);
  }
}