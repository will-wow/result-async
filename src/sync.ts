import { Result, ok, error, isOk, isError } from "./result";

/**
 * Edits a value that's wrapped in an {ok: data}
 *
 * Takes a Result and a mapping function.
 * If the result is an Ok, applies the function to the data.
 * If the result is an Error, passes the Result through unchanged.
 *
 * Wraps the return value of f in an {ok: new_data}.
 * @param f - the function to run on the ok data
 * @param result - The result to match against
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
 * Runs a function for side effects on the payload, only if the result is Ok.
 *
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 * @returns The original result
 */
export function okSideEffect<OkData, ErrorMessage>(
  f: (ok: OkData) => any
): (result: Result<OkData, ErrorMessage>) => Result<OkData, ErrorMessage> {
  return ifOk((data: OkData) => {
    f(data);
    return data;
  });
}

/**
 * Chains together operations that may succeed or fail
 *
 * Takes a Result and a mapping function.
 * If the result is an Ok, applies the function to the data.
 * If the result is an Error, passes the Result through unchanged.
 *
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 * @returns - The Result from function f or the Error
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
 * Edits a value that's wrapped in an {error: data}
 *
 * Takes a Result and a mapping function.
 * If the result is an Error, applies the function to the message.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * It wraps the return value in an {error: new_message}.
 * @param f - the function to run on the ok data
 * @param result - The result to match against
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
 * Runs a function for side effects on the payload, only if the result is Error.
 *
 * @param f - the function to run on the error message
 * @param result - The result to match against
 * @returns The original result
 */
export function errorSideEffect<OkData, ErrorMessage>(
  f: (error: ErrorMessage) => any
): (result: Result<OkData, ErrorMessage>) => Result<OkData, ErrorMessage> {
  return ifError((message: ErrorMessage) => {
    f(message);
    return message;
  });
}

/**
 * Chains together operations that may succeed or fail
 *
 * Takes a Result and a mapping function.
 * If the result is an Error, applies the function to the data and returns the new result.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * @param f - the function to run on the error message
 * @param result - The result to match against
 * @returns - The Result from function f or the Ok result
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
 * Replaces a value that's wrapped in an {error: data}
 * Useful if you don't care about the data, just the fact that previous call failed.
 *
 * Takes a Result and a mapping function.
 * If the result is an Error, applies the function to the message.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * It wraps the return value in an {error: new_message}.
 * @param f - the function to run on the ok data
 * @param result - The result to match against
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

/**
 * Get the error message from a result. If it's an Ok, throw an error.
 * @returns the ok data
 *
 * @example
 * ```typescript
 * const okResult = ok("good");
 * okOrThrow(result);
 * // "good"
 *
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
