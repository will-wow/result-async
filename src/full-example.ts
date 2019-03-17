import fetch from "cross-fetch";
import * as R from "ramda";

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
  pipeAsync,
  promiseToResult,
  Result,
  resultify,
  ResultP
} from "./index";

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
  return pipeAsync(
    promiseToResult(postsCache.getCache()),
    errorDo(console.error),
    errorRescueAsync(() => get<Post[]>("/posts")),
    okDo(posts => console.log(`found ${posts.length} posts`)),
    okDoAsync(postsCache.updateCache),
    okThen(R.map(post => get<Comment[]>(`/comments?postId=${post.id}`))),
    okChainAsync(allOkAsync),
    okThen(R.map(comments => comments.length)),
    okThen(R.sum),
    okDo(total => console.log("total:", total)),
    okOrThrow
  );
}

/**
 * Same as countAllComments, but without result-async, for comparison.
 */
async function promiseCountAllComments(postsCache: PostsCache) {
  let posts: Post[];
  posts = await postsCache.getCache().catch(error => {
    console.error(error);
    return promiseGet("/posts");
  });

  console.log(`found ${posts.length} posts`);
  await postsCache.updateCache(posts);

  const promises = posts.map(post =>
    promiseGet<Comment[]>(`/comments?postId=${post.id}`)
  );

  const postComments = await Promise.all(promises);

  const counts = postComments.map(comments => comments.length);

  const total = R.sum(counts);

  console.log("total:", total);
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

  const posts: Result<Post[], string> = isOk(cachedPosts)
    ? cachedPosts
    : await get<Post[]>("/posts");

  if (isError(posts)) throw posts.error;

  console.log(`found ${posts.ok.length} posts`);
  await postsCache.updateCache(posts.ok);

  const promises = posts.ok.map(post =>
    get<Comment[]>(`/comments?postId=${post.id}`)
  );

  const postCommentsResults = await Promise.all(promises);
  const postComments = allOk(postCommentsResults);
  if (isError(postComments)) throw postComments.error;

  const counts = postComments.ok.map(comments => comments.length);

  const total = R.sum(counts);

  console.log("total:", total);
  return total;
}

const fetchResult = resultify(fetch);

function promiseGet<T>(url: string): Promise<T> {
  return fetch(`${baseUrl}${url}`).then(res => res.json());
}

function get<T>(url: string): ResultP<T, any> {
  return pipeAsync(
    fetchResult(`${baseUrl}${url}`),
    okChainAsync(res => promiseToResult(res.json()))
  );
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
  promiseCountAllComments(postsCache);
  console.log("==await promises==");
  awaitCountAllComments(postsCache);
}

main();
