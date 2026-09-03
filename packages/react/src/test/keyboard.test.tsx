/**
 * Keyboard reachability
 *
 * `a11y.test.tsx` runs axe over a static render, which sees markup and not
 * behaviour: whether a control can be reached with Tab, whether Enter and Space
 * activate it, whether focus is visible where it lands. A component can be
 * flawless to axe and unusable without a mouse.
 *
 * This drives the keyboard. It is still not the whole story — focus *order*
 * across a real page, focus return after a dialog closes, and what a screen
 * reader actually announces are outside what jsdom models, and that is stated
 * rather than implied. What it does cover is the floor: every interactive
 * component is reachable and operable from the keyboard alone.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { Input } from "../components/input";
import { Link } from "../components/link";
import { Select } from "../components/select";
import { Switch } from "../components/switch";

describe("Interactive components are reachable with Tab", () => {
  it("reaches a Button", async () => {
    render(<Button>버튼</Button>);
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("reaches a Link", async () => {
    render(<Link href="/">링크</Link>);
    await userEvent.tab();
    expect(screen.getByRole("link")).toHaveFocus();
  });

  it("reaches an Input", async () => {
    render(<Input aria-label="이름" />);
    await userEvent.tab();
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("reaches a Select", async () => {
    render(
      <Select aria-label="분류">
        <option value="a">첫째</option>
      </Select>
    );
    await userEvent.tab();
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("reaches a Checkbox", async () => {
    render(<Checkbox label="동의" />);
    await userEvent.tab();
    expect(screen.getByRole("checkbox")).toHaveFocus();
  });

  it("reaches a Switch", async () => {
    render(<Switch label="알림" />);
    await userEvent.tab();
    expect(screen.getByRole("switch")).toHaveFocus();
  });

  it("does not reach a disabled Button", async () => {
    render(
      <>
        <Button disabled>비활성</Button>
        <Button>활성</Button>
      </>
    );
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "활성" })).toHaveFocus();
  });
});

describe("Controls operate from the keyboard", () => {
  it("activates a Button with Enter and with Space", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>버튼</Button>);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("toggles a Checkbox with Space", async () => {
    render(<Checkbox label="동의" />);
    const checkbox = screen.getByRole("checkbox");

    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(checkbox).toBeChecked();

    await userEvent.keyboard(" ");
    expect(checkbox).not.toBeChecked();
  });

  it("toggles a Switch with Space", async () => {
    render(<Switch label="알림" />);
    const toggle = screen.getByRole("switch");

    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(toggle).toBeChecked();
  });
});

describe("The password reveal is a keyboard control, not a mouse one", () => {
  it("is reachable after the field it belongs to", async () => {
    render(<Input aria-label="비밀번호" passwordToggle type="password" />);

    await userEvent.tab();
    expect(screen.getByLabelText("비밀번호")).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("reveals and hides with Enter", async () => {
    render(
      <Input
        aria-label="비밀번호"
        data-testid="input"
        passwordToggle
        type="password"
      />
    );
    const input = screen.getByTestId("input");

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(input).toHaveAttribute("type", "text");

    await userEvent.keyboard("{Enter}");
    expect(input).toHaveAttribute("type", "password");
  });

  it("is skipped when the field is disabled", async () => {
    render(
      <>
        <Input aria-label="비밀번호" disabled passwordToggle type="password" />
        <Button>다음</Button>
      </>
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "다음" })).toHaveFocus();
  });
});
