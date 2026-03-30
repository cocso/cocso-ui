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

  describe("size className", () => {
    it.each([
      "x-small",
      "small",
      "medium",
      "large",
    ] as const)('applies size className for size="%s"', (size) => {
      render(<Input aria-label="이름" size={size} />);
      const input = screen.getByRole("textbox");
      expect(input.className).toContain(`cocso-input--size-${size}`);
    });

    it('applies default size "medium" when no size prop is given', () => {
      render(<Input aria-label="이름" />);
      const input = screen.getByRole("textbox");
      expect(input.className).toContain("cocso-input--size-medium");
    });
  });

  describe("className override (@layer)", () => {
    it("forwards custom className to the input element", () => {
      render(<Input className="custom" data-testid="input" />);
      expect(screen.getByTestId("input")).toHaveClass("custom");
    });
  });

  describe("error state", () => {
    it("sets aria-invalid=true when error=true", () => {
      render(<Input aria-label="이름" error />);
      expect(screen.getByRole("textbox", { name: "이름" })).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("does not set aria-invalid when error=false (default)", () => {
      render(<Input aria-label="이름" />);
      expect(screen.getByRole("textbox", { name: "이름" })).not.toHaveAttribute(
        "aria-invalid"
      );
    });

    it("applies error class when error=true", () => {
      render(<Input aria-label="이름" data-testid="input" error />);
      expect(screen.getByTestId("input")).toHaveClass("error");
    });

    it("renders error message in Field when error is a string", () => {
      render(<Input error="필수 입력입니다" label="이름" />);
      expect(screen.getByText("필수 입력입니다")).toBeInTheDocument();
    });
  });

  describe("label integration", () => {
    it("wraps input in Field when label is provided", () => {
      render(<Input label="이름" />);
      expect(screen.getByText("이름")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders bare input without Field when label is omitted", () => {
      const { container } = render(<Input aria-label="이름" />);
      expect(container.querySelector("label")).not.toBeInTheDocument();
    });
  });

  describe("stretch", () => {
    it("applies stretch class when stretch=true", () => {
      render(<Input aria-label="이름" data-testid="input" stretch />);
      expect(screen.getByTestId("input")).toHaveClass("stretch");
    });
  });

  describe("readOnly state", () => {
    it("sets readOnly attribute when readOnly=true", () => {
      render(<Input aria-label="이름" readOnly />);
      expect(screen.getByRole("textbox", { name: "이름" })).toHaveAttribute(
        "readonly"
      );
    });

    it("does not allow typing when readOnly", async () => {
      render(<Input aria-label="이름" defaultValue="기존값" readOnly />);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "새값");
      expect(input).toHaveValue("기존값");
    });
  });
});
