import { render, screen } from "@testing-library/react";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  describe("rendering", () => {
    it("renders an output element", () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner.tagName).toBe("OUTPUT");
    });

    it("renders 12 blades", () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner.children).toHaveLength(12);
    });

    it("has aria-label and aria-live for accessibility", () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveAttribute("aria-label", "Loading");
      expect(spinner).toHaveAttribute("aria-live", "polite");
    });

    it("accepts custom label", () => {
      render(<Spinner data-testid="spinner" label="잠시만 기다려주세요" />);
      expect(screen.getByTestId("spinner")).toHaveAttribute("aria-label", "잠시만 기다려주세요");
    });

    it("passes additional props to the underlying element", () => {
      render(<Spinner data-testid="my-spinner" />);
      expect(screen.getByTestId("my-spinner")).toBeInTheDocument();
    });
  });

  describe("size", () => {
    it.each([
      ["small", "16px"],
      ["medium", "24px"],
      ["large", "32px"],
      ["x-large", "40px"],
    ] as const)('sets correct container size for size="%s"', (size, expectedSize) => {
      render(<Spinner data-testid="spinner" size={size} />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveStyle({ width: expectedSize, height: expectedSize });
    });
  });

  describe("className override (@layer)", () => {
    it("forwards custom className to the spinner element", () => {
      render(<Spinner className="custom-override" data-testid="spinner" />);
      expect(screen.getByTestId("spinner")).toHaveClass("custom-override");
    });

    it("preserves module className alongside custom className", () => {
      render(<Spinner className="custom-override" data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner.className).toContain("custom-override");
    });
  });
});
