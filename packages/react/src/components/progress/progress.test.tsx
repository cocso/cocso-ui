import { render, screen } from "@testing-library/react";

import { Progress } from "./progress";

describe("Progress", () => {
  describe("rendering", () => {
    it('has role="progressbar" attribute', () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("sets aria-valuenow", () => {
      render(<Progress value={42} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "42"
      );
    });

    it("sets aria-valuemin to 0", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemin",
        "0"
      );
    });

    it("sets aria-valuemax", () => {
      render(<Progress max={200} value={50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemax",
        "200"
      );
    });

    it("accepts additional className", () => {
      const { container } = render(
        <Progress className="custom-class" value={50} />
      );
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toContain("custom-class");
    });

    it("calculates fill width as percentage", () => {
      const { container } = render(<Progress max={200} value={100} />);
      const fill = container.querySelector("[style]") as HTMLElement;
      expect(fill.style.width).toBe("50%");
    });

    it("does not produce NaN when max=0", () => {
      const { container } = render(<Progress max={0} value={50} />);
      const fill = container.querySelector("[style]") as HTMLElement;
      expect(fill.style.width).not.toContain("NaN");
    });
  });

  describe("size className", () => {
    it.each([
      "sm",
      "md",
      "lg",
    ] as const)('applies size className for size="%s"', (size) => {
      const { container } = render(<Progress size={size} value={50} />);
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toContain(`cocso-progress--size-${size}`);
    });

    it('defaults to size="md"', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toContain("cocso-progress--size-md");
    });
  });
});
