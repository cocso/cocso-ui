import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MonthPicker } from "./month-picker";

const trigger = <button type="button">Select month</button>;

describe("MonthPicker", () => {
  describe("rendering", () => {
    it("renders the root container", () => {
      const { container } = render(<MonthPicker trigger={trigger} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders the trigger child element", () => {
      render(<MonthPicker trigger={trigger} />);
      expect(
        screen.getByRole("button", { name: "Select month" })
      ).toBeInTheDocument();
    });

    it("does not show the calendar before the trigger is clicked", () => {
      render(<MonthPicker trigger={trigger} />);
      expect(
        document.querySelector(".react-datepicker")
      ).not.toBeInTheDocument();
    });
  });

  describe("calendar open/close", () => {
    it("opens the calendar dropdown when the trigger is clicked", async () => {
      render(<MonthPicker trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select month" })
      );
      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });
    });

    it("renders a month-year picker calendar after opening", async () => {
      render(<MonthPicker trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select month" })
      );
      await waitFor(() => {
        expect(
          document.querySelector(".react-datepicker__month-wrapper")
        ).toBeInTheDocument();
      });
    });
  });

  describe("value prop", () => {
    it("accepts a value prop without throwing", () => {
      const date = new Date(2024, 2, 1);
      expect(() =>
        render(<MonthPicker trigger={trigger} value={date} />)
      ).not.toThrow();
    });
  });

  describe("onValueChange", () => {
    it("calls onValueChange when a month is selected", async () => {
      const onValueChange = vi.fn();
      render(<MonthPicker onValueChange={onValueChange} trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select month" })
      );

      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });

      const monthCell = document.querySelector(
        ".react-datepicker__month-text:not(.react-datepicker__month-text--disabled)"
      ) as HTMLElement | null;

      expect(monthCell).not.toBeNull();
      await userEvent.click(monthCell as Element);
      expect(onValueChange).toHaveBeenCalledOnce();
    });

    it("passes a Date or null to onValueChange", async () => {
      const onValueChange = vi.fn();
      render(<MonthPicker onValueChange={onValueChange} trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select month" })
      );

      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });

      const monthCell = document.querySelector(
        ".react-datepicker__month-text:not(.react-datepicker__month-text--disabled)"
      ) as HTMLElement | null;

      expect(monthCell).not.toBeNull();
      await userEvent.click(monthCell as Element);

      const [calledWith] = onValueChange.mock.calls[0];
      expect(calledWith).toBeInstanceOf(Date);
    });
  });

  describe("disabled state", () => {
    it("renders without throwing when disabled=true", () => {
      expect(() =>
        render(<MonthPicker disabled trigger={trigger} />)
      ).not.toThrow();
    });

    it("renders the trigger button when disabled", () => {
      render(<MonthPicker disabled trigger={trigger} />);
      expect(
        screen.getByRole("button", { name: "Select month" })
      ).toBeInTheDocument();
    });
  });

  describe("date constraints", () => {
    it("accepts minDate and maxDate without throwing", () => {
      const min = new Date(2024, 0, 1);
      const max = new Date(2024, 11, 1);
      expect(() =>
        render(<MonthPicker maxDate={max} minDate={min} trigger={trigger} />)
      ).not.toThrow();
    });
  });
  describe("popup role", () => {
    /**
     * The calendar lived in a `Dropdown`, whose popup is Base UI's `Menu.Popup`
     * and reports `role="menu"`. A menu's required children are `menuitem`s and
     * a grid of days has none, so axe called it a critical
     * `aria-required-children` and a screen reader announced a menu with
     * nothing in it. The panel is a `Popover` now — a labelled dialog.
     */
    it("does not announce the calendar as a menu", async () => {
      render(<MonthPicker trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select month" })
      );

      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });
      expect(document.querySelector('[role="menu"]')).toBeNull();
      expect(
        screen.getByRole("dialog", { name: "Select month" })
      ).toBeInTheDocument();
    });
  });
});
