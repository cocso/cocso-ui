import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Link } from "./link";

describe("Link", () => {
  describe("rendering", () => {
    it("renders as an anchor element", () => {
      render(<Link href="/home">Home</Link>);
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    });

    it("forwards href to the anchor", () => {
      render(<Link href="/about">About</Link>);
      expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
        "href",
        "/about"
      );
    });

    it("renders children correctly", () => {
      render(<Link href="#">Click me</Link>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("forwards className to the rendered element", () => {
      render(
        <Link className="custom-link" href="#">
          Link
        </Link>
      );
      expect(screen.getByRole("link")).toHaveClass("custom-link");
    });
  });

  describe("render prop", () => {
    it("renders as the provided element when render is given", () => {
      render(
        <Link render={<button type="button">Button link</button>}>
          Button link
        </Link>
      );
      expect(
        screen.getByRole("button", { name: "Button link" })
      ).toBeInTheDocument();
    });

    it("does not render an anchor when render is provided", () => {
      render(
        <Link render={<button type="button">Button link</button>}>
          Button link
        </Link>
      );
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("size CSS variable (font-size)", () => {
    it.each([
      ["large", "18px"],
      ["medium", "16px"],
      ["small", "14px"],
      ["x-small", "12px"],
    ] as const)('sets font-size for size="%s"', (size, expectedPx) => {
      render(
        <Link href="#" size={size}>
          Link
        </Link>
      );
      const link = screen.getByRole("link");
      expect(link.style.getPropertyValue("--cocso-typography-font-size")).toBe(
        expectedPx
      );
    });
  });

  describe("indicator prop", () => {
    it("applies indicator class by default", () => {
      const { container } = render(<Link href="#">Link</Link>);
      const anchor = container.querySelector("a");
      expect(anchor?.className).toBeTruthy();
    });
  });

  describe("events", () => {
    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      render(
        <Link href="#" onClick={onClick}>
          Clickable
        </Link>
      );
      await userEvent.click(screen.getByRole("link", { name: "Clickable" }));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe("weight CSS variable", () => {
    it.each([
      ["normal", "400"],
      ["medium", "500"],
      ["bold", "700"],
    ] as const)('sets font-weight for weight="%s"', (weight, expectedValue) => {
      render(
        <Link href="#" weight={weight}>
          Link
        </Link>
      );
      const link = screen.getByRole("link");
      expect(
        link.style.getPropertyValue("--cocso-typography-font-weight")
      ).toBe(expectedValue);
    });
  });

  describe("variant className", () => {
    it.each([
      "inline",
      "current",
      "plain",
    ] as const)('applies variant className for variant="%s"', (variant) => {
      render(
        <Link href="#" variant={variant}>
          Link
        </Link>
      );
      const link = screen.getByRole("link");
      expect(link.className).toContain(`cocso-link--variant-${variant}`);
    });
  });

  describe("indicator prop explicit", () => {
    it("removes indicator class when indicator=false on non-plain variant", () => {
      const { container: withIndicator } = render(
        <Link href="#" variant="inline">
          Link
        </Link>
      );
      const { container: withoutIndicator } = render(
        <Link href="#" indicator={false} variant="inline">
          Link
        </Link>
      );
      const classWithIndicator = withIndicator.querySelector("a")?.className;
      const classWithoutIndicator =
        withoutIndicator.querySelector("a")?.className;
      expect(classWithIndicator).not.toBe(classWithoutIndicator);
    });

    it("adds indicator class when indicator=true on variant='plain'", () => {
      const { container: withIndicator } = render(
        <Link href="#" indicator={true} variant="plain">
          Link
        </Link>
      );
      const { container: withoutIndicator } = render(
        <Link href="#" variant="plain">
          Link
        </Link>
      );
      const classWithIndicator = withIndicator.querySelector("a")?.className;
      const classWithoutIndicator =
        withoutIndicator.querySelector("a")?.className;
      expect(classWithIndicator).not.toBe(classWithoutIndicator);
    });
  });

  describe("Link.ExternalIcon", () => {
    it("renders the external link icon", () => {
      const { container } = render(<Link.ExternalIcon />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("forwards className to the icon", () => {
      const { container } = render(
        <Link.ExternalIcon className="custom-icon" />
      );
      expect(container.firstChild).toHaveClass("custom-icon");
    });
  });
});
