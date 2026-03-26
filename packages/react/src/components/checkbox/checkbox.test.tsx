import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders a checkbox", () => {
      render(<Checkbox onChange={vi.fn()} status="off" />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(<Checkbox label="I agree" onChange={vi.fn()} status="off" />);
      expect(screen.getByText("I agree")).toBeInTheDocument();
    });

    it("associates label with checkbox via htmlFor", () => {
      render(
        <Checkbox
          id="test-checkbox"
          label="I agree"
          onChange={vi.fn()}
          status="off"
        />
      );
      const label = screen.getByText("I agree");
      expect(label.closest("label")).toHaveAttribute("for", "test-checkbox");
    });
  });

  describe("status", () => {
    it('is checked when status="on"', () => {
      render(<Checkbox onChange={vi.fn()} status="on" />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it('is unchecked when status="off"', () => {
      render(<Checkbox onChange={vi.fn()} status="off" />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it('is indeterminate when status="intermediate"', () => {
      render(<Checkbox onChange={vi.fn()} status="intermediate" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-checked",
        "mixed"
      );
    });
  });

  describe("onChange", () => {
    it('calls onChange with "on" when clicked from unchecked state', async () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} status="off" />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalledWith("on");
    });

    it('calls onChange with "off" when clicked from checked state', async () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} status="on" />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalledWith("off");
    });
  });

  describe("controlled state retention", () => {
    it("does not toggle when controlled and onChange does not update status", async () => {
      render(<Checkbox onChange={vi.fn()} status="off" />);
      const checkbox = screen.getByRole("checkbox");
      await userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("disabled", () => {
    it("disables the checkbox when disabled=true", () => {
      render(<Checkbox disabled onChange={vi.fn()} status="off" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });

    it("does not call onChange when disabled and clicked", async () => {
      const onChange = vi.fn();
      render(<Checkbox disabled onChange={onChange} status="off" />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("size CSS variables", () => {
    it.each([
      "large",
      "medium",
      "small",
    ] as const)('sets size CSS variable for size="%s"', (size) => {
      const { container } = render(
        <Checkbox onChange={vi.fn()} size={size} status="off" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(
        wrapper.style.getPropertyValue("--cocso-checkbox-size")
      ).toBeTruthy();
    });
  });

  describe("uncontrolled", () => {
    it("renders with defaultStatus", () => {
      render(<Checkbox defaultStatus="on" />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("defaults to off when no status or defaultStatus is provided", () => {
      render(<Checkbox />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("toggles internally without onChange", async () => {
      render(<Checkbox defaultStatus="off" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("toggles back to off on second click", async () => {
      render(<Checkbox defaultStatus="off" />);
      const checkbox = screen.getByRole("checkbox");
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      await userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("calls onChange when provided in uncontrolled mode", async () => {
      const onChange = vi.fn();
      render(<Checkbox defaultStatus="off" onChange={onChange} />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalledWith("on");
    });

    it("does not toggle when disabled in uncontrolled mode", async () => {
      render(<Checkbox defaultStatus="off" disabled />);
      const checkbox = screen.getByRole("checkbox");
      await userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("renders defaultStatus intermediate as aria-checked mixed", () => {
      render(<Checkbox defaultStatus="intermediate" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-checked",
        "mixed"
      );
    });

    it("renders label in uncontrolled mode", () => {
      render(<Checkbox defaultStatus="off" label="Terms" />);
      expect(screen.getByText("Terms")).toBeInTheDocument();
    });
  });

  describe("development warnings", () => {
    it("warns when switching between controlled and uncontrolled mode", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      const { rerender } = render(<Checkbox />);

      rerender(<Checkbox status="off" />);

      expect(consoleError).toHaveBeenCalledWith(
        "Checkbox: switching between controlled and uncontrolled mode is not supported. " +
          "Use `status` (controlled) or `defaultStatus` (uncontrolled) for the component lifetime."
      );

      consoleError.mockRestore();
    });

    it("warns when status and defaultStatus are both provided", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      render(<Checkbox defaultStatus="off" status="on" />);

      expect(consoleError).toHaveBeenCalledWith(
        "Checkbox: `status` and `defaultStatus` are mutually exclusive. " +
          "Use `status` for controlled mode or `defaultStatus` for uncontrolled mode."
      );

      consoleError.mockRestore();
    });

    it("skips development warnings when NODE_ENV is production", () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      try {
        process.env.NODE_ENV = "production";

        render(<Checkbox defaultStatus="off" status="on" />);

        expect(consoleError).not.toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
        consoleError.mockRestore();
      }
    });
  });

  describe("defensive branches", () => {
    it("ignores primitive change callbacks when disabled", async () => {
      const user = userEvent.setup();

      vi.resetModules();
      vi.doMock("../../primitives/checkbox", () => ({
        Checkbox: {
          Root: ({
            checked,
            children,
            disabled,
            id,
            indeterminate,
            onCheckedChange,
          }: ComponentPropsWithoutRef<"input"> & {
            checked?: boolean;
            children?: ReactNode;
            disabled?: boolean;
            id?: string;
            indeterminate?: boolean;
            onCheckedChange?: (checked: boolean) => void;
          }) => {
            let ariaChecked: "false" | "mixed" | "true" = "false";

            if (indeterminate) {
              ariaChecked = "mixed";
            } else if (checked) {
              ariaChecked = "true";
            }

            return (
              <div>
                <input
                  aria-checked={ariaChecked}
                  aria-disabled={disabled ? "true" : undefined}
                  checked={checked}
                  id={id}
                  onChange={() => onCheckedChange?.(true)}
                  role="checkbox"
                  type="checkbox"
                />
                {children}
              </div>
            );
          },
          Indicator: ({ children }: { children?: ReactNode }) => (
            <span>{children}</span>
          ),
        },
      }));

      try {
        const { Checkbox: MockedCheckbox } = await import("./checkbox");
        const onChange = vi.fn();

        render(<MockedCheckbox disabled onChange={onChange} status="off" />);

        await user.click(screen.getByRole("checkbox"));

        expect(onChange).not.toHaveBeenCalled();
      } finally {
        vi.doUnmock("../../primitives/checkbox");
        vi.resetModules();
      }
    });
  });

  describe("className override (@layer)", () => {
    it("forwards custom className to the wrapper element", () => {
      const { container } = render(
        <Checkbox className="custom-override" onChange={vi.fn()} status="off" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-override");
    });

    it("preserves module className alongside custom className", () => {
      const { container } = render(
        <Checkbox className="custom-override" onChange={vi.fn()} status="off" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain("custom-override");
    });
  });
});
