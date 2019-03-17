import { Result, ok, error, isOk, isError, isResult } from "./result";

/**
 * Transforms a successful result, and passes through a failed result.
 *
 * Takes a mapping function, then a result.
 * If the result is an Ok, applies the function to the data.
 * If the result is an Error, passes the Result through unchanged.
 *
 * The function can either return a result for operations that could fail,
 * or a value to wrap in an ok result for operations that will always succeed.
 * 
 * Aka: a typesafe combination of map and chain/flatMap.
 
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 * @returns - The Result from function f or the Error
 * 
 * @example 
 * 
 * ```javascript
 * function positiveAdder(n) { 
 *   return n < 0 ? error("only positive") : ok(n + 1);
 * }
 * 
 * function anyAdder(n) { 
 *   return n + 1
 * }
 * 
 * ifOk(positiveAdder)(ok(1)) // ok(2)
 * ifOk(positiveAdder)(error("bad")) // error("bad")
 * ifOk(positiveAdder)(ok(-1)) // error("only positive")
 * 
 * ifOk(anyAdder)(ok(1)) // ok(2)
 * ifOk(anyAdder)(error("bad")) // error("bad")
 * ifOk(anyAdder)(ok(-1)) // ok(0)
 * ```
 */
export function iifOk<OkData, OkOutput, ErrorOutput, FunctionResult>(
  f: (ok: OkData) => FunctionResult & (OkOutput | Result<OkOutput, ErrorOutput>)
) {
  return function<
    ErrorMessage,
    ReturnResult extends FunctionResult extends Result<any, any>
      ? Result<OkOutput, ErrorOutput | ErrorMessage>
      : Result<FunctionResult, ErrorMessage>
  >(
    result: Result<OkData, ErrorMessage>
  ): FunctionResult extends Result<any, any>
    ? Result<OkOutput, ErrorOutput | ErrorMessage>
    : Result<FunctionResult, ErrorMessage> {
    if (isError(result)) {
      return result as ReturnResult;
    }

    const newValue: Result<OkOutput, ErrorOutput> | OkOutput = f(result.ok);

    if (isResult(newValue)) {
      return newValue as ReturnResult;
    }
    return ok(newValue) as ReturnResult;
  };
}

/**
 * Transforms a failed result, and passes through a successful result.
 *
 * Takes a mapping function, then a result.
 * If the result is an Error, applies the function to the data.
 * If the result is an Ok, passes the Result through unchanged.
 *
 * The function can either return a result for operations that could be rescued,
 * or a new value to wrap in an error result to change the error message.
 * 
 * Aka: a typesafe combination of map and chain/flatMap.
 
 * @param f - the function to run on the error data
 * @param result - The result to match against
 * @returns - The Result from function f or the Ok result
 * 
 * @example 
 * 
 * ```javascript
 * const rescueNotFound = ifError(errorMessage =>  
 *   errorMessage === "not found" ? ok("unknown") : error(errorMessage)
 * );
 * 
 * 
 * const normalizeErrorCase = ifError(message => 
 *   message.toLowerCase()
 * )
 * 
 * normalizeErrorCase(ok("alice")) // ok("alice")
 * normalizeErrorCase(error("NOT FOUND")) // error("not found")
 * 
 * rescueNotFound(ok("alice")) // ok("alice")
 * rescueNotFound(error("not found")) // ok("unknown")
 * rescueNotFound(error("network error")) // error("network error")
 * ```
 */
export function iifError<ErrorMessage, OkOutput, ErrorOutput, FunctionResult>(
  f: (
    error: ErrorMessage
  ) => FunctionResult & (ErrorOutput | Result<OkOutput, ErrorOutput>)
) {
  return function<
    OkData,
    ReturnResult extends FunctionResult extends Result<any, any>
      ? Result<OkData | OkOutput, ErrorOutput>
      : Result<OkData, FunctionResult>
  >(result: Result<OkData, ErrorMessage>): ReturnResult {
    if (isOk(result)) {
      return result as ReturnResult;
    }

    const newValue: Result<OkOutput, ErrorOutput> | ErrorOutput = f(
      result.error
    );

    if (isResult(newValue)) {
      return newValue as ReturnResult;
    }
    return error(newValue) as ReturnResult;
  };
}

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
