/**
 * Stories with a committed baseline must not read the clock
 *
 * AGENTS.md has said for a while that a story with a visual-regression
 * baseline must render deterministically. Nothing enforced it, and it has now
 * been broken twice by the same mistake:
 *
 * - `Avatar` fetched a random-avatar service and failed when it served
 *   different bytes.
 * - `DayPicker / Disabled` rendered `new Date()` as its trigger label and
 *   failed every unrelated PR opened after the baseline was taken. It was
 *   pinned.
 * - `MonthPicker / Disabled` did exactly the same thing and was missed when
 *   DayPicker was fixed. It sat green for as long as the month did not turn,
 *   then failed an unrelated PR on 1 October — a change to a test file and a
 *   markdown document — with 551 differing pixels.
 *
 * The second and third are one bug fixed once. A rule that lives only in prose
 * gets applied to the instance in front of someone, so this asserts it.
 *
 * Reading the clock is not banned outright: a story may legitimately derive
 * bounds from today as long as nothing time-dependent reaches the pixels. That
 * is a judgement about the story, so each one states it here rather than
 * inheriting a blanket exemption — which is how `text-tertiary` stopped being
 * checked in the contrast test until the exemption was narrowed.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = join(import.meta.dirname, "..", "components");

/** Anything whose value differs between the capture and the comparison. */
const NON_DETERMINISTIC = /new Date\(\)|Date\.now\(\)|Math\.random\(\)/;

/**
 * Uses that cannot reach the screenshot, keyed by the exact source line.
 *
 * Keyed by line text, not by file: a file on this list must not be able to
 * grow a new clock read and stay exempt. Both entries below feed `minDate` /
 * `maxDate`, which change which days inside the popover are selectable — and
 * both stories screenshot a closed trigger whose label is a fixed string. If
 * either ever renders its panel, it needs a pinned date instead of a line
 * here.
 */
const EXEMPT_LINES: Readonly<Record<string, string>> = {
  "const today = new Date();":
    "DayPicker/WithMinMax — bounds only; the trigger reads `이번 달만 선택 가능` and the story is captured closed",
  "const min = new Date();":
    "DateTimePicker/MinAndMax — bounds only; the trigger reads `날짜와 시각 선택` and the story is captured closed",
  "const max = new Date();":
    "DateTimePicker/MinAndMax — the other half of the same booking window",
};

function storyFiles(): string[] {
  const found: string[] = [];
  for (const dir of readdirSync(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }
    for (const entry of readdirSync(join(COMPONENTS_DIR, dir.name))) {
      if (entry.endsWith(".stories.tsx")) {
        found.push(`${dir.name}/${entry}`);
      }
    }
  }
  return found.sort();
}

const STORY_FILES = storyFiles();

describe("Stories render the same thing every time they are captured", () => {
  it("finds the story files", () => {
    // A floor, so this failing to match anything is itself a failure rather
    // than a silent pass over zero files.
    expect(STORY_FILES.length).toBeGreaterThan(20);
  });

  it("has no story that reads the clock into its pixels", () => {
    const offenders: string[] = [];
    for (const file of STORY_FILES) {
      const css = readFileSync(join(COMPONENTS_DIR, file), "utf-8");
      css.split("\n").forEach((text, index) => {
        const trimmed = text.trim();
        // A line that only explains the rule is not a breach of it.
        if (trimmed.startsWith("//") || trimmed.startsWith("*")) {
          return;
        }
        if (NON_DETERMINISTIC.test(trimmed) && !(trimmed in EXEMPT_LINES)) {
          offenders.push(`${file}:${index + 1} ${trimmed}`);
        }
      });
    }
    expect(
      offenders,
      "a story reads the clock or the random generator. Its baseline is captured once and compared forever, so the story fails on an unrelated PR the moment the value moves — `MonthPicker / Disabled` did this and broke a docs-only change when the month turned. Pin the value, or add the line to EXEMPT_LINES with the reason it cannot reach the screenshot."
    ).toEqual([]);
  });
});
