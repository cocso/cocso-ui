/**
 * Accessibility — the dimension none of the other guards look at
 *
 * Everything else here measures colour: contrast against a surface, a token
 * that does not flip, a value hardcoded where the theme cannot reach it. That
 * caught real defects, and it is one axis. Nothing has ever checked the rest of
 * what makes a component usable — that a control has an accessible name, that a
 * label is tied to the field it labels, that a role and its required attributes
 * agree.
 *
 * This runs axe over each exported component in a representative state. It is a
 * floor, not an audit: axe finds a fraction of accessibility defects, and a
 * static render finds a fraction of those — keyboard order, focus movement and
 * screen-reader output are not visible here. What it does do is stop the
 * obvious ones entering, which is the same job the colour guards do.
 *
 * jsdom computes no layout, so rules that need geometry (`color-contrast`,
 * target size) cannot run and are disabled explicitly rather than left to fail
 * quietly. Contrast is covered by `module-css-contrast.test.ts` and the recipe
 * checks against the real token values.
 */

import { render } from "@testing-library/react";
import axe from "axe-core";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { Accordion } from "../components/accordion";
import { Alert } from "../components/alert";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";
import { Breadcrumb } from "../components/breadcrumb";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Checkbox } from "../components/checkbox";
import { Input } from "../components/input";
import { Link } from "../components/link";
import { Pagination } from "../components/pagination";
import { Progress } from "../components/progress";
import { RadioGroup } from "../components/radio-group";
import { Select } from "../components/select";
import { Skeleton } from "../components/skeleton";
import { Spinner } from "../components/spinner";
import { StockQuantityStatus } from "../components/stock-quantity-status";
import { Switch } from "../components/switch";
import { Typography } from "../components/typography";

/**
 * Rules that need a rendered box to evaluate. jsdom has none, so they would
 * report nothing at all — turning them off says that out loud instead of
 * letting the suite look like it covered them.
 */
const NEEDS_LAYOUT = [
  "color-contrast",
  "target-size",
  "scrollable-region-focusable",
];

async function violations(ui: () => ReactElement) {
  const { container } = render(ui());
  const results = await axe.run(container, {
    rules: Object.fromEntries(
      NEEDS_LAYOUT.map((rule) => [rule, { enabled: false }])
    ),
  });
  return results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`
  );
}

const CASES: [string, () => ReactElement][] = [
  [
    "Accordion",
    () => <Accordion items={[{ content: "내용", title: "제목" }]} />,
  ],
  ["Alert", () => <Alert title="알림">본문</Alert>],
  ["Avatar", () => <Avatar alt="사용자" fallback="김" />],
  ["Badge", () => <Badge>배지</Badge>],
  [
    "Breadcrumb",
    () => (
      <Breadcrumb items={[{ href: "/", label: "홈" }, { label: "현재" }]} />
    ),
  ],
  ["Button", () => <Button>버튼</Button>],
  ["Button, loading", () => <Button loading>버튼</Button>],
  ["Card", () => <Card>내용</Card>],
  ["Checkbox", () => <Checkbox label="동의" />],
  ["Input", () => <Input label="이름" placeholder="이름" />],
  ["Input, error", () => <Input error="필수 항목입니다" label="이름" />],
  [
    "Input, password toggle",
    () => <Input label="비밀번호" passwordToggle type="password" />,
  ],
  ["Link", () => <Link href="/">링크</Link>],
  ["Pagination", () => <Pagination page={1} total={5} />],
  ["Progress", () => <Progress value={40} />],
  [
    // Labelled the way the component intends: the item renders the control and
    // the caller pairs it with a `<label htmlFor>`. The first version of this
    // case passed a `label` prop that does not exist, which axe correctly
    // reported as an unnamed toggle — a false finding produced by the check,
    // not by the component.
    "RadioGroup",
    () => (
      <RadioGroup value="a">
        <RadioGroup.Item id="radio-a" value="a">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <label htmlFor="radio-a">첫째</label>
        <RadioGroup.Item id="radio-b" value="b">
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <label htmlFor="radio-b">둘째</label>
      </RadioGroup>
    ),
  ],
  [
    "Select",
    () => (
      <Select label="분류">
        <option value="a">첫째</option>
      </Select>
    ),
  ],
  ["Skeleton", () => <Skeleton />],
  ["Spinner", () => <Spinner />],
  [
    "StockQuantityStatus",
    () => <StockQuantityStatus quantity="normal">정상</StockQuantityStatus>,
  ],
  ["Switch", () => <Switch label="알림 받기" />],
  ["Typography", () => <Typography>본문</Typography>],
];

describe("Components have no axe violations in a static render", () => {
  it("covers a meaningful share of the exported components", () => {
    expect(CASES.length).toBeGreaterThan(15);
  });

  it.each(CASES)("%s", async (_name, ui) => {
    expect(await violations(ui)).toEqual([]);
  });
});
