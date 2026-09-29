import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DateTimePicker } from "./date-time-picker";

const trigger = <button type="button">Select date and time</button>;

const openPopover = async () => {
  await userEvent.click(
    screen.getByRole("button", { name: "Select date and time" })
  );
  await waitFor(() => {
    expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
  });
};

const days = () =>
  Array.from(
    document.querySelectorAll(
      ".react-datepicker__day:not(.react-datepicker__day--disabled)"
    )
  ) as HTMLElement[];

const times = () =>
  Array.from(
    document.querySelectorAll(".react-datepicker__time-list-item")
  ) as HTMLElement[];

describe("DateTimePicker", () => {
  describe("rendering", () => {
    it("renders the trigger child element", () => {
      render(<DateTimePicker trigger={trigger} />);
      expect(
        screen.getByRole("button", { name: "Select date and time" })
      ).toBeInTheDocument();
    });

    it("does not show the calendar before the trigger is clicked", () => {
      render(<DateTimePicker trigger={trigger} />);
      expect(
        screen.queryByLabelText("Select date and time")
      ).not.toBeInTheDocument();
    });

    it("opens the calendar and the time list together", async () => {
      render(<DateTimePicker trigger={trigger} />);
      await openPopover();
      expect(
        document.querySelector(".react-datepicker__time-container")
      ).toBeInTheDocument();
    });
  });

  describe("choosing a value", () => {
    // The whole reason this is not `DayPicker`: a date alone is not a value,
    // so the popover stays up and nothing is reported yet.
    it("keeps the popover open and reports nothing when only a date is picked", async () => {
      const onValueChange = vi.fn();
      render(
        <DateTimePicker onValueChange={onValueChange} trigger={trigger} />
      );
      await openPopover();

      const day = days().at(10);
      expect(day).toBeDefined();
      await userEvent.click(day as HTMLElement);

      expect(onValueChange).not.toHaveBeenCalled();
      expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
    });

    it("reports the value and closes once a time is picked", async () => {
      const onValueChange = vi.fn();
      render(
        <DateTimePicker onValueChange={onValueChange} trigger={trigger} />
      );
      await openPopover();

      const day = days().at(10);
      await userEvent.click(day as HTMLElement);

      const time = times().find(
        (item) =>
          !item.className.includes("react-datepicker__time-list-item--disabled")
      );
      expect(time).toBeDefined();
      await userEvent.click(time as HTMLElement);

      expect(onValueChange).toHaveBeenCalledOnce();
      const [reported] = onValueChange.mock.calls[0] as [Date];
      expect(reported).toBeInstanceOf(Date);
      await waitFor(() => {
        expect(
          document.querySelector(".react-datepicker")
        ).not.toBeInTheDocument();
      });
    });

    it("carries the day that was picked into the reported value", async () => {
      const onValueChange = vi.fn();
      render(
        <DateTimePicker onValueChange={onValueChange} trigger={trigger} />
      );
      await openPopover();

      const day = days().at(10) as HTMLElement;
      const picked = Number(day.textContent);
      await userEvent.click(day);
      await userEvent.click(times()[0] as HTMLElement);

      const [reported] = onValueChange.mock.calls[0] as [Date];
      expect(reported.getDate()).toBe(picked);
    });
  });

  describe("bounds", () => {
    it("disables the times before minDate on minDate's own day", async () => {
      const min = new Date();
      min.setHours(14, 0, 0, 0);
      render(<DateTimePicker minDate={min} trigger={trigger} value={min} />);
      await openPopover();

      const disabled = times().filter((item) =>
        item.className.includes("react-datepicker__time-list-item--disabled")
      );
      expect(disabled.length).toBeGreaterThan(0);
      // 14:00 itself is the boundary and stays available.
      expect(disabled.some((item) => item.textContent?.includes("14:00"))).toBe(
        false
      );
    });

    it("leaves a later day's morning open", async () => {
      const min = new Date();
      min.setHours(14, 0, 0, 0);
      const later = new Date(min);
      later.setDate(later.getDate() + 3);
      later.setHours(9, 0, 0, 0);
      render(<DateTimePicker minDate={min} trigger={trigger} value={later} />);
      await openPopover();

      const nine = times().find((item) => item.textContent?.includes("09:00"));
      expect(nine).toBeDefined();
      expect(nine?.className).not.toContain(
        "react-datepicker__time-list-item--disabled"
      );
    });

    it("accepts filterTime without throwing", () => {
      expect(() =>
        render(
          <DateTimePicker
            filterTime={(date) => date.getHours() >= 9}
            trigger={trigger}
          />
        )
      ).not.toThrow();
    });
  });

  describe("disabled state", () => {
    it("renders the trigger when disabled", () => {
      render(<DateTimePicker disabled trigger={trigger} />);
      expect(
        screen.getByRole("button", { name: "Select date and time" })
      ).toBeInTheDocument();
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
      render(<DateTimePicker trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select date and time" })
      );

      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });
      expect(document.querySelector('[role="menu"]')).toBeNull();
      expect(
        screen.getByRole("dialog", { name: "Select date and time" })
      ).toBeInTheDocument();
    });
  });
});
