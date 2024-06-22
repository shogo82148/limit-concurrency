/**
 * Limits the concurrency of asynchronous tasks.
 *
 * It runs the tasks in parallel but ensures that at any given time,
 * no more than the specified limit of tasks are being executed concurrently.
 * Once a task completes, another task (if any remain) is started,
 * maintaining the concurrency limit until all tasks have been executed.
 *
 * @param iter - An iterator or iterable of functions that return promises.
 * @param limit - The maximum number of concurrent promises.
 * @returns A promise that resolves when all tasks have been completed.
 */
export async function limitConcurrency<T>(
  iter: Iterator<() => Promise<T>> | Iterable<() => Promise<T>>,
  limit: number,
): Promise<void> {
  const iterator = Symbol.iterator in iter ? iter[Symbol.iterator]() : iter;
  async function runNext(): Promise<void> {
    for (;;) {
      const { value: task, done } = iterator.next();
      if (done) {
        return;
      }
      await task();
    }
  }

  try {
    const initialTasks: Promise<void>[] = [];
    for (let i = 0; i < limit; i++) {
      initialTasks.push(runNext());
    }

    await Promise.all(initialTasks);
  } finally {
    iterator.return?.();
  }
}

/**
 * Limits the concurrency of asynchronous tasks.
 *
 * It runs the tasks in parallel but ensures that at any given time,
 * no more than the specified limit of tasks are being executed concurrently.
 * Once a task completes, another task (if any remain) is started,
 * maintaining the concurrency limit until all tasks have been executed.
 *
 * @param iter - An iterator or iterable of functions that return promises.
 * @param limit - The maximum number of concurrent promises.
 * @returns A promise that resolves when all tasks have been completed.
 */
export async function asyncLimitConcurrency<T>(
  iter: AsyncIterator<() => Promise<T>> | AsyncIterable<() => Promise<T>>,
  limit: number,
): Promise<void> {
  const iterator = Symbol.asyncIterator in iter
    ? iter[Symbol.asyncIterator]()
    : iter;
  async function runNext(): Promise<void> {
    for (;;) {
      const { value: task, done } = await iterator.next();
      if (done) {
        return;
      }
      await task();
    }
  }

  try {
    const initialTasks: Promise<void>[] = [];
    for (let i = 0; i < limit; i++) {
      initialTasks.push(runNext());
    }

    await Promise.all(initialTasks);
  } finally {
    iterator.return?.();
  }
}
