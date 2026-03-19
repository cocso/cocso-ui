import { render, screen } from "@testing-library/react";

import { getColor, StockQuantityStatus } from "./stock-quantity-status";

describe("StockQuantityStatus", () => {
  describe("rendering", () => {
    it.each([
      "여유",
      "보통",
      "부족",
    ] as const)('renders the quantity label "%s"', (quantity) => {
      render(<StockQuantityStatus quantity={quantity} />);
      expect(screen.getByText(quantity)).toBeInTheDocument();
    });

    it("renders an SVG indicator", () => {
      const { container } = render(<StockQuantityStatus quantity="여유" />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("forwards className to the root div", () => {
      const { container } = render(
        <StockQuantityStatus className="custom-class" quantity="보통" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards data attributes to the root div", () => {
      render(
        <StockQuantityStatus data-testid="stock-status" quantity="부족" />
      );
      expect(screen.getByTestId("stock-status")).toBeInTheDocument();
    });
  });

  describe("color CSS variable", () => {
    it.each([
      ["여유", "var(--cocso-color-primary-500)"],
      ["보통", "var(--cocso-color-success-400)"],
      ["부족", "var(--cocso-color-danger-500)"],
    ] as const)('sets --cocso-stock-quantity-status-color to "%s" for quantity="%s"', (quantity, expectedColor) => {
      const { container } = render(<StockQuantityStatus quantity={quantity} />);
      const root = container.firstChild as HTMLElement;
      expect(
        root.style.getPropertyValue("--cocso-stock-quantity-status-color")
      ).toBe(expectedColor);
    });
  });

  describe("getColor helper", () => {
    it('returns primary500 for "여유"', () => {
      expect(getColor("여유")).toBe("var(--cocso-color-primary-500)");
    });

    it('returns success400 for "보통"', () => {
      expect(getColor("보통")).toBe("var(--cocso-color-success-400)");
    });

    it('returns danger500 for "부족"', () => {
      expect(getColor("부족")).toBe("var(--cocso-color-danger-500)");
    });
  });

  describe("sVG indicator aria-hidden", () => {
    it("hides the SVG from assistive technology", () => {
      const { container } = render(<StockQuantityStatus quantity="여유" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });
});
