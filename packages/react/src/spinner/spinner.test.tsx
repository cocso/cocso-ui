import { render, screen } from "@testing-library/react";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  describe("rendering", () => {
    it("renders a div by default", () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner.tagName).toBe("DIV");
    });

    it('renders with default size "medium" CSS variable', () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveStyle({ "--cocso-spinner-size": "24px" });
    });

    it('renders with default color "primary" CSS variable', () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveStyle({ "--cocso-spinner-border-width": "3px" });
    });

    it("passes additional props to the underlying element", () => {
      render(<Spinner data-testid="my-spinner" />);
      expect(screen.getByTestId("my-spinner")).toBeInTheDocument();
    });
  });

  describe("size CSS variables", () => {
    it.each([
      ["x-large", "40px", "5px"],
      ["large", "32px", "4px"],
      ["medium", "24px", "3px"],
      ["small", "16px", "2px"],
    ] as const)('sets correct CSS variables for size="%s"', (size, expectedSize, expectedBorderWidth) => {
      render(<Spinner data-testid="spinner" size={size} />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveStyle({
        "--cocso-spinner-size": expectedSize,
        "--cocso-spinner-border-width": expectedBorderWidth,
      });
    });
  });

  describe("color CSS variables", () => {
    it('sets CSS variables for color="primary"', () => {
      render(<Spinner color="primary" data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      const style = spinner.getAttribute("style");
      expect(style).toContain("--cocso-spinner-border-color");
      expect(style).toContain("--cocso-spinner-bg-color");
    });

    it('sets CSS variables for color="neutral"', () => {
      render(<Spinner color="neutral" data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      const style = spinner.getAttribute("style");
      expect(style).toContain("--cocso-spinner-border-color");
      expect(style).toContain("--cocso-spinner-bg-color");
    });

    it('sets CSS variables for color="white"', () => {
      render(<Spinner color="white" data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      const style = spinner.getAttribute("style");
      expect(style).toContain("--cocso-spinner-border-color");
      expect(style).toContain("--cocso-spinner-bg-color");
    });
  });

  describe("render prop", () => {
    it("renders as the provided element when render is given", () => {
      render(<Spinner render={<span data-testid="custom-spinner" />} />);
      expect(screen.getByTestId("custom-spinner")).toBeInTheDocument();
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
