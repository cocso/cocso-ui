/**
 * The upstream timer leak the test setup works around
 *
 * `setup.ts` cancels timers still queued when a test file's environment is
 * torn down. That exists for one reason, and this pins the reason so it can be
 * removed when the reason goes away.
 *
 * `input-otp` schedules `setTimeout(fn, 0)`, `(fn, 10)` and `(fn, 50)` from a
 * `useEffect` that returns no cleanup, so unmounting `OneTimePasswordField`
 * does not stop them. When teardown lands inside that 50ms window the
 * callbacks run against a dead environment and vitest reports
 * `ReferenceError: window is not defined` as an unhandled error — the run
 * fails while every test passes, and it is attributed to whichever file was
 * executing rather than the one that leaked.
 *
 * If this test starts failing with zero timers left, the upstream bug is
 * fixed: drop the reclamation block in `setup.ts` and this file with it.
 */

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OneTimePasswordField } from "../components/one-time-password-field";
import { pendingTimers } from "./setup";

describe("Timers a component leaves behind", () => {
  it("OneTimePasswordField still leaks them on unmount", () => {
    const before = pendingTimers.size;
    const { unmount } = render(<OneTimePasswordField aria-label="인증번호" />);
    unmount();

    // Three today, one per `setTimeout` in input-otp's uncleaned effect. The
    // count is not asserted exactly — upstream is free to change how many it
    // schedules, and this only needs to notice when it schedules none.
    expect(
      pendingTimers.size - before,
      "`input-otp` no longer leaks timers on unmount. The reclamation block in `setup.ts` was only there for this — delete it and this file."
    ).toBeGreaterThan(0);
  });
});
