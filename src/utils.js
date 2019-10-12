"use strict";
/**
 * @module
 * Utilities to safely handle unsafe native JavaScript actions.
 */
exports.__esModule = true;
var result_1 = require("./result");
/**
 * Call an action that could throw an error, and return a Result.
 * Successful actions will be wrapped in an ok
 * For predictable errors, you should provide a static or dynamic error handler
 * @param action - The unsafe action to perform
 * @param opts.errorMessage - A static value to return in case of an error
 * @param opts.errorHandler - A function that takes an error and turns it into something you can act on.
 */
function attempt(action, opts) {
    if (opts === void 0) { opts = {}; }
    try {
        return result_1.ok(action());
    }
    catch (e) {
        if (opts.errorHandler)
            return result_1.error(opts.errorHandler(e));
        if (opts.errorMessage)
            return result_1.error(opts.errorMessage);
        return result_1.error(e);
    }
}
exports.attempt = attempt;
/**
 * Safely parse JSON
 * @param json - Stringified JSON to parse
 * @param errorMessage - Optional message to return. Otherwise will return the parser's error message.
 */
function parseJson(json, opts) {
    if (opts === void 0) { opts = {}; }
    try {
        return result_1.ok(JSON.parse(json));
    }
    catch (e) {
        return result_1.error(opts.errorMessage || e.message);
    }
}
exports.parseJson = parseJson;
