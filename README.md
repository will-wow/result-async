# Result-Async

<img width="80" height="80" src="./logo/logo.png" alt="logo" align="right" />

A library for handling errors with types and without exceptions - even asynchronous ones

[![npm package](https://img.shields.io/npm/v/result-async.svg)](https://www.npmjs.com/package/result-async)
[![David Dependancy Status](https://david-dm.org/will-wow/result-async.svg)](https://david-dm.org/will-wow/result-async)

## Install

```bash
npm i result-async --save
```

or

```bash
yarn add result-async
```

Then import the functions and (in TypeScript) types you need:

```typescript
import { ok, mapOk, asyncChainOk, Result } from "result-async";
```

## Examples

You can react to errors inline:

```typescript
import { isError } from "result-async";

const result = await tryToGetAListOfComments("my-blog-post");

const comments = isOk(result) ? result.ok : [];
```

Return a success or failure status:

```typescript
import { ok, error } from "result-async";

return isAllWell() ? ok("all is well") : error("all is lost");
```

And you can pipe functions - both synchronous and asynchronous ones - together for a big data-handling pipeline:

```typescript
import {
  resultify,
  asyncChainOk,
  mapError,
  mapOk,
  chainError
} from "result-async";

pipeAsync(
  someData,
  resultify(someAsyncFunction),
  mapOk(transformData),
  asyncChainOk(anotherAsyncFunction),
  mapError(logError),
  chainError(tryToRescueError)
);
```

See [the docs](https://github.com/will-wow/result-async) for the full API documentation.

## Typescript

`result-async` is written in TypeScript, and it's built to help write typesafe error handling code. But it works great with vanilla JavaScript too!

### Types

The important types are:

```typescript
type Result<OkData, ErrorMessage> = OkResult<Data> | ErrorResult<Message>;
type ResultP<OkData, ErrorMessage> = Promise<Result<OkData, ErrorMessage>>;
```

So a result could be either Ok or an Error - and either way, the payload is strongly typed.

`ResultP` is just a promise that wraps a `Result`. Async functions can return a `ResultP`, so that success and failure both have types after an `await`;

### Guards

`isOk(result)` and `isError(result)` are both typeguards, so if `isOk` returns true, typescript will know the Result is actually an OkResult:

```typescript
function(result: Result<number, string>) {
  // Type error: ok could be undefined.
  result.ok + 1

  if (isOk(result)) {
    // No type error, ok is definitely defined.
    result.ok + 1
  }
}
```

## Background

[`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) has been a huge win for avoiding the dreaded Pyramid of doom in JavaScript.

These bad days are behind us forever:

```javascript
someFunction(data, (err, data) => {
  if (err) throw err;
  secondFunction(data, (err, data) => {
    if (err) throw err;
    thirdFunction(data, (err, data) => {
      if (err) throw err;

      doStuff(data);
    });
  });
});
```

Replaced with:

```javascript
try {
  data = await someFunction(data);
  data = await secondFunction(data);
  data = await thirdFunction(data);
} catch (e) {
  doSomethingWithError(e);
}
```

Much better. But still, errors are treated really differently than normal data. And in TypeScript, errors are also untyped. For a genuine exception that's fine, but there are a lot of cases where I expect a call to sometimes fail (for instance, checking if a resource exists, and creating one if it doesn't, where creation itself might fail). In those cases, having to rely on errors can feel a little heavyweight.

The functional programming world has an answer for this - the Result type. It's in [Haskell](http://book.realworldhaskell.org/read/error-handling.html#errors.either), [Ocaml](https://ocaml.org/learn/tutorials/error_handling.html#Result-type), [Elixir](https://medium.com/@moxicon/elixir-best-practices-for-error-values-50dc015a06f5), and more. The idea is to have a function that could fail return a response that's marked as either a Success or a Failure. Then you can react to that result status, pass it along, ignore it, or whatever - just like any other data structure.

In many FP languages, we have pattern matching to make this easier:

```elixir
case some_async_function() do
  {:ok, data} -> do_something(data)
  {:error, msg} -> do_something_else(msg)
end
```

But `result-async` tries to make it easy to create and handle Results - even when they come from async functions:

```typescript
import { either } from "result-async";

either(
  await someAsyncFunction(),
  data => doSomething(data),
  msg => doSomethingElse(msg)
);
```
