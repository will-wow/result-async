# Result-Async

<img width="80" height="80" src="./assets/images/logo.png" alt="logo" align="right" />

A library for handling errors with types and without exceptions - even asynchronous ones.

[![npm package](https://img.shields.io/npm/v/result-async.svg)](https://www.npmjs.com/package/result-async)
[![CircleCI](https://circleci.com/gh/will-wow/result-async.svg?style=svg)](https://circleci.com/gh/will-wow/result-async)
[![David Dependency Status](https://david-dm.org/will-wow/result-async.svg)](https://david-dm.org/will-wow/result-async)
[![codecov](https://codecov.io/gh/will-wow/result-async/branch/master/graph/badge.svg)](https://codecov.io/gh/will-wow/result-async)

`result-async` focuses on making a few things easier in JavaScript/TypeScript:

1. Predictable error handling for synchronous and asynchronous functions
1. Handling errors in pipelines of synchronous and asynchronous functions
1. Making pipelines easy to read
1. Giving friendly names to proven functional programming concepts

## Install

```bash
npm i result-async pipeout --save
# or
yarn add result-async pipeout
```

Then import the functions and (in TypeScript) types you need:

```typescript
import { ok, okThen, okChainAsync, Result } from "result-async";
import { pipeA } from "pipeout";
```

## Useful addition: a pipe functions

`result-async` is designed to work with a `pipe` function. Ramda has [pipe](https://ramdajs.com/docs/#pipe) and [pipeP](https://ramdajs.com/docs/#pipeP) functions, and Lodash has [flow](https://lodash.com/docs/4.17.15#flow). But `pipe` and `flow` don't handle promise-returning functions, and `pipeP` won't handle adding a non-promise function to the middle of your pipeline.

For a typesafe `pipe` that handles async functions, you can use this author's [pipeout](https://github.com/will-wow/pipeout). `pipeout.pipeA` works like a normal `pipe`, but every function you add to the pipeline is partially applied, and you use `.value` to get the final result. That turns

```javascript
c(await b(a(await x)));
```

into

```javascript
pipe(x)(a)(b)(c).value;
```

It has a few other varients of `pipe`, you can see [the pipeout docs](https://will-wow.github.io/pipeout) for more information.

### Install pipeout

If you want to use pipeout, you just have to install and import it.

```bash
npm i result-async pipeout --save
# or
yarn add result-async pipeout
```

```typescript
import { pipeA } from "pipeout";
```

## Examples

Here are some example of what working with `result-async` looks like.
For more examples, and complete documentation, see
[the docs](https://will-wow.github.io/result-async/).

### Full Example

`result-async` helps you handle errors in a controlled, readable, and typesafe way,
using techniques from functional programming.

Here's an example of the sort of data-processing pipelines you can build:

```typescript
async function countAllComments(postsCache: PostsCache): Promise<number> {
  // prettier-ignore
  return pipeA
    (promiseToResult(postsCache.getCache()))
    (errorDo(console.error))
    (errorRescueAsync(fetchPosts))
    (okDo(logPostCount))
    (okDoAsync(postsCache.updateCache))
    (okThen(R.map(fetchCommentsForPost)))
    (okChainAsync(allOkAsync))
    (okThen(R.map(comments => comments.length)))
    (okThen(R.sum))
    (okDo(logCommentTotal))
    (okOrThrow)
    .value;
}
```

The basic premise is functions that start with `ok` will only operate on successful data,
and pass on error messages.
Functions that start with `error` will only operate on error messages, and either change
or try to rescue them back into successes.

Prefixing the function names makes it easy to scan a pipeline and find the error handling code.

Other functions transform other data structures to `Result`s (like `promiseToResult`),
or handle collections of `Result`s (like `allOkAsync`).

Functions ending in `async` will return a `Promise` that resolves to a `Result`. This helps
TypeScript track types, and helps developers differentiate between pure and impure functions.

See [./src/full-example](https://github.com/will-wow/result-async/blob/master/src/full-example.ts) for a full working example.

To run the example, run:

```bash
yarn ts-node -O '{"module": "commonjs"}' src/full-example.ts
```

### Techniques

#### React to errors inline

```typescript
import { isError } from "result-async";

const result = await tryToGetAListOfComments("my-blog-post");

const comments = isOk(result) ? result.ok : [];
```

#### Return a success or failure status

```typescript
import { ok, error } from "result-async";

return isAllWell() ? ok("all is well") : error("all is lost");
```

#### Kick off asynchronous calls without waiting for a response

```typescript
import { fetchUser, errorDo, errorRescueAsync } from "result-async";
import { pipeA } from "pipeout";

// prettier-ignore
pipeA
  (fetchUser())
  (errorDo(sendErrorToLoggingSystem))
  (errorRescueAsync(logOutUser))
);
```

#### Transform promise functions into result functions

```typescript
import { resultify, errorThen, okChainAsync } from "result-async";
import { pipeA } from "pipeout";

const fetchResult = resultify(fetch);

// prettier-ignore
pipeA
  (someUrl)
  (fetchResult)
  (errorThen(transformError))
  (okChainAsync(anotherAsyncFunction))
```

#### Return standard promises to interop with other functions

```typescript
import { okChain, errorReplace } from "result-async";
import { pipeA } from "pipeout";

function doStuff(): Promise<SomeData> {
  // prettier-ignore
  return pipeA(
    (someResultFunction)
    (okChain(validateData))
    (errorReplace("something went wrong"))
    (okOrThrow)
}
```

## Typescript

`result-async` is written in TypeScript, and it's built to help write typesafe error handling code. But it works great with vanilla JavaScript too!

One of the big benefits of `ResultP`, a `Promise` of a `Result`, is that `Promise`s don't have type information about their error case. But many promises have predictable error types. So, you can have your asynchronous functions return a `ResultP` to declare those errors types in the type system.

Also `ResultP`s should _always_ resolve and never be rejected. This means no more `try/catch` blocks, even when using `async/await`.

### Types

The important types are:

```typescript
type Result<OkData, ErrorMessage> = OkResult<Data> | ErrorResult<Message>;
type ResultP<OkData, ErrorMessage> = Promise<Result<OkData, ErrorMessage>>;
```

So a `Result` could be either Ok or an Error - and either way, the payload is strongly typed.

### Guards

[`isOk(result)`](https://will-wow.github.io/result-async/globals.html#isok) and
[`isError(result)`](https://will-wow.github.io/result-async/globals.html#iserror) are both typeguards, so if `isOk` returns true, typescript will know the Result is actually an OkResult:

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

## Testing with Result-Async

If you're using a library like [Jest](https://github.com/facebook/jest) for testing, you can generally follow your testing library's advice for [testing asynchronous code](https://jest-bot.github.io/jest/docs/asynchronous.html#content).

Unlike with standard promises, you don't have to worry about errored `ResultP`s throwing errors.

You'll probably want to test if your calls succeed or fail. If you want to check both the result and payload, try matching against another `result`:

```javascript
import { ok } from "result-async";

it("should be fine", async () => {
  expect(await myResultyFunction()).toEqual(ok("all is well"));
});
```

If you only want to check if a call succeeded for failed, you can just check for the presence of "ok" or "error".

```javascript
it("should be fine", async () => {
  expect(await myResultyFunction()).toHaveProperty("ok");
});
```

For more complicated checks you can use `okOrThrow/Error` to throw an error if the
result isn't what you expect, and otherwise extract the payload for further testing. For example:

```javascript
expect(okOrThrow(await myResultyFunction())).toContain("is well");
```

## Background

### Async Error Handling

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

When we can now use `async/await` to do this:

```javascript
try {
  data = await someFunction(data);
  data = await secondFunction(data);
  data = await thirdFunction(data);
} catch (e) {
  doSomethingWithError(e);
}
```

Much better. But still, errors are treated really differently than normal data. And in TypeScript, errors are also untyped. For a genuine exception that's fine, but there are a lot of cases where I expect a call to sometimes fail (for instance, a request to an endpoint that could 404). In those cases, having to rely on catching errors can feel a little heavyweight.

The functional programming world has an answer for this - the Result type. It's in [Haskell](http://book.realworldhaskell.org/read/error-handling.html#errors.either), [Ocaml](https://ocaml.org/learn/tutorials/error_handling.html#Result-type), [Elixir](https://medium.com/@moxicon/elixir-best-practices-for-error-values-50dc015a06f5), and more. The idea is to have a function that could fail return a response that's marked as either a Success or a Failure. Then you can react to that result status, pass it along, ignore it, or whatever - just like any other data structure.

In many FP languages, we have pattern matching to make this easier:

```elixir
case some_async_function() do
  {:ok, data} -> do_something(data)
  {:error, msg} -> do_something_else(msg)
end
```

We don't have that in JavaScript, but `result-async` tries to make it easy to create and handle `Result`s - even when they come from async functions:

```typescript
import { either } from "result-async";

either(
  await someAsyncFunction(),
  data => doSomething(data),
  msg => doSomethingElse(msg)
);
```

### What about Fantasy-Land

If you come from a Haskell-y background, you might be saying, "hey, `Result` is just an `Either` type, and `okThen` is just `map`". You're right! And if you're looking for more abstract functional programming, you may be interested in libraries like [Sanctuary](https://github.com/sanctuary-js/sanctuary) or [Folktalk](https://github.com/origamitower/folktale), which provide a Fantasy-Land compatible Either and Result types, respectively. [Fluture](https://github.com/fluture-js/Fluture) is also a great tool for Fantasy-Land compatible asynchronous programming.

But if your team isn't ready that all that, think of `Result-Async` like a gateway drug for full ADT-style programming. It lets you write composable, functional programs, but with functions names that are trying to be friendlier to people who don't think in monands.

## Publishing Updates

```bash
yarn docs
npm version patch | minor | major
npm publish
```
