type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type AsyncUnary<In, Out> = (x: UnwrapPromise<In>) => Promise<Out> | Out;

export function pipeAsync<In, Out1, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, OutLast>
): Promise<OutLast>;

export function pipeAsync<In, Out1, Out2, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, OutLast>
): Promise<OutLast>;

export function pipeAsync<In, Out1, Out2, Out3, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, OutLast>
): Promise<OutLast>;

export function pipeAsync<In, Out1, Out2, Out3, Out4, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, OutLast>
): Promise<OutLast>;

export function pipeAsync<In, Out1, Out2, Out3, Out4, Out5, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, OutLast>
): Promise<OutLast>;

export function pipeAsync<In, Out1, Out2, Out3, Out4, Out5, Out6, OutLast>(
  start: In,
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, Out6>,
  f7: AsyncUnary<Out6, OutLast>
): Promise<OutLast>;

export async function pipeAsync(start: any, ...fs: any) {
  let acc: any = start;

  for (const i in fs) {
    acc = await fs[i](acc);
  }

  return acc;
}

export function createPipeAsync<In, Out1, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, OutLast>
): (start: In) => Promise<OutLast>;

export function createPipeAsync<In, Out1, Out2, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, OutLast>
): (start: In) => Promise<OutLast>;

export function createPipeAsync<In, Out1, Out2, Out3, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, OutLast>
): (start: In) => Promise<OutLast>;

export function createPipeAsync<In, Out1, Out2, Out3, Out4, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, OutLast>
): (start: In) => Promise<OutLast>;

export function createPipeAsync<In, Out1, Out2, Out3, Out4, Out5, OutLast>(
  f1: AsyncUnary<In, Out1>,
  f2: AsyncUnary<Out1, Out2>,
  f3: AsyncUnary<Out2, Out3>,
  f4: AsyncUnary<Out3, Out4>,
  f5: AsyncUnary<Out4, Out5>,
  f6: AsyncUnary<Out5, OutLast>
): (start: In) => Promise<OutLast>;

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
): (start: In) => Promise<OutLast>;

export function createPipeAsync(...fs: AsyncUnary<any, any>[]) {
  return async (start: any) => {
    return (pipeAsync as any)(start, ...fs);
  };
}
