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
      "glass",
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

  describe("gap", () => {
    it("reads a number as pixels", () => {
      const { container } = render(<Card gap={8}>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.style.getPropertyValue("--cocso-card-gap")).toBe("8px");
    });

    it("passes a string through", () => {
      const { container } = render(<Card gap="1rem">Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.style.getPropertyValue("--cocso-card-gap")).toBe("1rem");
    });

    it("sets nothing when unset", () => {
      const { container } = render(<Card>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.style.getPropertyValue("--cocso-card-gap")).toBe("");
    });

    it("keeps the consumer's own style", () => {
      const { container } = render(
        <Card gap={4} style={{ width: 200 }}>
          Card
        </Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card.style.width).toBe("200px");
    });
  });

  describe("render", () => {
    it("renders as the given element with the card's classes", () => {
      const onClick = vi.fn();
      render(
        <Card gap={8} render={<button onClick={onClick} type="button" />}>
          Open
        </Card>
      );
      const button = screen.getByRole("button", { name: "Open" });
      expect(button.className).toContain("cocso-card--variant-elevated");
      expect(button.style.getPropertyValue("--cocso-card-gap")).toBe("8px");
      button.click();
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("renders a div by default", () => {
      const { container } = render(<Card>Card</Card>);
      expect((container.firstChild as HTMLElement).tagName).toBe("DIV");
    });
  });

  describe("Card.Header", () => {
    it("renders its children", () => {
      render(
        <Card>
          <Card.Header className="custom-header">
            <span>Title</span>
            <span>Action</span>
          </Card.Header>
        </Card>
      );
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Title").parentElement?.className).toContain(
        "custom-header"
      );
    });
  });

  describe("Card.Title", () => {
    it("renders an h2 by default", () => {
      render(<Card.Title>Revenue</Card.Title>);
      expect(
        screen.getByRole("heading", { level: 2, name: "Revenue" })
      ).toBeInTheDocument();
    });

    it("takes a heading level", () => {
      render(<Card.Title level={3}>Revenue</Card.Title>);
      expect(
        screen.getByRole("heading", { level: 3, name: "Revenue" })
      ).toBeInTheDocument();
    });

    it("accepts additional className", () => {
      render(<Card.Title className="custom-title">Revenue</Card.Title>);
      expect(screen.getByRole("heading").className).toContain("custom-title");
    });
  });
});
