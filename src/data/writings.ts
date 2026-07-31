// src/data/writings.ts
// The order the writings ledger uses when it is sorted by relevance, which is the
// order it lands in. Reasoning, so future-me can argue with it:
//
//   1. The pieces with a voice of their own lead. A monad post that swears at the
//      reader and an essay about what AI sits between are the two nobody else
//      could have written, and they are what gets shared.
//   2. Then the from-scratch builds. A reactive system and a cache rebuilt by
//      hand say more about how someone thinks than any tutorial does.
//   3. Then the networking run, newest transport first, since that is where the
//      steady search traffic lives.
//   4. JavaScript fundamentals last. They are the most searched and the least
//      distinguishing, and search finds them without help from this page.
//
// Anything missing from this list falls to the end, newest first.

export const WRITING_RELEVANCE = [
    "what-the-fk-is-a-monad-again",
    "the-thing-in-between",
    "building-a-tiny-reactive-system",
    "caching-strategies-from-scratch",
    "quic",
    "http-versions",
    "tcp-vs-udp",
    "javascript-closures-and-scope",
    "deep-dive-into-javascript-array-methods",
    "deep-dive-into-javascript-sorting",
    "functional-programming-in-javascript",
];
