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

  describe("items", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Item", href: "/products/1" },
    ];

    it("links every step but the last", () => {
      render(<Breadcrumb items={items} />);
      expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
        "href",
        "/"
      );
      expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
        "href",
        "/products"
      );
      expect(screen.queryByRole("link", { name: "Item" })).toBeNull();
    });

    it('marks the last step aria-current="page"', () => {
      render(<Breadcrumb items={items} />);
      expect(screen.getByText("Item")).toHaveAttribute("aria-current", "page");
    });

    it("renders a step without href as text", () => {
      render(<Breadcrumb items={[{ label: "Group" }, { label: "Current" }]} />);
      expect(screen.queryByRole("link")).toBeNull();
      expect(screen.getByText("Group")).toBeInTheDocument();
    });

    it("places a separator between steps only", () => {
      render(<Breadcrumb items={items} separator="/" />);
      expect(screen.getAllByText("/")).toHaveLength(2);
    });

    it("renders items instead of children", () => {
      render(
        <Breadcrumb items={[{ label: "From items" }]}>
          <span>From children</span>
        </Breadcrumb>
      );
      expect(screen.getByText("From items")).toBeInTheDocument();
      expect(screen.queryByText("From children")).toBeNull();
    });

    it("renders links through renderLink", () => {
      render(
        <Breadcrumb
          items={items}
          renderLink={(props) => <a data-router-link="" {...props} />}
        />
      );
      const link = screen.getByRole("link", { name: "Home" });
      expect(link).toHaveAttribute("data-router-link");
      expect(link).toHaveAttribute("href", "/");
    });
  });
});
