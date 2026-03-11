import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./input";

describe("Input", () => {
  describe("rendering", () => {
    it("renders as an input element", () => {
      render(<Input aria-label="이름" />);
      expect(screen.getByRole("textbox", { name: "이름" })).toBeInTheDocument();
    });

    it("renders with placeholder", () => {
      render(<Input placeholder="입력해주세요" />);
      expect(screen.getByPlaceholderText("입력해주세요")).toBeInTheDocument();
    });

    it("is disabled when disabled=true", () => {
      render(<Input aria-label="이름" disabled />);
      expect(screen.getByRole("textbox", { name: "이름" })).toBeDisabled();
    });

    it("forwards the name attribute", () => {
      render(<Input aria-label="이름" name="username" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("name", "username");
    });

    it("forwards the type attribute", () => {
      render(<Input aria-label="이메일" type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("passes additional props to the underlying element", () => {
      render(<Input data-testid="my-input" />);
      expect(screen.getByTestId("my-input")).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("calls onChange when value changes", async () => {
      const onChange = vi.fn();
      render(<Input aria-label="이름" onChange={onChange} />);
      await userEvent.type(screen.getByRole("textbox"), "hello");
      expect(onChange).toHaveBeenCalled();
    });

    it("does not allow typing when disabled", async () => {
      render(<Input aria-label="이름" defaultValue="" disabled />);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "hello");
      expect(input).toHaveValue("");
    });
  });

  describe("size CSS variables", () => {
    it.each([
      ["small", "12px"],
      ["medium", "14px"],
      ["large", "14px"],
    ] as const)('sets --cocso-input-font-size for size="%s"', (size, expectedFontSize) => {
      render(<Input aria-label="이름" size={size} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveStyle({ "--cocso-input-font-size": expectedFontSize });
    });

    it('applies default size "medium" when no size prop is given', () => {
      render(<Input aria-label="이름" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveStyle({ "--cocso-input-font-size": "14px" });
    });
  });

  describe("className override (@layer)", () => {
    it("forwards custom className to the input element", () => {
      render(<Input className="custom" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("custom");
    });
  });
});
