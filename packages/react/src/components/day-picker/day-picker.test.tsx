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
      expect(screen.queryByLabelText("날짜 선택")).not.toBeInTheDocument();
    });
  });

  describe("calendar open/close", () => {
    it("opens the calendar dropdown when the trigger is clicked", async () => {
      render(<DayPicker trigger={trigger} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Select date" })
      );
      await waitFor(() => {
        expect(screen.getByLabelText("날짜 선택")).toBeInTheDocument();
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
});
