import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DayPicker } from "./day-picker";

const trigger = <button type="button">Select date</button>;

describe("DayPicker", () => {
  describe("rendering", () => {
    it("renders the root container", () => {
      const { container } = render(<DayPicker trigger={trigger} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders the trigger child element", () => {
      render(<DayPicker trigger={trigger} />);
      expect(
        screen.getByRole("button", { name: "Select date" })
      ).toBeInTheDocument();
    });

    it("does not show the calendar before the trigger is clicked", () => {
      render(<DayPicker trigger={trigger} />);
      expect(screen.queryByLabelText("Select date")).not.toBeInTheDocument();
    });
  });

  describe("calendar open/close", () => {
    it("opens the calendar dropdown when the trigger is clicked", async () => {
      render(<DayPicker trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select date" })
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Select date")).toBeInTheDocument();
      });
    });

    it("renders the inline calendar after opening", async () => {
      render(<DayPicker trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select date" })
      );
      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });
    });
  });

  describe("height", () => {
    it("always renders six weeks so the panel does not change height between months", async () => {
      // October 2026 spans five weeks, August 2026 six.
      const { unmount } = render(
        <DayPicker trigger={trigger} value={new Date(2026, 9, 15)} />
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Select date" })
      );
      await waitFor(() => {
        expect(
          document.querySelectorAll(".react-datepicker__week")
        ).toHaveLength(6);
      });
      unmount();

      render(<DayPicker trigger={trigger} value={new Date(2026, 7, 15)} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select date" })
      );
      await waitFor(() => {
        expect(
          document.querySelectorAll(".react-datepicker__week")
        ).toHaveLength(6);
      });
    });
  });

  describe("value prop", () => {
    it("accepts a value prop without throwing", () => {
      const date = new Date(2024, 0, 15);
      expect(() =>
        render(<DayPicker trigger={trigger} value={date} />)
      ).not.toThrow();
    });
  });

  describe("onValueChange", () => {
    it("calls onValueChange when a date is selected", async () => {
      const onValueChange = vi.fn();
      render(<DayPicker onValueChange={onValueChange} trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select date" })
      );

      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });

      const dayCell = document.querySelector(
        ".react-datepicker__day:not(.react-datepicker__day--disabled)"
      ) as HTMLElement | null;

      expect(dayCell).not.toBeNull();
      await userEvent.click(dayCell as Element);
      expect(onValueChange).toHaveBeenCalledOnce();
    });
  });

  describe("disabled state", () => {
    it("renders without throwing when disabled=true", () => {
      expect(() =>
        render(<DayPicker disabled trigger={trigger} />)
      ).not.toThrow();
    });

    it("renders the trigger button when disabled", () => {
      render(<DayPicker disabled trigger={trigger} />);
      expect(
        screen.getByRole("button", { name: "Select date" })
      ).toBeInTheDocument();
    });
  });

  describe("date constraints", () => {
    it("accepts minDate and maxDate without throwing", () => {
      const min = new Date(2024, 0, 1);
      const max = new Date(2024, 11, 31);
      expect(() =>
        render(<DayPicker maxDate={max} minDate={min} trigger={trigger} />)
      ).not.toThrow();
    });
  });
  describe("year and month view", () => {
    const openAt = async (props: Parameters<typeof DayPicker>[0] = {}) => {
      render(<DayPicker trigger={trigger} {...props} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select date" })
      );
      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });
    };

    it("opens the month grid from the header and lands on the picked month", async () => {
      const onValueChange = vi.fn();
      await openAt({ onValueChange, value: new Date(2026, 9, 15) });

      await userEvent.click(
        screen.getByRole("button", { name: "Choose year and month" })
      );
      expect(
        screen.queryByRole("button", { name: "Choose year and month" })
      ).toBeNull();
      expect(
        screen.getByRole("button", { name: "Back to days" })
      ).toHaveTextContent("2026년");
      expect(screen.getByRole("button", { name: "10월" })).toHaveAttribute(
        "aria-current",
        "date"
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Previous year" })
      );
      await userEvent.click(screen.getByRole("button", { name: "3월" }));

      expect(screen.getByText("2025년 3월")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Choose year and month" })
      ).toHaveFocus();
      // Moving around is not picking: the value stays until a day is chosen.
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("returns to the days without moving when the year is pressed", async () => {
      await openAt({ value: new Date(2026, 9, 15) });
      await userEvent.click(
        screen.getByRole("button", { name: "Choose year and month" })
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Back to days" })
      );
      expect(screen.getByText("2026년 10월")).toBeInTheDocument();
    });

    it("disables months and years outside minDate and maxDate", async () => {
      await openAt({
        maxDate: new Date(2026, 7, 31),
        minDate: new Date(2026, 2, 10),
        value: new Date(2026, 5, 1),
      });
      await userEvent.click(
        screen.getByRole("button", { name: "Choose year and month" })
      );

      expect(screen.getByRole("button", { name: "2월" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "3월" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "8월" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "9월" })).toBeDisabled();
      expect(
        screen.getByRole("button", { name: "Previous year" })
      ).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next year" })).toBeDisabled();
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
      render(<DayPicker trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select date" })
      );

      await waitFor(() => {
        expect(document.querySelector(".react-datepicker")).toBeInTheDocument();
      });
      expect(document.querySelector('[role="menu"]')).toBeNull();
      expect(
        screen.getByRole("dialog", { name: "Select date" })
      ).toBeInTheDocument();
    });
  });
});
