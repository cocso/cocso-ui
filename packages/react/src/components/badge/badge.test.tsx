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

  describe("variant CSS variables", () => {
    it.each([
      "primary",
      "secondary",
      "success",
      "error",
      "warning",
      "outline",
    ] as const)('sets background color CSS variable for variant="%s"', (variant) => {
      const { container } = render(<Badge variant={variant}>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(
        badge.style.getPropertyValue("--cocso-badge-bg-color")
      ).toBeTruthy();
    });

    it('sets border for variant="outline"', () => {
      const { container } = render(<Badge variant="outline">Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.getPropertyValue("--cocso-badge-border")).toContain(
        "1px solid"
      );
    });

    it('defaults to variant="secondary"', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(
        badge.style.getPropertyValue("--cocso-badge-bg-color")
      ).toBeTruthy();
    });
  });

  describe("size CSS variables", () => {
    it.each([
      ["small", "3px 6px"],
      ["medium", "4px 8px"],
      ["large", "5px 10px"],
    ] as const)('sets padding to "%s" when size="%s"', (size, expectedPadding) => {
      const { container } = render(<Badge size={size}>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.getPropertyValue("--cocso-badge-padding")).toBe(
        expectedPadding
      );
    });

    it('defaults to size="medium"', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.getPropertyValue("--cocso-badge-padding")).toBe(
        "4px 8px"
      );
    });
  });

  describe("shape CSS variables", () => {
    it('sets border-radius to 100% for shape="circle"', () => {
      const { container } = render(<Badge shape="circle">Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.getPropertyValue("--cocso-badge-border-radius")).toBe(
        "100%"
      );
    });

    it('sets border-radius to radius-full for shape="rounded"', () => {
      const { container } = render(<Badge shape="rounded">Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.getPropertyValue("--cocso-badge-border-radius")).toBe(
        "var(--cocso-radius-full)"
      );
    });
  });
});
