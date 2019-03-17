type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type AsyncUnary<In, Out> = (x: UnwrapPromise<In>) => Out;
type WrapPromise<T> = T extends Promise<any> ? T : Promise<T>;

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

export async function pipeAsync(start: any, ...fs: any) {
  let acc: any = await start;

  for (const i in fs) {
    acc = await fs[i](acc);
  }

  return acc;
}

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
