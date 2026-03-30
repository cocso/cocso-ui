import { render, screen } from "@testing-library/react";

import { StockQuantityStatus } from "./stock-quantity-status";

const DISPLAY_LABELS: Record<string, string> = {
  sufficient: "여유",
  normal: "보통",
  insufficient: "부족",
};

describe("StockQuantityStatus", () => {
  describe("rendering", () => {
    it.each([
      "sufficient",
      "normal",
      "insufficient",
    ] as const)('renders the display label for quantity="%s"', (quantity) => {
      render(<StockQuantityStatus quantity={quantity} />);
      expect(screen.getByText(DISPLAY_LABELS[quantity])).toBeInTheDocument();
    });

    it("renders an SVG indicator", () => {
      const { container } = render(
        <StockQuantityStatus quantity="sufficient" />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("forwards className to the root div", () => {
      const { container } = render(
        <StockQuantityStatus className="custom-class" quantity="normal" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards data attributes to the root div", () => {
      render(
        <StockQuantityStatus
          data-testid="stock-status"
          quantity="insufficient"
        />
      );
      expect(screen.getByTestId("stock-status")).toBeInTheDocument();
    });
  });

  describe("quantity className", () => {
    it.each([
      "sufficient",
      "normal",
      "insufficient",
    ] as const)('applies quantity className for quantity="%s"', (quantity) => {
      const { container } = render(<StockQuantityStatus quantity={quantity} />);
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain(
        `cocso-stock-quantity-status--quantity-${quantity}`
      );
    });
  });

  describe("SVG indicator aria-hidden", () => {
    it("hides the SVG from assistive technology", () => {
      const { container } = render(
        <StockQuantityStatus quantity="sufficient" />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });
});
