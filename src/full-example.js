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
var R = require("ramda");
var cross_fetch_1 = require("cross-fetch");
// An example of working with `result-async` in different ways.
//
// To run the functions, run:
//
// ```bash
// yarn ts-node ./src/full-example.ts
// ```
var index_1 = require("./index");
var pipeout_1 = require("pipeout");
var baseUrl = "https://jsonplaceholder.typicode.com";
/**
 * Example of piping sync and async result functions.
 * Count all comments on https://jsonplaceholder.typicode.com
 * May pull from a local cache, or go out to the internet, for Posts.
 *
 * Note now it's easy to scan for error handling code by looking at the
 * first word of the functions in the pipe.
 */
function countAllComments(postsCache) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // prettier-ignore
            return [2 /*return*/, pipeout_1.pipeA(index_1.promiseToResult(postsCache.getCache()))(index_1.errorDo(console.error))(index_1.errorRescueAsync(fetchPosts))(index_1.okDo(logPostCount))(index_1.okDoAsync(postsCache.updateCache))(index_1.okThen(R.map(fetchCommentsForPost)))(index_1.okChainAsync(index_1.allOkAsync))(index_1.okThen(R.map(function (comments) { return comments.length; })))(index_1.okThen(R.sum))(index_1.okDo(logCommentTotal))(index_1.okOrThrow)
                    .value];
        });
    });
}
/**
 * Same as countAllComments, but without result-async, for comparison.
 */
function promiseCountAllComments(postsCache) {
    return __awaiter(this, void 0, void 0, function () {
        var posts, promises, postComments, counts, total;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, postsCache.getCache()["catch"](function (error) {
                        console.error(error);
                        return fetchPostsPromise();
                    })];
                case 1:
                    posts = _a.sent();
                    logPostCount(posts);
                    return [4 /*yield*/, postsCache.updateCache(posts)];
                case 2:
                    _a.sent();
                    promises = posts.map(fetchCommentsForPostPromise);
                    return [4 /*yield*/, Promise.all(promises)];
                case 3:
                    postComments = _a.sent();
                    counts = postComments.map(function (comments) { return comments.length; });
                    total = R.sum(counts);
                    logCommentTotal(total);
                    return [2 /*return*/, total];
            }
        });
    });
}
/**
 * Same as promiseCountAllComments, but with just using result-async for error handling.
 */
function awaitCountAllComments(postsCache) {
    return __awaiter(this, void 0, void 0, function () {
        var cachedPosts, posts, _a, promises, postCommentsResults, postComments, counts, total;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, index_1.promiseToResult(postsCache.getCache())];
                case 1:
                    cachedPosts = _b.sent();
                    if (index_1.isError(cachedPosts)) {
                        console.error(cachedPosts.error);
                    }
                    if (!index_1.isOk(cachedPosts)) return [3 /*break*/, 2];
                    _a = cachedPosts;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fetchPosts()];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    posts = _a;
                    if (index_1.isError(posts))
                        throw posts.error;
                    logPostCount(posts.ok);
                    return [4 /*yield*/, postsCache.updateCache(posts.ok)];
                case 5:
                    _b.sent();
                    promises = posts.ok.map(fetchCommentsForPost);
                    return [4 /*yield*/, Promise.all(promises)];
                case 6:
                    postCommentsResults = _b.sent();
                    postComments = index_1.allOk(postCommentsResults);
                    if (index_1.isError(postComments))
                        throw postComments.error;
                    counts = postComments.ok.map(function (comments) { return comments.length; });
                    total = R.sum(counts);
                    logCommentTotal(total);
                    return [2 /*return*/, total];
            }
        });
    });
}
/**
 * A simulation of an async cache that may be expired.
 */
var PostsCache = /** @class */ (function () {
    function PostsCache(cache) {
        var _this = this;
        this.cache = cache;
        this.getCache = function () {
            return Math.random() > 0.5
                ? Promise.resolve(_this.cache)
                : Promise.reject("cache expired");
        };
        this.updateCache = function (cache) {
            _this.cache = cache;
            return Promise.resolve(_this.cache);
        };
    }
    return PostsCache;
}());
function fetchPosts() {
    return get("/posts");
}
function fetchCommentsForPost(post) {
    return get("/comments?postId=" + post.id);
}
function fetchPostsPromise() {
    return promiseGet("/posts");
}
function fetchCommentsForPostPromise(post) {
    return promiseGet("/comments?postId=" + post.id);
}
function logPostCount(posts) {
    console.log("found " + posts.length + " posts");
}
function logCommentTotal(total) {
    console.log("total:", total);
}
function promiseGet(url) {
    return cross_fetch_1["default"]("" + baseUrl + url).then(function (res) { return res.json(); });
}
function get(url) {
    // prettier-ignore
    return pipeout_1.pipeA(fetchResult("" + baseUrl + url))(index_1.okChainAsync(function (res) { return index_1.promiseToResult(res.json()); }))
        .value;
}
var fetchResult = index_1.resultify(cross_fetch_1["default"]);
// From https://jsonplaceholder.typicode.com/posts
var postsCache = new PostsCache([
    {
        userId: 1,
        id: 1,
        title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    {
        userId: 1,
        id: 2,
        title: "qui est esse",
        body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    }
]);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("==pipe==");
                    return [4 /*yield*/, countAllComments(postsCache)];
                case 1:
                    _a.sent();
                    console.log("==await resuts==");
                    return [4 /*yield*/, promiseCountAllComments(postsCache)];
                case 2:
                    _a.sent();
                    console.log("==await promises==");
                    return [4 /*yield*/, awaitCountAllComments(postsCache)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
