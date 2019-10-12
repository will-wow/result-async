"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var result_1 = require("./result");
// Solves an error with returning ResultP from an async function.
// tslint:disable-next-line:variable-name
exports.ResultP = Promise;
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
function okChainAsync(f) {
    return function (result) {
        return __awaiter(this, void 0, exports.ResultP, function () {
            return __generator(this, function (_a) {
                if (result_1.isError(result)) {
                    return [2 /*return*/, result];
                }
                return [2 /*return*/, f(result.ok)];
            });
        });
    };
}
exports.okChainAsync = okChainAsync;
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
function errorRescueAsync(f) {
    return function (result) {
        return __awaiter(this, void 0, exports.ResultP, function () {
            return __generator(this, function (_a) {
                if (result_1.isOk(result)) {
                    return [2 /*return*/, result];
                }
                return [2 /*return*/, f(result.error)];
            });
        });
    };
}
exports.errorRescueAsync = errorRescueAsync;
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
function okDoAsync(f) {
    return function (result) {
        return __awaiter(this, void 0, exports.ResultP, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!result_1.isOk(result)) return [3 /*break*/, 2];
                        return [4 /*yield*/, f(result.ok)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, result];
                }
            });
        });
    };
}
exports.okDoAsync = okDoAsync;
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
function errorDoAsync(f) {
    return function (result) {
        return __awaiter(this, void 0, exports.ResultP, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!result_1.isError(result)) return [3 /*break*/, 2];
                        return [4 /*yield*/, f(result.error)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, result];
                }
            });
        });
    };
}
exports.errorDoAsync = errorDoAsync;
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
function promiseToResult(promise) {
    return promise.then(result_1.ok)["catch"](result_1.error);
}
exports.promiseToResult = promiseToResult;
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
function resultify(f) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return promiseToResult(f.apply(void 0, args));
    };
}
exports.resultify = resultify;
