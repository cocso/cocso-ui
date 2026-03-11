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
      "default",
      "danger",
      "primary",
      "success",
      "warning",
    ] as const)('sets background color CSS variable for variant="%s"', (variant) => {
      const { container } = render(<Badge variant={variant}>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(
        badge.style.getPropertyValue("--cocso-badge-bg-color")
      ).toBeTruthy();
    });

    it('defaults to variant="default"', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(
        badge.style.getPropertyValue("--cocso-badge-bg-color")
      ).toBeTruthy();
    });
  });

  describe("size CSS variables", () => {
    it.each([
      ["small", "4px 8px"],
      ["medium", "6px 10px"],
      ["large", "8px 12px"],
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
        "6px 10px"
      );
    });
  });
});
