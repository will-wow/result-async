import * as R from "ramda";
import fetch from "cross-fetch";

// An example of working with `result-async` in different ways.
//
// To run the functions, run:
//
// ```bash
// yarn ts-node ./src/full-example.ts
// ```

import {
  allOk,
  allOkAsync,
  errorDo,
  errorRescueAsync,
  isError,
  isOk,
  okChainAsync,
  okDo,
  okDoAsync,
  okOrThrow,
  okThen,
  promiseToResult,
  resultify,
  ResultP
} from "./index";

import { pipeA } from "pipeout";

interface Post {
  userId: number;
  id: number;
  title: string;
  body?: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const baseUrl = "https://jsonplaceholder.typicode.com";

/**
 * Example of piping sync and async result functions.
 * Count all comments on https://jsonplaceholder.typicode.com
 * May pull from a local cache, or go out to the internet, for Posts.
 *
 * Note now it's easy to scan for error handling code by looking at the
 * first word of the functions in the pipe.
 */
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

/**
 * Same as countAllComments, but without result-async, for comparison.
 */
async function promiseCountAllComments(postsCache: PostsCache) {
  let posts: Post[];
  posts = await postsCache.getCache().catch(error => {
    console.error(error);
    return fetchPostsPromise();
  });

  logPostCount(posts);
  await postsCache.updateCache(posts);

  const promises = posts.map(fetchCommentsForPostPromise);

  const postComments = await Promise.all(promises);

  const counts = postComments.map(comments => comments.length);

  const total = R.sum(counts);
  logCommentTotal(total);

  return total;
}

/**
 * Same as promiseCountAllComments, but with just using result-async for error handling.
 */
async function awaitCountAllComments(postsCache: PostsCache) {
  const cachedPosts = await promiseToResult(postsCache.getCache());

  if (isError(cachedPosts)) {
    console.error(cachedPosts.error);
  }

  const posts = isOk(cachedPosts) ? cachedPosts : await fetchPosts();

  if (isError(posts)) throw posts.error;

  logPostCount(posts.ok);
  await postsCache.updateCache(posts.ok);

  const promises = posts.ok.map(fetchCommentsForPost);

  const postCommentsResults = await Promise.all(promises);
  const postComments = allOk(postCommentsResults);
  if (isError(postComments)) throw postComments.error;

  const counts = postComments.ok.map(comments => comments.length);

  const total = R.sum(counts);
  logCommentTotal(total);

  return total;
}

/**
 * A simulation of an async cache that may be expired.
 */
class PostsCache {
  constructor(private cache: Post[]) {}

  getCache = (): Promise<Post[]> => {
    return Math.random() > 0.5
      ? Promise.resolve(this.cache)
      : Promise.reject("cache expired");
  };

  updateCache = (cache: Post[]): Promise<Post[]> => {
    this.cache = cache;
    return Promise.resolve(this.cache);
  };
}

function fetchPosts() {
  return get<Post[]>("/posts");
}

function fetchCommentsForPost(post: Post) {
  return get<Comment[]>(`/comments?postId=${post.id}`);
}

function fetchPostsPromise() {
  return promiseGet<Post[]>("/posts");
}

function fetchCommentsForPostPromise(post: Post) {
  return promiseGet<Comment[]>(`/comments?postId=${post.id}`);
}

function logPostCount(posts: Post[]): void {
  console.log(`found ${posts.length} posts`);
}

function logCommentTotal(total: number): void {
  console.log("total:", total);
}

function promiseGet<T>(url: string): Promise<T> {
  return fetch(`${baseUrl}${url}`).then(res => res.json());
}

function get<T>(url: string): ResultP<T, any> {
  // prettier-ignore
  return pipeA
    (fetchResult(`${baseUrl}${url}`))
    (okChainAsync(res => promiseToResult(res.json())))
    .value
}

const fetchResult = resultify(fetch);

// From https://jsonplaceholder.typicode.com/posts
const postsCache = new PostsCache([
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body:
      "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body:
      "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  }
]);

async function main() {
  console.log("==pipe==");
  await countAllComments(postsCache);
  console.log("==await resuts==");
  await promiseCountAllComments(postsCache);
  console.log("==await promises==");
  await awaitCountAllComments(postsCache);
}

main();
