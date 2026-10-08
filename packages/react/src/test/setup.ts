import "@testing-library/jest-dom";
import { afterAll } from "vitest";

global.ResizeObserver = class ResizeObserver {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
};

if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}

/**
 * Timers a test leaves behind are cancelled when it ends.
 *
 * A component that schedules work on mount and never cancels it keeps that
 * work queued after the test unmounts it. The callback then runs against an
 * environment that is being torn down and throws `ReferenceError: window is
 * not defined`, which vitest reports as an unhandled error — the run fails
 * while every test passes, and it is pinned to whichever file happened to be
 * executing, not to the one that leaked. That is as misleading as a failure
 * gets, and it only reproduces when teardown lands inside the timer's window,
 * so it shows up as a rare red CI on an unrelated change.
 *
 * `input-otp` is the live example: it schedules `setTimeout(fn, 0)`, `(fn, 10)`
 * and `(fn, 50)` from a `useEffect` that returns no cleanup, so unmounting
 * `OneTimePasswordField` cannot stop them. The fix belongs upstream and this
 * cannot wait for it.
 *
 * Draining instead of cancelling — sleeping ~60ms after each test so the
 * callbacks run while the environment is still alive — also works and costs a
 * minute across the suite. Cancelling is O(1).
 *
 * `afterAll`, not `afterEach`. Cancelling between tests also kills timers a
 * component legitimately uses to undo something: Base UI restores the body's
 * scroll lock from one, and cutting it left the lock in place so every later
 * test in the file rendered into a body sized `calc(100dvh - nanpx)` and could
 * not find its menu. Six dropdown tests failed that way. The unhandled error
 * only ever happens at the environment's teardown, so that is the only place
 * this needs to reach.
 *
 * This is deliberately not `vi.useFakeTimers()`: that would change the timing
 * every test sees, and these tests drive real user interaction through
 * `userEvent`, which schedules its own waits.
 */
export const pendingTimers = new Set<ReturnType<typeof setTimeout>>();

const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;
const realSetInterval = globalThis.setInterval;
const realClearInterval = globalThis.clearInterval;

globalThis.setTimeout = ((
  handler: TimerHandler,
  timeout?: number,
  ...args: unknown[]
) => {
  const id = realSetTimeout(
    (...called: unknown[]) => {
      pendingTimers.delete(id);
      if (typeof handler === "function") {
        handler(...called);
      }
    },
    timeout,
    ...args
  );
  pendingTimers.add(id);
  return id;
}) as typeof globalThis.setTimeout;

globalThis.clearTimeout = ((id?: ReturnType<typeof setTimeout>) => {
  if (id !== undefined) {
    pendingTimers.delete(id);
  }
  return realClearTimeout(id);
}) as typeof globalThis.clearTimeout;

const pendingIntervals = new Set<ReturnType<typeof setInterval>>();

globalThis.setInterval = ((
  handler: TimerHandler,
  timeout?: number,
  ...args: unknown[]
) => {
  const id = realSetInterval(handler, timeout, ...args);
  pendingIntervals.add(id);
  return id;
}) as typeof globalThis.setInterval;

globalThis.clearInterval = ((id?: ReturnType<typeof setInterval>) => {
  if (id !== undefined) {
    pendingIntervals.delete(id);
  }
  return realClearInterval(id);
}) as typeof globalThis.clearInterval;

afterAll(() => {
  for (const id of pendingTimers) {
    realClearTimeout(id);
  }
  pendingTimers.clear();
  for (const id of pendingIntervals) {
    realClearInterval(id);
  }
  pendingIntervals.clear();
});
