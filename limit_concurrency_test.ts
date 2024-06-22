import {
  assertEquals,
  assertLessOrEqual,
  assertRejects,
} from "jsr:@std/assert";
import { limitConcurrency } from "./limit_concurrency.ts";

// sleep is a utility function that resolves after the specified number of
// milliseconds.
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.test(async function limitConcurrencyIterableTest() {
  const limit = 3;
  const numTasks = 10;

  let done = 0;
  let concurrency = 0;
  let maxConcurrency = 0;
  const tasks: (() => Promise<void>)[] = [];
  for (let i = 0; i < numTasks; i++) {
    tasks.push(async () => {
      concurrency++;
      if (concurrency > maxConcurrency) {
        maxConcurrency = concurrency;
      }
      await sleep(10);
      concurrency--;
      done++;
    });
  }

  await limitConcurrency(tasks, limit);
  assertEquals(concurrency, 0);
  assertEquals(done, numTasks);
  assertLessOrEqual(maxConcurrency, limit);
});

Deno.test(async function limitConcurrencyIteratorTest() {
  const limit = 3;
  const numTasks = 10;

  let done = 0;
  let concurrency = 0;
  let maxConcurrency = 0;
  function* tasks(): Generator<() => Promise<void>> {
    for (let i = 0; i < numTasks; i++) {
      yield async () => {
        concurrency++;
        if (concurrency > maxConcurrency) {
          maxConcurrency = concurrency;
        }
        await sleep(10);
        concurrency--;
        done++;
      };
    }
  }

  await limitConcurrency(tasks(), limit);
  assertEquals(concurrency, 0);
  assertEquals(done, numTasks);
  assertLessOrEqual(maxConcurrency, limit);
});

Deno.test(async function limitConcurrencyThrowTest() {
  let done = false;
  function* tasks(): Generator<() => Promise<void>> {
    try {
      yield async () => {};
      yield async () => {
        await sleep(1);
        throw new Error("Task failed");
      };
      yield async () => {};
    } finally {
      done = true;
    }
  }

  await assertRejects(() => limitConcurrency(tasks(), 1), Error);
  assertEquals(done, true);
});

Deno.test(async function asyncLimitConcurrencyAsyncIteratorTest() {
  const limit = 3;
  const numTasks = 10;

  let done = 0;
  let concurrency = 0;
  let maxConcurrency = 0;
  async function* tasks() {
    for (let i = 0; i < numTasks; i++) {
      await sleep(1);
      yield async () => {
        concurrency++;
        if (concurrency > maxConcurrency) {
          maxConcurrency = concurrency;
        }
        await sleep(10);
        concurrency--;
        done++;
      };
    }
  }

  await limitConcurrency(tasks(), limit);
  assertEquals(concurrency, 0);
  assertEquals(done, numTasks);
  assertLessOrEqual(maxConcurrency, limit);
});

Deno.test(async function asyncLimitConcurrencyThrowTest() {
  let done = false;
  async function* tasks() {
    try {
      await sleep(1);
      yield async () => {};
      await sleep(1);
      yield async () => {
        await sleep(10);
        throw new Error("Task failed");
      };
      await sleep(1);
      yield async () => {};
    } finally {
      done = true;
    }
  }

  await assertRejects(() => limitConcurrency(tasks(), 1), Error);
  assertEquals(done, true);
});
