"use strict";
exports.__esModule = true;
var result_1 = require("./result");
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
 * okThen(add1)(ok(1)) // ok(2)
 * okThen(add1)(error("bad")) // error("bad")
 * okThen(add1)(ok(-1)) // ok(0)
 * ```
 */
function okThen(f) {
    return function (result) {
        if (result_1.isError(result)) {
            return result;
        }
        return result_1.ok(f(result.ok));
    };
}
exports.okThen = okThen;
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
 * const normalizeErrorCase = errorThen(message =>
 *   message.toLowerCase()
 * )
 *
 * normalizeErrorCase(ok("alice")) // ok("alice")
 * normalizeErrorCase(error("NOT FOUND")) // error("not found")
 * ```
 */
function errorThen(f) {
    return function (result) {
        if (result_1.isOk(result)) {
            return result;
        }
        return result_1.error(f(result.error));
    };
}
exports.errorThen = errorThen;
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
 * okThen(positiveAdder)(ok(1)) // ok(2)
 * okThen(positiveAdder)(error("bad")) // error("bad")
 * okThen(positiveAdder)(ok(-1)) // error("only positive")
 * ```
 */
function okChain(f) {
    return function (result) {
        if (result_1.isError(result)) {
            return result;
        }
        return f(result.ok);
    };
}
exports.okChain = okChain;
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
 * const rescueNotFound = errorThen(errorMessage =>
 *   errorMessage === "not found" ? ok("unknown") : error(errorMessage)
 * );
 *
 * rescueNotFound(ok("alice")) // ok("alice")
 * rescueNotFound(error("not found")) // ok("unknown")
 * rescueNotFound(error("network error")) // error("network error")
 * ```
 */
function errorRescue(f) {
    return function (result) {
        if (result_1.isOk(result)) {
            return result;
        }
        return f(result.error);
    };
}
exports.errorRescue = errorRescue;
/**
 * Runs a function for side effects on the payload, only if the result is Ok.
 *
 * @param f - the function to run on the ok data
 * @param result - The result to match against
 * @returns The original result
 *
 * ```javascript
 * const result = fetchData();
 * // Log the data if the fetch succeeded.
 * okDo(console.log);
 * ```
 */
function okDo(f) {
    return function (result) {
        if (result_1.isOk(result)) {
            f(result.ok);
        }
        return result;
    };
}
exports.okDo = okDo;
/**
 * Runs a function for side effects on the payload, only if the result is Error.
 *
 * @param f - the function to run on the error message
 * @param result - The result to match against
 * @returns The original result
 *
 * ```javascript
 * const result = fetchData();
 * // Log an error if the fetch failed.
 * errorDo(console.error)(result);
 * ```
 */
function errorDo(f) {
    return function (result) {
        if (result_1.isError(result)) {
            f(result.error);
        }
        return result;
    };
}
exports.errorDo = errorDo;
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
 * okReplace("fine")(ok(null)) // ok("fine")
 * ```
 */
function okReplace(newData) {
    return function (result) {
        if (result_1.isError(result)) {
            return result;
        }
        return result_1.ok(newData);
    };
}
exports.okReplace = okReplace;
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
 * errorReplace("something went wrong")(error(null)) // error("something went wrong")
 * ```
 */
function errorReplace(newError) {
    return function (result) {
        if (result_1.isOk(result)) {
            return result;
        }
        return result_1.error(newError);
    };
}
exports.errorReplace = errorReplace;
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
function okOrThrow(result) {
    if (result_1.isError(result))
        throw new Error(result.error);
    return result.ok;
}
exports.okOrThrow = okOrThrow;
/**
 * Get the error message from a result. If it's an Ok instead, throw an error.
 * @returns the error message
 *
 * ```typescript
 * errorOrThrow(error("bad"));
 * // "bad"
 *
 * errorOrThrow(ok("good"));
 * // throws new Error("good")
 * ```
 */
function errorOrThrow(result) {
    if (result_1.isOk(result))
        throw new Error(result.ok);
    return result.error;
}
exports.errorOrThrow = errorOrThrow;
/**
 * Takes a result, and runs either an onOk or onError function on it.
 * @param onOk - Function to run if the result is an Ok
 * @param onError - Function to run if the result is an Error
 * @param result - Result to match against
 * @returns The return value of the function that gets run.
 *
 * ```javascript
 * // Use `either` to unwrap a Result.
 * const userId = either(
 *   await fetchAUser(),
 *   user => user.id,
 *   () => null
 * )
 *
 * // Use `either` to act on both cases, but leave wrapped.
 * const userId = either(
 *   await fetchAUser(),
 *   user => ok(user.id),
 *   () => error("not found")
 * )
 * ```
 */
function either(result, onOk, onError) {
    if (result_1.isOk(result)) {
        return onOk(result.ok);
    }
    if (result_1.isError(result)) {
        return onError(result.error);
    }
    throw new Error("invalid result");
}
exports.either = either;
/**
 * Converts a result to a boolean.
 * @param result
 * @returns true if Ok, false if Error
 *
 * ```javascript
 * resultToBoolean(ok(1)) // true
 * resultToBoolean(error(1)) // false
 * ```
 */
function resultToBoolean(result) {
    return result_1.isOk(result) ? true : false;
}
exports.resultToBoolean = resultToBoolean;
