import { render } from "@testing-library/react";

import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  describe("rendering", () => {
    it('has aria-hidden="true"', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    it("accepts additional className", () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain("custom-class");
    });
  });

  describe("variant className", () => {
    it.each(["text", "circular", "rectangular"] as const)(
      'applies variant className for variant="%s"',
      (variant) => {
        const { container } = render(<Skeleton variant={variant} />);
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton.className).toContain(
          `cocso-skeleton--variant-${variant}`
        );
      }
    );

    it('defaults to variant="text"', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain("cocso-skeleton--variant-text");
    });
  });

  describe("animation className", () => {
    it.each(["pulse", "wave", "none"] as const)(
      'applies animation className for animation="%s"',
      (animation) => {
        const { container } = render(<Skeleton animation={animation} />);
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton.className).toContain(
          `cocso-skeleton--animation-${animation}`
        );
      }
    );

    it('defaults to animation="pulse"', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain("cocso-skeleton--animation-pulse");
    });
  });
});
