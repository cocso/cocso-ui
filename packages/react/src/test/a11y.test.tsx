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

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DeleteIcon } from "@cocso-ui/react-icons";
import { act, render } from "@testing-library/react";
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
import { DateTimePicker } from "../components/date-time-picker";
import { DayPicker } from "../components/day-picker";
import { Dialog } from "../components/dialog";
import { Dropdown } from "../components/dropdown";
import { Field } from "../components/field";
import { FileRow } from "../components/file-row";
import { Input } from "../components/input";
import { InputTrigger } from "../components/input-trigger";
import { Link } from "../components/link";
import { MonthPicker } from "../components/month-picker";
import { OneTimePasswordField } from "../components/one-time-password-field";
import { Pagination } from "../components/pagination";
import { Popover } from "../components/popover";
import { Progress } from "../components/progress";
import { RadioGroup } from "../components/radio-group";
import { Select } from "../components/select";
import { Skeleton } from "../components/skeleton";
import { Spinner } from "../components/spinner";
import { StockQuantityStatus } from "../components/stock-quantity-status";
import { Switch } from "../components/switch";
import { Tab } from "../components/tab";
import { Toaster } from "../components/toast";
import { Tooltip } from "../components/tooltip";
import { Typography } from "../components/typography";

/**
 * Rules that need a rendered box to evaluate. jsdom has none, so they would
 * report nothing at all — turning them off says that out loud instead of
 * letting the suite look like it covered them.
 */
const COMPONENTS_DIR = join(import.meta.dirname, "..", "components");

const NEEDS_LAYOUT = [
  "color-contrast",
  "target-size",
  "scrollable-region-focusable",
];

/**
 * Where axe should look.
 *
 * `container` is the rendered subtree, which is right for everything that
 * renders in place. A component that portals — Dialog, Dropdown, Popover,
 * Tooltip — puts its panel on `document.body`, outside that subtree, so a
 * container-scoped run would inspect an empty wrapper and pass without having
 * read the thing the case is about.
 */
type Scope = "container" | "document";

/**
 * Base UI's focus guards — the `tabindex="0"` sentinels it mounts around an
 * open popup to keep Tab inside it. They are upstream markup nothing here can
 * change, and they are excluded as nodes rather than by switching a rule off,
 * so the same rule still fails on our own markup. The browser pass excludes
 * the same selector; it sees them as `aria-hidden-focus` because there they
 * carry `aria-hidden`, while in jsdom they carry `role="button"` and come back
 * as `aria-command-name` — one element, two names for the same finding.
 */
const BASE_UI_FOCUS_GUARD = "[data-base-ui-focus-guard]";

/**
 * `region` wants every piece of content inside a landmark. Scoping to the
 * document means axe sees a bare component with no page around it, so it fires
 * on all of them, and a component library does not own the page's landmarks.
 * Off for document-scoped runs only — a container-scoped run never reaches it,
 * and leaving it on there costs nothing.
 */
const HARNESS_RULES = ["region"];

async function violations(ui: () => ReactElement, scope: Scope = "container") {
  const { container, unmount } = render(ui());
  // Let the popup settle before reading it: Base UI positions and marks its
  // panel after mount, and axe would otherwise read a half-built tree.
  await act(async () => {
    await Promise.resolve();
  });
  const context =
    scope === "document"
      ? { exclude: [[BASE_UI_FOCUS_GUARD]], include: [["body"]] }
      : container;
  const disabled = [
    ...NEEDS_LAYOUT,
    ...(scope === "document" ? HARNESS_RULES : []),
  ];
  const results = await axe.run(context, {
    rules: Object.fromEntries(
      disabled.map((rule) => [rule, { enabled: false }])
    ),
  });
  // Unmount here rather than leaving it to the automatic cleanup. A component
  // that schedules work on mount — `OneTimePasswordField` does — otherwise has
  // a timer still queued when the environment is torn down, and it lands as a
  // `window is not defined` unhandled error attributed to whichever file is
  // running at the time. That failed the run while every test passed.
  unmount();
  return results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`
  );
}

const CASES: [string, () => ReactElement, Scope?][] = [
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
  [
    "FileRow, with actions",
    () => (
      <FileRow
        actions={
          <Button aria-label="삭제" size="x-small" svgOnly variant="ghost">
            <DeleteIcon size={14} />
          </Button>
        }
        href="/files/a.pdf"
        name="사업자등록증.pdf"
      />
    ),
  ],
  [
    "DateTimePicker",
    () => <DateTimePicker value={new Date(2024, 0, 15, 14, 30)} />,
  ],
  ["DayPicker", () => <DayPicker value={new Date(2024, 0, 15)} />],
  // Open, and scoped to the document: the panel is the part worth checking and
  // it is not inside the render container.
  [
    "Dialog, open",
    () => (
      <Dialog defaultOpen>
        <Dialog.Trigger render={<Button>열기</Button>} />
        <Dialog.Content>
          <Dialog.Close />
          <Dialog.Title>제목</Dialog.Title>
          <Dialog.Description>설명</Dialog.Description>
        </Dialog.Content>
      </Dialog>
    ),
    "document",
  ],
  [
    "Dropdown, open",
    () => (
      <Dropdown defaultOpen>
        <Dropdown.Trigger render={<Button variant="outline">메뉴</Button>} />
        <Dropdown.Content>
          <Dropdown.Item>편집</Dropdown.Item>
          <Dropdown.Item disabled>비활성</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    ),
    "document",
  ],
  [
    "Field",
    () => (
      <Field description="주민등록상 이름" htmlFor="name" label="이름">
        <Input id="name" />
      </Field>
    ),
  ],
  [
    "Field, error",
    () => (
      <Field error="필수 항목입니다" htmlFor="name-2" label="이름">
        <Input id="name-2" />
      </Field>
    ),
  ],
  ["FileRow", () => <FileRow name="사업자등록증.pdf" />],
  ["Input", () => <Input label="이름" placeholder="이름" />],
  ["Input, error", () => <Input error="필수 항목입니다" label="이름" />],
  [
    "Input, password toggle",
    () => <Input label="비밀번호" passwordToggle type="password" />,
  ],
  [
    "InputTrigger",
    () => <InputTrigger placeholder="선택하세요">값</InputTrigger>,
  ],
  ["Link", () => <Link href="/">링크</Link>],
  ["MonthPicker", () => <MonthPicker value={new Date(2024, 0, 1)} />],
  [
    "OneTimePasswordField",
    () => <OneTimePasswordField aria-label="인증번호" />,
  ],
  ["Pagination", () => <Pagination page={1} total={5} />],
  [
    "Popover, open",
    () => (
      <Popover defaultOpen>
        <Popover.Trigger render={<Button variant="outline">열기</Button>} />
        <Popover.Content aria-label="상세">내용</Popover.Content>
      </Popover>
    ),
    "document",
  ],
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
  [
    "Tab",
    () => (
      <Tab defaultValue="one">
        <Tab.List>
          <Tab.Trigger value="one">첫째</Tab.Trigger>
          <Tab.Trigger value="two">둘째</Tab.Trigger>
        </Tab.List>
        <Tab.Content value="one">첫째 내용</Tab.Content>
        <Tab.Content value="two">둘째 내용</Tab.Content>
      </Tab>
    ),
  ],
  // `Toaster` is sonner's, re-exported from this package's index, so it is one
  // of the exported components the rule covers. It renders its live region
  // with nothing in it, which is the state it spends almost all its time in.
  ["Toaster", () => <Toaster />],
  [
    "Tooltip, open",
    () => (
      <Tooltip defaultOpen>
        <Tooltip.Trigger render={<Button variant="outline">도움말</Button>} />
        <Tooltip.Content>
          <Tooltip.Arrow />
          설명
        </Tooltip.Content>
      </Tooltip>
    ),
    "document",
  ],
  ["Typography", () => <Typography>본문</Typography>],
];

describe("Components have no axe violations in a static render", () => {
  /**
   * Against the directory, not against a floor.
   *
   * This used to be `expect(CASES.length).toBeGreaterThan(15)`, which catches
   * a check that stopped covering things and not the direction these actually
   * break in: a component the check has never heard of. Nineteen cases cleared
   * a floor of fifteen while fourteen components had none at all — every
   * overlay, every picker, `Field`, `Tab`, `InputTrigger`. AGENTS.md has
   * required enumeration-against-reality since the recipe contrast list was
   * found holding six of nineteen; this file was the next instance of it.
   */
  it("has a case for every component", () => {
    const covered = new Set(CASES.map(([name]) => name.split(",")[0].trim()));
    const missing = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          !entry.name.startsWith(".") &&
          // A directory is a component when it exports one. `picker/` holds
          // only the stylesheets the three pickers share.
          existsSync(join(COMPONENTS_DIR, entry.name, `${entry.name}.tsx`))
      )
      .map((entry) =>
        entry.name
          .split("-")
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join("")
      )
      .filter((name) => !covered.has(name));

    expect(
      missing,
      'a component has no axe case, so nothing checks it in a static render. Add one in a representative state — and if it renders into a portal, pass "document" as the scope or the run will inspect an empty container and pass.'
    ).toEqual([]);
  });

  it.each(CASES)("%s", async (_name, ui, scope) => {
    expect(await violations(ui, scope)).toEqual([]);
  });
});
