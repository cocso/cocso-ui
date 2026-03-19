import { render, screen } from "@testing-library/react";

import { colors } from "../../token";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  describe("rendering", () => {
    it("renders an output element", () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner.tagName).toBe("OUTPUT");
    });

    it("renders 8 blades for default medium size", () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner.children).toHaveLength(8);
    });

    it("has aria-label and aria-live for accessibility", () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveAttribute("aria-label", "Loading");
      expect(spinner).toHaveAttribute("aria-live", "polite");
    });

    it("accepts custom label", () => {
      render(<Spinner data-testid="spinner" label="잠시만 기다려주세요" />);
      expect(screen.getByTestId("spinner")).toHaveAttribute(
        "aria-label",
        "잠시만 기다려주세요"
      );
    });

    it("passes additional props to the underlying element", () => {
      render(<Spinner data-testid="my-spinner" />);
      expect(screen.getByTestId("my-spinner")).toBeInTheDocument();
    });
  });

  describe("size", () => {
    it.each([
      ["small", "12px", 6],
      ["medium", "16px", 8],
      ["large", "20px", 10],
    ] as const)('sets correct container size and blade count for size="%s"', (size, expectedSize, bladeCount) => {
      render(<Spinner data-testid="spinner" size={size} />);
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveStyle({
        width: expectedSize,
        height: expectedSize,
      });
      expect(spinner.children).toHaveLength(bladeCount);
    });
  });

  describe("variant color", () => {
    it.each([
      ["primary", colors.primary500],
      ["secondary", colors.neutral500],
      ["success", colors.success500],
      ["error", colors.danger500],
      ["warning", colors.warning500],
      ["white", colors.white],
    ] as const)('applies correct color for variant="%s"', (variant, expectedColor) => {
      render(<Spinner data-testid="spinner" variant={variant} />);
      expect(screen.getByTestId("spinner")).toHaveStyle({
        color: expectedColor,
      });
    });

    it("each variant produces a distinct color", () => {
      const variants = [
        "primary",
        "secondary",
        "success",
        "error",
        "warning",
        "white",
      ] as const;
      const colorValues = variants.map((variant) => {
        const { unmount } = render(
          <Spinner data-testid={`spinner-${variant}`} variant={variant} />
        );
        const el = screen.getByTestId(`spinner-${variant}`);
        const color = el.style.color;
        unmount();
        return color;
      });
      const uniqueColors = new Set(colorValues);
      expect(uniqueColors.size).toBe(variants.length);
    });
  });

  describe("style override", () => {
    it("merges custom style prop with generated styles", () => {
      render(<Spinner data-testid="spinner" style={{ opacity: 0.5 }} />);
      expect(screen.getByTestId("spinner")).toHaveStyle({ opacity: "0.5" });
    });

    it("preserves size styles when custom style is provided", () => {
      render(
        <Spinner data-testid="spinner" size="large" style={{ opacity: 0.5 }} />
      );
      const spinner = screen.getByTestId("spinner");
      expect(spinner).toHaveStyle({
        width: "20px",
        height: "20px",
        opacity: "0.5",
      });
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
