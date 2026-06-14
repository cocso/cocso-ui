import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Switch } from "./switch";

describe("Switch", () => {
  describe("rendering", () => {
    it("renders a switch", () => {
      render(<Switch />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(<Switch label="Notifications" />);
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    });
  });

  describe("checked state", () => {
    it("is on when checked=true", () => {
      render(<Switch checked />);
      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("is off when checked=false", () => {
      render(<Switch checked={false} />);
      expect(screen.getByRole("switch")).not.toBeChecked();
    });
  });

  describe("onCheckedChange", () => {
    it("calls onCheckedChange when clicked", async () => {
      const onCheckedChange = vi.fn();
      render(<Switch onCheckedChange={onCheckedChange} />);
      await userEvent.click(screen.getByRole("switch"));
      expect(onCheckedChange).toHaveBeenCalledOnce();
    });
  });

  describe("disabled", () => {
    it("disables the switch when disabled=true", () => {
      render(<Switch disabled />);
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });

    it("does not call onCheckedChange when disabled and clicked", async () => {
      const onCheckedChange = vi.fn();
      render(<Switch disabled onCheckedChange={onCheckedChange} />);
      await userEvent.click(screen.getByRole("switch"));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe("label position", () => {
    it('renders label after switch by default (position="right")', () => {
      render(<Switch label="Notifications" position="right" />);
      const label = screen.getByText("Notifications");
      const switchEl = screen.getByRole("switch");
      expect(switchEl.compareDocumentPosition(label)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    it('renders label before switch when position="left"', () => {
      render(<Switch label="Notifications" position="left" />);
      const label = screen.getByText("Notifications");
      const switchEl = screen.getByRole("switch");
      expect(switchEl.compareDocumentPosition(label)).toBe(
        Node.DOCUMENT_POSITION_PRECEDING
      );
    });
  });

  describe("size className", () => {
    it.each([
      "small",
      "medium",
      "large",
    ] as const)('applies size className for size="%s"', (size) => {
      const { container } = render(<Switch size={size} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain(`cocso-switch--size-${size}`);
    });

    it("applies distinct size classNames for each size", () => {
      const { container: smallContainer } = render(<Switch size="small" />);
      const { container: mediumContainer } = render(<Switch size="medium" />);
      const { container: largeContainer } = render(<Switch size="large" />);
      const smallWrapper = smallContainer.firstChild as HTMLElement;
      const mediumWrapper = mediumContainer.firstChild as HTMLElement;
      const largeWrapper = largeContainer.firstChild as HTMLElement;
      expect(smallWrapper.className).toContain("cocso-switch--size-small");
      expect(mediumWrapper.className).toContain("cocso-switch--size-medium");
      expect(largeWrapper.className).toContain("cocso-switch--size-large");
    });
  });

  describe("variant className", () => {
    it.each([
      "primary",
      "success",
      "error",
      "warning",
    ] as const)('applies variant className for variant="%s"', (variant) => {
      const { container } = render(<Switch variant={variant} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain(`cocso-switch--variant-${variant}`);
    });
  });

  describe("custom id", () => {
    it("wires the label htmlFor to the provided id", () => {
      render(<Switch id="my-switch" label="My Label" />);
      const label = screen.getByText("My Label").closest("label");
      expect(label).toHaveAttribute("for", "my-switch");
    });
  });
});
