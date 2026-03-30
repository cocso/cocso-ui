import { render, screen } from "@testing-library/react";

import { Avatar } from "./avatar";

describe("Avatar", () => {
  describe("rendering", () => {
    it("renders fallback text", () => {
      render(<Avatar fallback="AB" />);
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("renders img element when src is provided", () => {
      render(<Avatar alt="User" src="https://example.com/avatar.png" />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("accepts additional className", () => {
      const { container } = render(
        <Avatar className="custom-class" fallback="A" />
      );
      const avatar = container.firstChild as HTMLElement;
      expect(avatar.className).toContain("custom-class");
    });
  });

  describe("size className", () => {
    it.each([
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
    ] as const)('applies size className for size="%s"', (size) => {
      const { container } = render(<Avatar fallback="A" size={size} />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar.className).toContain(`cocso-avatar--size-${size}`);
    });

    it('defaults to size="md"', () => {
      const { container } = render(<Avatar fallback="A" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar.className).toContain("cocso-avatar--size-md");
    });
  });

  describe("shape className", () => {
    it.each([
      "circle",
      "square",
    ] as const)('applies shape className for shape="%s"', (shape) => {
      const { container } = render(<Avatar fallback="A" shape={shape} />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar.className).toContain(`cocso-avatar--shape-${shape}`);
    });

    it('defaults to shape="circle"', () => {
      const { container } = render(<Avatar fallback="A" />);
      const avatar = container.firstChild as HTMLElement;
      expect(avatar.className).toContain("cocso-avatar--shape-circle");
    });
  });
});
