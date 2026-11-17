import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { vi } from "vitest";

import { NumberInput } from "./number-input";

function Controlled({
  initial = null,
  maxFractionDigits,
  onValueChange,
}: {
  initial?: number | null;
  maxFractionDigits?: number;
  onValueChange?: (value: number | null) => void;
}) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <>
      <NumberInput
        aria-label="금액"
        maxFractionDigits={maxFractionDigits}
        onValueChange={(next) => {
          setValue(next);
          onValueChange?.(next);
        }}
        value={value}
      />
      <button onClick={() => setValue(5000)} type="button">
        초기화
      </button>
    </>
  );
}

const field = () => screen.getByRole("textbox", { name: "금액" });

describe("NumberInput", () => {
  describe("rendering", () => {
    it("formats the initial value", () => {
      render(<Controlled initial={1_234_567} />);
      expect(field()).toHaveValue("1,234,567");
    });

    it("is empty for null", () => {
      render(<Controlled />);
      expect(field()).toHaveValue("");
    });

    it("carries its own override hook on the input recipe", () => {
      const { container } = render(<Controlled />);
      const input = container.querySelector(
        '[data-cocso-component="number-input"]'
      );
      expect(input).toBe(field());
      expect(input?.className).toContain("cocso-input--size-small");
    });

    it("asks for a numeric keyboard", () => {
      render(<Controlled />);
      expect(field()).toHaveAttribute("inputmode", "numeric");
    });

    it("asks for a decimal keyboard when fractions are allowed", () => {
      render(<Controlled maxFractionDigits={2} />);
      expect(field()).toHaveAttribute("inputmode", "decimal");
    });
  });

  describe("typing", () => {
    it("groups thousands as the user types and reports the number", async () => {
      const onValueChange = vi.fn();
      render(<Controlled onValueChange={onValueChange} />);
      await userEvent.type(field(), "1234567");
      expect(field()).toHaveValue("1,234,567");
      expect(onValueChange).toHaveBeenLastCalledWith(1_234_567);
    });

    it("drops what is not a digit", async () => {
      render(<Controlled />);
      await userEvent.type(field(), "12a3.4");
      expect(field()).toHaveValue("1,234");
    });

    it("drops leading zeros", async () => {
      render(<Controlled initial={0} />);
      await userEvent.type(field(), "5");
      expect(field()).toHaveValue("5");
    });

    it("keeps a leading minus sign", async () => {
      const onValueChange = vi.fn();
      render(<Controlled onValueChange={onValueChange} />);
      await userEvent.type(field(), "-1000");
      expect(field()).toHaveValue("-1,000");
      expect(onValueChange).toHaveBeenLastCalledWith(-1000);
    });

    it("reports null when cleared", async () => {
      const onValueChange = vi.fn();
      render(<Controlled initial={12} onValueChange={onValueChange} />);
      await userEvent.clear(field());
      expect(onValueChange).toHaveBeenLastCalledWith(null);
      expect(field()).toHaveValue("");
    });

    it("keeps an intermediate trailing point across its own re-render", async () => {
      const onValueChange = vi.fn();
      render(
        <Controlled maxFractionDigits={2} onValueChange={onValueChange} />
      );
      await userEvent.type(field(), "1.");
      expect(field()).toHaveValue("1.");
      expect(onValueChange).toHaveBeenLastCalledWith(1);
    });

    it("cuts the fraction to maxFractionDigits", async () => {
      render(<Controlled maxFractionDigits={2} />);
      await userEvent.type(field(), "1234.5678");
      expect(field()).toHaveValue("1,234.56");
    });

    /**
     * Mid-string, where it matters: "999" with the caret after the second 9,
     * then "9" gives "9,999". Restoring by digit count puts the caret after
     * the third 9 (index 4); a kept raw index would leave it at 3, and React
     * resetting the value would push it to the end (5).
     */
    it("puts the caret back after the same digit when a comma is inserted", async () => {
      render(<Controlled initial={999} />);
      const input = field() as HTMLInputElement;
      input.focus();
      input.setSelectionRange(2, 2);
      await userEvent.type(input, "9", {
        initialSelectionStart: 2,
        initialSelectionEnd: 2,
      });
      expect(input).toHaveValue("9,999");
      await waitFor(() => expect(input.selectionStart).toBe(4));
    });
  });

  describe("blur", () => {
    it("drops a trailing point", async () => {
      render(<Controlled maxFractionDigits={2} />);
      await userEvent.type(field(), "1.");
      await userEvent.tab();
      expect(field()).toHaveValue("1");
    });

    it("clears a lone sign", async () => {
      render(<Controlled />);
      await userEvent.type(field(), "-");
      await userEvent.tab();
      expect(field()).toHaveValue("");
    });

    it("still calls the caller's onBlur", async () => {
      const onBlur = vi.fn();
      render(
        <NumberInput
          aria-label="금액"
          onBlur={onBlur}
          onValueChange={() => undefined}
          value={1}
        />
      );
      await userEvent.click(field());
      await userEvent.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("external value", () => {
    it("follows a value the caller sets", async () => {
      render(<Controlled initial={12} />);
      await act(async () => {
        await userEvent.click(screen.getByRole("button", { name: "초기화" }));
      });
      expect(field()).toHaveValue("5,000");
    });
  });

  describe("keyboard", () => {
    it("is reached with Tab", async () => {
      render(<Controlled />);
      await userEvent.tab();
      expect(field()).toHaveFocus();
    });
  });

  describe("Input props", () => {
    it("passes error through as aria-invalid", () => {
      render(
        <NumberInput
          aria-label="금액"
          error
          onValueChange={() => undefined}
          value={null}
        />
      );
      expect(field()).toHaveAttribute("aria-invalid", "true");
    });

    it("takes a label through Input", () => {
      render(
        <NumberInput label="수량" onValueChange={() => undefined} value={3} />
      );
      expect(screen.getByRole("textbox", { name: "수량" })).toHaveValue("3");
    });
  });
});
