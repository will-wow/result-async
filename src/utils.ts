/**
 * @module
 * Utilities to safely handle unsafe native JavaScript actions.
 */

import { ok, error, Result } from "./result";

/**
 * Call an action that could throw an error, and return a Result.
 * Successful actions will be wrapped in an ok
 * For predictable errors, you should provide a static or dynamic error handler
 * @param action - The unsafe action to perform
 * @param opts.errorMessage - A static value to return in case of an error
 * @param opts.errorHandler - A function that takes an error and turns it into something you can act on.
 */
export function attempt<OkData, ErrorMessage>(
  action: () => OkData,
  opts: {
    errorMessage?: ErrorMessage;
    errorHandler?: (error: any) => ErrorMessage;
  } = {}
): Result<OkData, ErrorMessage> {
  try {
    return ok(action());
  } catch (e) {
    if (opts.errorHandler) return error(opts.errorHandler(e));
    if (opts.errorMessage) return error(opts.errorMessage);
    return error(e);
  }
}

/**
 * Safely parse JSON
 * @param json - Stringified JSON to parse
 * @param errorMessage - Optional message to return. Otherwise will return the parser's error message.
 */
export function parseJson<T, ErrorMessage = string>(
  json: string,
  opts: { errorMessage?: ErrorMessage } = {}
): Result<T, ErrorMessage> {
  try {
    return ok(JSON.parse(json));
  } catch (e) {
    return error(opts.errorMessage || e.message);
  }
}
