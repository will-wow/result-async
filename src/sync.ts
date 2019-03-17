import { Result, ok, error, isOk, isError } from "./result";

/**
 * Transforms a successful result, and passes through a failed result.
 *
 * Takes a mapping function, then a result.
 * If the result is an Ok, applies the function to the data.
 * If the result is an Error, passes the Result through unchanged.
 *
 * Wraps the output of the function in an Ok.
 *
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 *
 * ```javascript
 * function add1(n) {
 *   return n + 1
 * }
 *
 * ifOk(add1)(ok(1)) // ok(2)
 * ifOk(add1)(error("bad")) // error("bad")
 * ifOk(add1)(ok(-1)) // ok(0)
 * ```
 */

export function ifOk<OkData, ErrorMessage, OkOutput>(
  f: (ok: OkData) => OkOutput
) {
  return (
    result: Result<OkData, ErrorMessage>
  ): Result<OkOutput, ErrorMessage> => {
    if (isError(result)) {
      return result;
    }

    return ok(f(result.ok));
  };
}

/**
 * Transforms a failed result, and passes through a successful result.
 *
 * Takes a mapping function, then a result.
 * If the result is an Error, applies the function to the data.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * Wraps the output of the function in an Error.
 *
 * @param f - the function to run on the error data
 * @param result - The result to match against
 * @returns - The Result from function f or the Ok result
 *
 * ```javascript
 * const normalizeErrorCase = ifError(message =>
 *   message.toLowerCase()
 * )
 *
 * normalizeErrorCase(ok("alice")) // ok("alice")
 * normalizeErrorCase(error("NOT FOUND")) // error("not found")
 * ```
 */
export function ifError<OkData, ErrorMessage, ErrorOutput>(
  f: (error: ErrorMessage) => ErrorOutput
) {
  return (
    result: Result<OkData, ErrorMessage>
  ): Result<OkData, ErrorOutput> => {
    if (isOk(result)) {
      return result;
    }

    return error(f(result.error));
  };
}

/**
 * Performs an operation that could succeed or fail on a successful result
 * Passes through a failed result.
 *
 * Takes a mapping function, then a result.
 * If the result is an Ok, applies the function to the data.
 * If the result is an Error, passes the Result through unchanged.
 *
 * The return value must itself be a result, which will be returned.
 * @returns - The Result from function f or the Error
 *
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 *
 * ```javascript
 * function positiveAdder(n) {
 *   return n < 0 ? error("only positive") : ok(n + 1);
 * }
 *
 * ifOk(positiveAdder)(ok(1)) // ok(2)
 * ifOk(positiveAdder)(error("bad")) // error("bad")
 * ifOk(positiveAdder)(ok(-1)) // error("only positive")
 * ```
 */
export function chainOk<OkData, ErrorMessage, OkOutput, ErrorOutput>(
  f: (ok: OkData) => Result<OkOutput, ErrorOutput>
) {
  return (
    result: Result<OkData, ErrorMessage>
  ): Result<OkOutput, ErrorMessage | ErrorOutput> => {
    if (isError(result)) {
      return result;
    }

    return f(result.ok);
  };
}

/**
 * Attempts to rescue failed results. Passes successful ones through.
 *
 * Takes a mapping function, then a result.
 * If the result is an Error, applies the function to the data.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * The return value must itself be a result, which will be returned.
 *
 * @param f - the function to run on the error data
 * @param result - The result to match against
 * @returns - The Result from function f or the Ok result
 *
 * ```javascript
 * const rescueNotFound = ifError(errorMessage =>
 *   errorMessage === "not found" ? ok("unknown") : error(errorMessage)
 * );
 *
 * rescueNotFound(ok("alice")) // ok("alice")
 * rescueNotFound(error("not found")) // ok("unknown")
 * rescueNotFound(error("network error")) // error("network error")
 * ```
 */
export function chainError<OkData, ErrorMessage, OkOutput, ErrorOutput>(
  f: (ok: ErrorMessage) => Result<OkOutput, ErrorOutput>
) {
  return (
    result: Result<OkData, ErrorMessage>
  ): Result<OkData | OkOutput, ErrorOutput> => {
    if (isOk(result)) {
      return result;
    }

    return f(result.error);
  };
}

/**
 * Runs a function for side effects on the payload, only if the result is Ok.
 *
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 * @returns The original result
 *
 * ```javascript
 * okSideEffect(console.log, ok("hi")) // Logs "hi"
 * okSideEffect(console.log, error(1)) // No log
 * ```
 */
export function okSideEffect<OkData, ErrorMessage>(f: (ok: OkData) => any) {
  return function(
    result: Result<OkData, ErrorMessage>
  ): Result<OkData, ErrorMessage> {
    if (isOk(result)) {
      f(result.ok);
    }
    return result;
  };
}

/**
 * Runs a function for side effects on the payload, only if the result is Error.
 *
 * @param f - the function to run on the error message
 * @param result - The result to match against
 * @returns The original result
 *
 * ```javascript
 * errorSideEffect(console.error)(ok("hi")) // No log
 * errorSideEffect(console.error)(error(1)) // Logs 1
 * ```
 */
export function errorSideEffect<OkData, ErrorMessage>(
  f: (ok: ErrorMessage) => any
) {
  return function(
    result: Result<OkData, ErrorMessage>
  ): Result<OkData, ErrorMessage> {
    if (isError(result)) {
      f(result.error);
    }
    return result;
  };
}

/**
 * Replaces a value that's wrapped in an {ok: data}
 * Useful if you don't care about the data, just the fact that previous call succeeded.
 *
 * Takes a Result and a mapping function.
 * If the result is an Error, applies the function to the message.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * It wraps the return value in an {error: new_message}.
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 *
 * ```javascript
 * replaceOk("fine")(ok(null)) // ok("fine")
 * ```
 */
export function replaceOk<OkOutput>(newData: OkOutput) {
  return <ErrorMessage>(
    result: Result<any, ErrorMessage>
  ): Result<OkOutput, ErrorMessage> => {
    if (isError(result)) {
      return result;
    }

    return ok(newData);
  };
}

/**
 * Replaces a message that's wrapped in an `error(message)`
 * Useful if you don't care about the old message, just the fact that previous call failed.
 *
 * Takes a Result and a mapping function.
 * If the result is an Error, applies the function to the message.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 *
 * ```javascript
 * replaceError("something went wrong")(error(null)) // error("something went wrong")
 * ```
 */
export function replaceError<ErrorOutput>(newError: ErrorOutput) {
  return <OkData>(result: Result<OkData, any>): Result<OkData, ErrorOutput> => {
    if (isOk(result)) {
      return result;
    }

    return error(newError);
  };
}

/**
 * Get the error message from a result. If it's an Ok, throw an error.
 * @returns the ok data
 *
 * ```typescript
 * const okResult = ok("good");
 * okOrThrow(result);
 * // "good"
 * ```
 *
 * ```typescript
 * const errorResult = error("bad");
 * okOrThrow(result);
 * // throws new Error("bad")
 * ```
 */
export function okOrThrow<OkData>(result: Result<OkData, any>): OkData {
  if (isError(result)) throw new Error(result.error);

  return result.ok;
}

/**
 * Get the error message from a result. If it's an Ok, throw an error.
 * @returns the error message
 *
 * @example
 * ```typescript
 * const errorResult = error("bad");
 * errorOrThrow(result);
 * // "bad"
 *
 * const okResult = ok("good");
 * errorOrThrow(result);
 * // throws new Error("good")
 * ```
 */
export function errorOrThrow<ErrorMessage>(
  result: Result<any, ErrorMessage>
): ErrorMessage {
  if (isOk(result)) throw new Error(result.ok);

  return result.error;
}

/**
 * Takes a result, and runs either an onOk or onError function on it.
 * @param onOk - Function to run if the result is an Ok
 * @param onError - Function to run if the result is an Error
 * @param result - Result to match against
 * @returns The return value of the function that gets run.
 */
export function either<OkData, ErrorMessage, OkOutput, ErrorOutput>(
  result: Result<OkData, ErrorMessage>,
  onOk: (ok: OkData) => OkOutput,
  onError: (error: ErrorMessage) => ErrorOutput
): OkOutput | ErrorOutput {
  if (isOk(result)) {
    return onOk(result.ok);
  }
  if (isError(result)) {
    return onError(result.error);
  }
  throw new Error("invalid result");
}

/**
 * Converts a result to a boolean.
 * @param result
 * @returns true if Ok, false if Error
 */
export function resultToBoolean(result: Result<any, any>): boolean {
  return isOk(result) ? true : false;
}
