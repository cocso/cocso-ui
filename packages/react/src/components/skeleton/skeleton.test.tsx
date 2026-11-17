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
    it.each([
      "text",
      "circular",
      "rectangular",
    ] as const)('applies variant className for variant="%s"', (variant) => {
      const { container } = render(<Skeleton variant={variant} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain(
        `cocso-skeleton--variant-${variant}`
      );
    });

    it('defaults to variant="text"', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain("cocso-skeleton--variant-text");
    });
  });

  describe("animation className", () => {
    it.each([
      "pulse",
      "wave",
      "none",
    ] as const)('applies animation className for animation="%s"', (animation) => {
      const { container } = render(<Skeleton animation={animation} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain(
        `cocso-skeleton--animation-${animation}`
      );
    });

    it('defaults to animation="pulse"', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain("cocso-skeleton--animation-pulse");
    });
  });

  describe("circle", () => {
    it("renders the circular variant when circle is set", () => {
      const { container } = render(<Skeleton circle />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain("cocso-skeleton--variant-circular");
      expect(skeleton.className).not.toContain("cocso-skeleton--variant-text");
    });

    it("overrides an explicit variant", () => {
      const { container } = render(<Skeleton circle variant="rectangular" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain("cocso-skeleton--variant-circular");
    });
  });

  describe("size", () => {
    it("reads numbers as pixels", () => {
      const { container } = render(<Skeleton height={26} width={40} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.getPropertyValue("--cocso-skeleton-width")).toBe(
        "40px"
      );
      expect(skeleton.style.getPropertyValue("--cocso-skeleton-height")).toBe(
        "26px"
      );
    });

    it("passes strings through", () => {
      const { container } = render(<Skeleton height="2rem" width="60%" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.getPropertyValue("--cocso-skeleton-width")).toBe(
        "60%"
      );
      expect(skeleton.style.getPropertyValue("--cocso-skeleton-height")).toBe(
        "2rem"
      );
    });

    it("sets nothing when no size is given", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.getPropertyValue("--cocso-skeleton-width")).toBe(
        ""
      );
    });

    it("keeps the consumer's own style", () => {
      const { container } = render(
        <Skeleton style={{ marginTop: 4 }} width={10} />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.marginTop).toBe("4px");
    });
  });
});
