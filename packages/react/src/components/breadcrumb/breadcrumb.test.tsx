import { render, screen } from "@testing-library/react";

import { Breadcrumb } from "./breadcrumb";

describe("Breadcrumb", () => {
  describe("rendering", () => {
    it("renders children with separators", () => {
      render(
        <Breadcrumb>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <span>Item</span>
        </Breadcrumb>
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Item")).toBeInTheDocument();
    });

    it('has aria-label="Breadcrumb"', () => {
      render(
        <Breadcrumb>
          <span>Home</span>
        </Breadcrumb>
      );
      expect(screen.getByRole("navigation")).toHaveAttribute(
        "aria-label",
        "Breadcrumb"
      );
    });

    it("accepts additional className", () => {
      const { container } = render(
        <Breadcrumb className="custom-class">
          <span>Home</span>
        </Breadcrumb>
      );
      const breadcrumb = container.firstChild as HTMLElement;
      expect(breadcrumb.className).toContain("custom-class");
    });

    it("renders custom separator", () => {
      render(
        <Breadcrumb separator=">">
          <span>Home</span>
          <span>Products</span>
        </Breadcrumb>
      );
      expect(screen.getByText(">")).toBeInTheDocument();
    });

    it("does not render separator after last item", () => {
      render(
        <Breadcrumb separator="/">
          <span>Home</span>
          <span>Last</span>
        </Breadcrumb>
      );
      const separators = screen
        .getAllByText("/")
        .filter((el) => el.getAttribute("aria-hidden") === "true");
      expect(separators).toHaveLength(1);
    });
  });

  describe("size className", () => {
    it.each([
      "sm",
      "md",
      "lg",
    ] as const)('applies size className for size="%s"', (size) => {
      const { container } = render(
        <Breadcrumb size={size}>
          <span>Home</span>
        </Breadcrumb>
      );
      const breadcrumb = container.firstChild as HTMLElement;
      expect(breadcrumb.className).toContain(`cocso-breadcrumb--size-${size}`);
    });

    it('defaults to size="md"', () => {
      const { container } = render(
        <Breadcrumb>
          <span>Home</span>
        </Breadcrumb>
      );
      const breadcrumb = container.firstChild as HTMLElement;
      expect(breadcrumb.className).toContain("cocso-breadcrumb--size-md");
    });
  });
});
