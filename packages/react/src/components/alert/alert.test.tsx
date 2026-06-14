import { render, screen } from "@testing-library/react";

import { Alert } from "./alert";

describe("Alert", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<Alert>Alert message</Alert>);
      expect(screen.getByText("Alert message")).toBeInTheDocument();
    });

    it('has role="alert" attribute', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("accepts additional className", () => {
      const { container } = render(
        <Alert className="custom-class">Alert</Alert>
      );
      const alert = container.firstChild as HTMLElement;
      expect(alert.className).toContain("custom-class");
    });

    it("renders close button when onClose is provided", () => {
      const onClose = vi.fn();
      render(<Alert onClose={onClose}>Alert</Alert>);
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("renders icon element when icon is provided", () => {
      render(<Alert icon={<span data-testid="icon">!</span>}>Alert</Alert>);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });
  });

  describe("variant className", () => {
    it.each([
      "info",
      "success",
      "warning",
      "error",
    ] as const)('applies variant className for variant="%s"', (variant) => {
      const { container } = render(<Alert variant={variant}>Alert</Alert>);
      const alert = container.firstChild as HTMLElement;
      expect(alert.className).toContain(`cocso-alert--variant-${variant}`);
    });

    it('defaults to variant="info"', () => {
      const { container } = render(<Alert>Alert</Alert>);
      const alert = container.firstChild as HTMLElement;
      expect(alert.className).toContain("cocso-alert--variant-info");
    });
  });
});
