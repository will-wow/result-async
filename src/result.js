"use strict";
exports.__esModule = true;
/**
 * Wraps data in an Ok.
 * @param data The success payload
 *
 * ```javascript
 * ok(1)
 * ```
 */
exports.ok = function (data) { return new OkResult(data); };
/**
 * Wraps a message in an Error.
 * @param data The success payload
 *
 * ```javascript
 * error("not found")
 * ```
 */
exports.error = function (message) {
    return new ErrorResult(message);
};
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
function isOk(result) {
    return "ok" in result;
}
exports.isOk = isOk;
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
function isError(result) {
    return "error" in result;
}
exports.isError = isError;
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
exports.isResult = function (result) { return isOk(result) || isError(result); };
/* tslint:disable:function-name */
/**
 * Represents the result of a successful operation.
 * Create one with Result.ok(data)
 * Fantasy-land Functor
 */
var OkResult = /** @class */ (function () {
    function OkResult(ok) {
        this.ok = ok;
    }
    OkResult.prototype.toString = function () {
        return "{ok: " + this.ok + "}";
    };
    OkResult.prototype.map = function (f) {
        return exports.ok(f(this.ok));
    };
    OkResult.prototype["fantasy-land/map"] = function (f) {
        return this.map(f);
    };
    return OkResult;
}());
/**
 * Represents the result of an unsuccessful operation.
 * Create one with Result.ok(data)
 * Fantasy-land Functor
 */
var ErrorResult = /** @class */ (function () {
    function ErrorResult(error) {
        this.error = error;
    }
    ErrorResult.prototype.toString = function () {
        return "{error: " + this.error + "}";
    };
    ErrorResult.prototype.map = function (_f) {
        return this;
    };
    ErrorResult.prototype["fantasy-land/map"] = function (f) {
        return this.map(f);
    };
    return ErrorResult;
}());
