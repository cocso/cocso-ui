import { render, screen } from "@testing-library/react";

import { Card } from "./card";

describe("Card", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("accepts additional className", () => {
      const { container } = render(<Card className="custom-class">Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("custom-class");
    });
  });

  describe("variant className", () => {
    it.each([
      "elevated",
      "outlined",
      "filled",
    ] as const)('applies variant className for variant="%s"', (variant) => {
      const { container } = render(<Card variant={variant}>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain(`cocso-card--variant-${variant}`);
    });

    it('defaults to variant="elevated"', () => {
      const { container } = render(<Card>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("cocso-card--variant-elevated");
    });
  });

  describe("padding className", () => {
    it.each([
      "sm",
      "md",
      "lg",
    ] as const)('applies padding className for padding="%s"', (padding) => {
      const { container } = render(<Card padding={padding}>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain(`cocso-card--padding-${padding}`);
    });

    it('defaults to padding="md"', () => {
      const { container } = render(<Card>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("cocso-card--padding-md");
    });
  });
});
