import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { vi } from "vitest";

import { SegmentedControl } from "./segmented-control";

const SUMMED = /합산/;

const OPTIONS = [
  { value: "day", label: "일" },
  { value: "week", label: "주" },
  { value: "month", label: "월" },
] as const;

type Period = (typeof OPTIONS)[number]["value"];

function Controlled({
  initial = "day",
  onChange,
}: {
  initial?: string;
  onChange?: (value: Period) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <SegmentedControl
      aria-label="기간"
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      options={OPTIONS}
      value={value}
    />
  );
}

describe("SegmentedControl", () => {
  describe("rendering", () => {
    it("is a named radiogroup of radios", () => {
      render(<Controlled />);
      expect(screen.getByRole("radiogroup", { name: "기간" })).toBeVisible();
      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });

    it("checks the option matching the value", () => {
      render(<Controlled initial="week" />);
      expect(screen.getByRole("radio", { name: "주" })).toHaveAttribute(
        "aria-checked",
        "true"
      );
      expect(screen.getByRole("radio", { name: "일" })).toHaveAttribute(
        "aria-checked",
        "false"
      );
    });

    it("carries the override hooks", () => {
      const { container } = render(<Controlled />);
      expect(
        container.querySelector('[data-cocso-component="segmented-control"]')
      ).toBeInTheDocument();
      expect(
        container.querySelectorAll(
          '[data-cocso-component="segmented-control-item"]'
        )
      ).toHaveLength(3);
    });

    it("renders option descriptions under their labels", () => {
      render(
        <SegmentedControl
          aria-label="계산"
          onChange={() => undefined}
          options={[
            { value: "a", label: "합산", description: "모두 더한다" },
            { value: "b", label: "개별" },
          ]}
          value="a"
        />
      );
      expect(screen.getByRole("radio", { name: SUMMED })).toHaveTextContent(
        "모두 더한다"
      );
    });

    it("links the shared description to the group", () => {
      render(
        <SegmentedControl
          aria-label="기간"
          description="정산 기준 기간"
          onChange={() => undefined}
          options={OPTIONS}
          value="day"
        />
      );
      expect(screen.getByRole("radiogroup")).toHaveAccessibleDescription(
        "정산 기준 기간"
      );
    });

    it("puts className on the wrapper when there is a description", () => {
      const { container } = render(
        <SegmentedControl
          aria-label="기간"
          className="outer"
          description="설명"
          onChange={() => undefined}
          options={OPTIONS}
          value="day"
        />
      );
      expect(container.firstElementChild).toHaveClass("outer");
      expect(screen.getByRole("radiogroup")).not.toHaveClass("outer");
    });

    it("puts className on the track when there is none", () => {
      render(
        <SegmentedControl
          aria-label="기간"
          className="outer"
          onChange={() => undefined}
          options={OPTIONS}
          value="day"
        />
      );
      expect(screen.getByRole("radiogroup")).toHaveClass("outer");
    });
  });

  describe("pointer", () => {
    it("reports the clicked option", async () => {
      const onChange = vi.fn();
      render(<Controlled onChange={onChange} />);
      await userEvent.click(screen.getByRole("radio", { name: "월" }));
      expect(onChange).toHaveBeenCalledWith("month");
      expect(screen.getByRole("radio", { name: "월" })).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });
  });

  describe("keyboard", () => {
    it("is reached with Tab on the selected segment", async () => {
      render(<Controlled initial="week" />);
      await userEvent.tab();
      expect(screen.getByRole("radio", { name: "주" })).toHaveFocus();
    });

    it("moves the selection with the arrow keys", async () => {
      const onChange = vi.fn();
      render(<Controlled onChange={onChange} />);
      await userEvent.tab();
      await userEvent.keyboard("{ArrowRight}");
      expect(onChange).toHaveBeenLastCalledWith("week");
      expect(screen.getByRole("radio", { name: "주" })).toHaveFocus();
      expect(screen.getByRole("radio", { name: "주" })).toHaveAttribute(
        "aria-checked",
        "true"
      );
      await userEvent.keyboard("{ArrowLeft}");
      expect(onChange).toHaveBeenLastCalledWith("day");
    });

    it("stays reachable when the value matches no option", async () => {
      render(<Controlled initial="unknown" />);
      await userEvent.tab();
      expect(
        screen.getAllByRole("radio").some((r) => r === document.activeElement)
      ).toBe(true);
    });
  });

  describe("disabled", () => {
    /**
     * Base UI keeps a disabled radio focusable and marks it `aria-disabled`,
     * so a screen-reader user can still find the control and hear why it does
     * nothing. What matters is that the value cannot change.
     */
    it("is marked disabled and does not change", async () => {
      const onChange = vi.fn();
      render(
        <SegmentedControl
          aria-label="기간"
          disabled
          onChange={onChange}
          options={OPTIONS}
          value="day"
        />
      );
      for (const radio of screen.getAllByRole("radio")) {
        expect(radio).toHaveAttribute("aria-disabled", "true");
      }
      await userEvent.click(screen.getByRole("radio", { name: "주" }));
      await userEvent.tab();
      await userEvent.keyboard("{ArrowRight}");
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("fitContent", () => {
    it("renders without throwing", () => {
      expect(() =>
        render(
          <SegmentedControl
            aria-label="기간"
            fitContent
            onChange={() => undefined}
            options={OPTIONS}
            value="week"
          />
        )
      ).not.toThrow();
    });
  });
});
