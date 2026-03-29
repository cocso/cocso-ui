import { render, screen } from "@testing-library/react";

import { Badge } from "./badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("accepts additional className", () => {
      render(<Badge className="custom-class">Badge</Badge>);
      expect(screen.getByText("Badge").closest("div")).toHaveClass(
        "custom-class"
      );
    });
  });

  describe("variant className", () => {
    it.each([
      "primary",
      "secondary",
      "success",
      "error",
      "warning",
      "outline",
    ] as const)('applies variant className for variant="%s"', (variant) => {
      const { container } = render(<Badge variant={variant}>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain(`cocso-badge--variant-${variant}`);
    });

    it('defaults to variant="secondary"', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("cocso-badge--variant-secondary");
    });
  });

  describe("size className", () => {
    it.each([
      "small",
      "medium",
      "large",
    ] as const)('applies size className for size="%s"', (size) => {
      const { container } = render(<Badge size={size}>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain(`cocso-badge--size-${size}`);
    });

    it('defaults to size="medium"', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("cocso-badge--size-medium");
    });
  });

  describe("shape className", () => {
    it('applies shape className for shape="circle"', () => {
      const { container } = render(<Badge shape="circle">Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("cocso-badge--shape-circle");
    });

    it('applies shape className for shape="rounded"', () => {
      const { container } = render(<Badge shape="rounded">Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain("cocso-badge--shape-rounded");
    });
  });
});
