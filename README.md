# limit_concurrency

[![.github/workflows/test.yaml](https://github.com/shogo82148/limit-concurrency/actions/workflows/test.yaml/badge.svg)](https://github.com/shogo82148/limit-concurrency/actions/workflows/test.yaml)
[![npm](https://img.shields.io/npm/v/@shogo82148/limit-concurrency)](https://www.npmjs.com/package/@shogo82148/limit-concurrency)
[![npm](https://img.shields.io/npm/dm/@shogo82148/limit-concurrency)](https://www.npmjs.com/package/@shogo82148/limit-concurrency)
[![JSR](https://jsr.io/badges/@shogo82148/limit-concurrency)](https://jsr.io/@shogo82148/limit-concurrency)

It runs the tasks in parallel but ensures that at any given time, no more than
the specified limit of tasks are being executed concurrently. Once a task
completes, another task (if any remain) is started, maintaining the concurrency
limit until all tasks have been executed.

```ts
import { limitConcurrency } from "@shogo82148/limit-concurrency";

function* taskGenerator(): Generator<() => Promise<void>> {
    for (let i = 0; i < 10; i++) {
        yield async () => {
            // Simulate an asynchronous task
            console.log(`Task ${i} started`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(`Task ${i} finished`);
        };
    }
}

const iterator = taskGenerator();
limitConcurrency(iterator, 2); // Limit concurrency to 2
```
