import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { colors, fontWeight as fontWeightToken } from "../../token";
import { Button } from "./button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
    });

    it("applies the given type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("renders prefix", () => {
      render(
        <Button prefix={<span data-testid="prefix-icon" />}>Button</Button>
      );
      expect(screen.getByTestId("prefix-icon")).toBeInTheDocument();
    });

    it("renders suffix", () => {
      render(
        <Button suffix={<span data-testid="suffix-icon" />}>Button</Button>
      );
      expect(screen.getByTestId("suffix-icon")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("disables the button when loading=true", () => {
      render(<Button loading>Button</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("renders Spinner when loading=true", () => {
      render(<Button loading>Button</Button>);
      const button = screen.getByRole("button");
      const spinner = button.querySelector('[aria-label="Loading"]');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("disables the button when disabled=true", () => {
      render(<Button disabled>Button</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not call onClick when disabled", async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Button
        </Button>
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("events", () => {
    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Button</Button>);
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe("render prop", () => {
    it("renders as the provided element when render is given", () => {
      render(
        <Button render={<a href="/test">Link Button</a>}>Link Button</Button>
      );
      expect(
        screen.getByRole("link", { name: "Link Button" })
      ).toBeInTheDocument();
    });
  });

  describe("className override (@layer)", () => {
    it("forwards custom className to the button element", () => {
      render(<Button className="custom-override">Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-override");
    });

    it("preserves module className alongside custom className", () => {
      render(<Button className="custom-override">Button</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-override");
    });

    it("forwards custom className through render prop", () => {
      render(
        <Button
          className="custom-override"
          render={<a href="/test">Custom button</a>}
        >
          Custom button
        </Button>
      );
      expect(screen.getByRole("link")).toHaveClass("custom-override");
    });
  });

  describe("size CSS variables", () => {
    it.each([
      ["large", "40px"],
      ["medium", "36px"],
      ["small", "32px"],
      ["x-small", "28px"],
    ] as const)('sets height to "%s" when size="%s"', (size, expectedHeight) => {
      render(<Button size={size}>Button</Button>);
      expect(screen.getByRole("button")).toHaveStyle({
        "--cocso-button-height": expectedHeight,
      });
    });
  });
});

describe("Button variant CSS variables", () => {
  it.each([
    ["primary", colors.primary500],
    ["secondary", colors.transparent],
    ["ghost", colors.white],
    ["success", colors.success500],
    ["error", colors.danger500],
    ["warning", colors.warning300],
  ] as const)('sets --cocso-button-bg-color for variant="%s"', (variant, expectedBg) => {
    render(<Button variant={variant}>Button</Button>);
    expect(screen.getByRole("button")).toHaveStyle({
      "--cocso-button-bg-color": expectedBg,
    });
  });

  it.each([
    ["primary", colors.white],
    ["success", colors.white],
    ["error", colors.white],
    ["secondary", colors.neutral950],
    ["ghost", colors.neutral950],
    ["warning", colors.neutral950],
  ] as const)('sets --cocso-button-font-color for variant="%s"', (variant, expectedColor) => {
    render(<Button variant={variant}>Button</Button>);
    expect(screen.getByRole("button")).toHaveStyle({
      "--cocso-button-font-color": expectedColor,
    });
  });

  it('sets border for variant="secondary"', () => {
    render(<Button variant="secondary">Button</Button>);
    expect(screen.getByRole("button")).toHaveStyle({
      "--cocso-button-border": `1px solid ${colors.neutral100}`,
    });
  });

  it("sets no border for non-secondary variant", () => {
    render(<Button variant="primary">Button</Button>);
    expect(screen.getByRole("button")).toHaveStyle({
      "--cocso-button-border": "none",
    });
  });
});

describe("Button shape CSS variables", () => {
  it.each([
    ["square", "medium", "var(--cocso-radius-4)"],
    ["square", "x-small", "var(--cocso-radius-3)"],
    ["circle", "medium", "100%"],
    ["rounded", "medium", "var(--cocso-radius-full)"],
  ] as const)('sets border-radius for shape="%s" size="%s"', (shape, size, expected) => {
    render(
      <Button shape={shape} size={size}>
        Button
      </Button>
    );
    expect(screen.getByRole("button")).toHaveStyle({
      "--cocso-button-border-radius": expected,
    });
  });
});

describe("Button weight CSS variable", () => {
  it.each([
    ["thin", String(fontWeightToken.thin)],
    ["normal", String(fontWeightToken.normal)],
    ["bold", String(fontWeightToken.bold)],
  ] as const)('sets --cocso-button-font-weight for weight="%s"', (weight, expected) => {
    render(<Button weight={weight}>Button</Button>);
    expect(screen.getByRole("button")).toHaveStyle({
      "--cocso-button-font-weight": expected,
    });
  });
});

describe("Button svgOnly", () => {
  it("renders without error when svgOnly=true", () => {
    render(
      <Button svgOnly>
        <svg aria-hidden="true" />
      </Button>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
