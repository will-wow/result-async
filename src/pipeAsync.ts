type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type AsyncUnary<In, Out> = (x: UnwrapPromise<In>) => Out;
type WrapPromise<T> = T extends Promise<any> ? T : Promise<T>;

/**
 * Pipe the first argument through a series of transforming functions,
 * where each function takes the return from the previous one.
 *
 * Functions either return a promise or a normal value, and will always
 * receive a non-promise value for their argument.
 *
 * Similar to Ramda's `pipeP`, but allows non-promise return values, and is not curried.
 * @param start - The value to start with. May be a promise.
 * @param fs - The functions to pipe the value through.
 *             Each function must take a single argument.
 * @returns the return value of the final function.
 *
 * @examples
 *
 * ```typescript
 * pipeAsync(
 *   orderData,
 *   roundPriceToCents,
 *   validateOrder,
 *   okChainAsync(savePendingOrder),
 *   errorRescue(fetchPendingOrder)
 *   okChainAsync(placeOrder),
 *   errorThen(transformError)
 * )
 * ```
 */
export function pipeAsync<In, Out1, OutLast>(
  start: In,
  f2: AsyncUnary<In, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<In, Out1, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<In, Out1, Out2, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<In, Out1, Out2, Out3, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<In, Out1, Out2, Out3, Out4, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<In, Out1, Out2, Out3, Out4, Out5, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<In, Out1, Out2, Out3, Out4, Out5, Out6, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, Out6>,
  f7: AsyncUnary<Out6, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<
  In,
  Out1,
  Out2,
  Out3,
  Out4,
  Out5,
  Out6,
  Out7,
  Out8,
  OutLast
>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, Out6>,
  f7: AsyncUnary<Out6, Out7>,
  f8: AsyncUnary<Out7, Out8>,
  f9: AsyncUnary<Out8, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<
  In,
  Out1,
  Out2,
  Out3,
  Out4,
  Out5,
  Out6,
  Out7,
  Out8,
  Out9,
  OutLast
>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, Out6>,
  f7: AsyncUnary<Out6, Out7>,
  f8: AsyncUnary<Out7, Out8>,
  f9: AsyncUnary<Out8, Out9>,
  f10: AsyncUnary<Out9, OutLast>
): WrapPromise<OutLast>;

export function pipeAsync<
  In,
  Out1,
  Out2,
  Out3,
  Out4,
  Out5,
  Out6,
  Out7,
  Out8,
  Out9,
  Out10,
  OutLast
>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, Out6>,
  f7: AsyncUnary<Out6, Out7>,
  f8: AsyncUnary<Out7, Out8>,
  f9: AsyncUnary<Out8, Out9>,
  f10: AsyncUnary<Out9, Out10>,
  f11: AsyncUnary<Out10, OutLast>
): WrapPromise<OutLast>;

export async function pipeAsync(start: any, ...fs: any) {
  let acc: any = await start;

  for (const i in fs) {
    acc = await fs[i](acc);
  }

  return acc;
}

/**
 * Set up a pipeline of transforming functions,
 * where each function takes the return from the previous one.
 *
 * Functions either return a promise or a normal value, and will always
 * receive a non-promise value for their argument.
 *
 * Similar to Ramda's `pipeP`, but allows non-promise return values.
 * @param fs - The functions to pipe the value through.
 *             Each function must take a single argument.
 * @param start - The value to start with. May be a promise.
 * @returns a function that takes a value, and sends it through the pipeline.
 *
 * ```javascript
 * // Create pipe
 * const placeOrderAtPrice = createPipeAsync(
 *   roundPriceToCents,
 *   validateOrder,
 *   okChainAsync(savePendingOrder),
 *   errorRescue(fetchPendingOrder)
 *   okChainAsync(placeOrder),
 *   errorThen(transformError)
 * )
 *
 * // Use pipe
 * placeOrderAtPrice({ item, price: "10.00" });
 * ```
 */
export function createPipeAsync<In, Out1, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, OutLast>
): (start: In) => WrapPromise<OutLast>;

export function createPipeAsync<In, Out1, Out2, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, OutLast>
): (start: In) => WrapPromise<OutLast>;

export function createPipeAsync<In, Out1, Out2, Out3, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, OutLast>
): (start: In) => WrapPromise<OutLast>;

export function createPipeAsync<In, Out1, Out2, Out3, Out4, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, OutLast>
): (start: In) => WrapPromise<OutLast>;

export function createPipeAsync<In, Out1, Out2, Out3, Out4, Out5, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, OutLast>
): (start: In) => WrapPromise<OutLast>;

export function createPipeAsync<
  In,
  Out1,
  Out2,
  Out3,
  Out4,
  Out5,
  Out6,
  OutLast
>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, Out6>,
  f7: AsyncUnary<Out6, OutLast>
): (start: In) => WrapPromise<OutLast>;

export function createPipeAsync(...fs: AsyncUnary<any, any>[]) {
  return async (start: any) => {
    return (pipeAsync as any)(start, ...fs);
  };
}
