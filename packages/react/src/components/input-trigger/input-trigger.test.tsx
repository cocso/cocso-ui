import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputTrigger } from "./input-trigger";

describe("InputTrigger", () => {
  describe("rendering", () => {
    it("renders as a native button element", () => {
      render(<InputTrigger aria-label="날짜 선택" />);
      const button = screen.getByRole("button", { name: "날짜 선택" });
      expect(button.tagName).toBe("BUTTON");
      expect(button).toHaveAttribute("type", "button");
    });

    it("renders children as the value", () => {
      render(<InputTrigger>2026-06-17</InputTrigger>);
      expect(screen.getByText("2026-06-17")).toBeInTheDocument();
    });

    it("renders placeholder when no children value is present", () => {
      render(<InputTrigger placeholder="날짜를 선택하세요" />);
      expect(screen.getByText("날짜를 선택하세요")).toBeInTheDocument();
    });

    it("renders prefix and suffix affixes", () => {
      render(
        <InputTrigger
          prefix={<span data-testid="prefix" />}
          suffix={<span data-testid="suffix" />}
        >
          value
        </InputTrigger>
      );
      expect(screen.getByTestId("prefix")).toBeInTheDocument();
      expect(screen.getByTestId("suffix")).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("calls onClick when pressed", async () => {
      const onClick = vi.fn();
      render(<InputTrigger onClick={onClick}>value</InputTrigger>);
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("is disabled when disabled=true", () => {
      render(<InputTrigger disabled>value</InputTrigger>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("size className", () => {
    it.each([
      "x-small",
      "small",
      "medium",
      "large",
    ] as const)('applies size className for size="%s"', (size) => {
      render(<InputTrigger size={size}>v</InputTrigger>);
      expect(screen.getByRole("button").className).toContain(
        `cocso-input--size-${size}`
      );
    });
  });

  describe("error state", () => {
    it("sets aria-invalid=true when error is truthy", () => {
      render(<InputTrigger error>value</InputTrigger>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("does not set aria-invalid when error=false", () => {
      render(<InputTrigger>value</InputTrigger>);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-invalid");
    });
  });

  describe("className override", () => {
    it("forwards custom className to the button", () => {
      render(
        <InputTrigger className="custom" data-testid="trigger">
          value
        </InputTrigger>
      );
      expect(screen.getByTestId("trigger")).toHaveClass("custom");
    });
  });
});
