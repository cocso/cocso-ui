import { render, screen } from "@testing-library/react";

import { Tag } from "./tag";

describe("Tag", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<Tag>Label</Tag>);
      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("accepts additional className", () => {
      const { container } = render(<Tag className="custom-class">Tag</Tag>);
      const tag = container.firstChild as HTMLElement;
      expect(tag.className).toContain("custom-class");
    });

    it("renders remove button when onRemove is provided", () => {
      const onRemove = vi.fn();
      render(<Tag onRemove={onRemove}>Tag</Tag>);
      expect(
        screen.getByRole("button", { name: "Remove" })
      ).toBeInTheDocument();
    });
  });

  describe("variant className", () => {
    it.each(["solid", "subtle", "outline"] as const)(
      'applies variant className for variant="%s"',
      (variant) => {
        const { container } = render(<Tag variant={variant}>Tag</Tag>);
        const tag = container.firstChild as HTMLElement;
        expect(tag.className).toContain(`cocso-tag--variant-${variant}`);
      }
    );

    it('defaults to variant="subtle"', () => {
      const { container } = render(<Tag>Tag</Tag>);
      const tag = container.firstChild as HTMLElement;
      expect(tag.className).toContain("cocso-tag--variant-subtle");
    });
  });

  describe("size className", () => {
    it.each(["sm", "md", "lg"] as const)(
      'applies size className for size="%s"',
      (size) => {
        const { container } = render(<Tag size={size}>Tag</Tag>);
        const tag = container.firstChild as HTMLElement;
        expect(tag.className).toContain(`cocso-tag--size-${size}`);
      }
    );

    it('defaults to size="md"', () => {
      const { container } = render(<Tag>Tag</Tag>);
      const tag = container.firstChild as HTMLElement;
      expect(tag.className).toContain("cocso-tag--size-md");
    });
  });
});
