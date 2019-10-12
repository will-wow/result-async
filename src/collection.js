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
var sync_1 = require("./sync");
var async_1 = require("./async");
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
function allOk(results) {
    return results.reduce(function (acc, result) {
        if (!result_1.isOk(acc))
            return acc;
        if (!result_1.isOk(result))
            return result;
        return result_1.ok(acc.ok.concat([result.ok]));
    }, result_1.ok([]));
}
exports.allOk = allOk;
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
function allOkAsync(promises) {
    return __awaiter(this, void 0, async_1.ResultP, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, async_1.promiseToResult(Promise.all(promises))];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, sync_1.okChain(function (results) { return allOk(results); })(results)];
            }
        });
    });
}
exports.allOkAsync = allOkAsync;
/**
 * Find and return the first ok(data) in the collection. If there are no Ok values, return error(null)
 *
 * ```javascript
 * allOk([error(1), error(2), ok(3), ok(4)]) // ok(3)
 * allOk([error(1), error(2)]) // error(null)
 * ```
 */
function firstOk(results) {
    return results.find(result_1.isOk) || result_1.error(null);
}
exports.firstOk = firstOk;
