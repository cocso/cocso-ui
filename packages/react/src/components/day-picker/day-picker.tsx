"use client";

import {
  ArrowIOSBackwardIcon,
  ArrowIOSForwardIcon,
} from "@cocso-ui/react-icons";
import type { Locale } from "date-fns";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { ComponentProps, ReactElement } from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { cn } from "../../cn";
import { Button } from "../button";
import { Popover } from "../popover";
import "../picker/picker-chrome.module.css";
import "../picker/picker-day-grid.module.css";
import {
  CalendarTitle,
  useYearMonthView,
  YearMonthView,
} from "../picker/year-month-view";
import styles from "./day-picker.module.css";

export interface DayPickerProps
  extends Omit<ComponentProps<"div">, "children"> {
  dateFormat?: string;
  disabled?: boolean;
  locale?: Locale;
  maxDate?: Date;
  minDate?: Date;
  onValueChange?: (value: Date | null) => void;
  trigger?: ReactElement;
  value?: Date;
}

// Where the calendar opens: the value's month, else today's, pulled inside
// the bounds so an empty picker with a future `minDate` does not open on a
// month where nothing can be picked.
const initialViewDate = (value?: Date, minDate?: Date, maxDate?: Date) => {
  if (value) {
    return value;
  }
  const today = new Date();
  if (minDate && today < minDate) {
    return minDate;
  }
  if (maxDate && today > maxDate) {
    return maxDate;
  }
  return today;
};

export function DayPicker({
  ref,
  className,
  value,
  onValueChange,
  disabled,
  trigger,
  locale = ko,
  dateFormat = "yyyy년 MM월 dd일",
  minDate,
  maxDate,
  ...props
}: DayPickerProps) {
  const [open, setOpen] = useState<boolean>(false);
  // The header's month opens a year-and-month grid in the same panel, so a
  // date years away is a few clicks instead of one click per month.
  const calendar = useYearMonthView(() =>
    initialViewDate(value, minDate, maxDate)
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      calendar.reset(initialViewDate(value, minDate, maxDate));
    }
  };

  const handleChange = (date: Date | null) => {
    onValueChange?.(date);
    setOpen(false);
  };

  return (
    <div className={cn(styles.root, className)} ref={ref} {...props}>
      <Popover onOpenChange={handleOpenChange} open={open}>
        <Popover.Trigger
          render={
            trigger ?? (
              <Button disabled={disabled} size="small" variant="outline">
                {value ? format(value, dateFormat, { locale }) : "Select date"}
              </Button>
            )
          }
        />
        <Popover.Content aria-label="Select date" className={styles.content}>
          {/* Both views stay mounted and only `hidden` flips, so the pressed
              button is never detached mid-press — a detached target can read
              as a press outside the panel and close it. */}
          <YearMonthView
            currentMonthRef={calendar.currentMonthRef}
            hidden={calendar.view !== "month"}
            locale={locale}
            maxDate={maxDate}
            minDate={minDate}
            minHeight={calendar.dayViewHeight}
            onBack={() => calendar.changeView("day")}
            onPick={calendar.jumpTo}
            onYearChange={calendar.setViewDate}
            selected={value}
            viewDate={calendar.viewDate}
          />
          <div hidden={calendar.view !== "day"}>
            <DatePicker
              dateFormat={dateFormat}
              dayClassName={(date) => {
                const day = date.getDay();
                if (day === 0) {
                  return styles.sunday;
                }
                if (day === 6) {
                  return styles.saturday;
                }
                return "";
              }}
              disabled={disabled}
              // Always draw six weeks. A month spans five or six rows, so the panel's
              // height changed while paging months, and the Popover positioner, seeing a
              // taller panel with too little room below, flipped it above the trigger
              // mid-interaction. A fixed height keeps the panel where it opened.
              fixedHeight
              inline
              key={calendar.calendarKey}
              locale={locale}
              maxDate={maxDate}
              minDate={minDate}
              onChange={handleChange}
              onMonthChange={calendar.setViewDate}
              openToDate={calendar.viewDate}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <>
                  <CalendarTitle
                    date={date}
                    locale={locale}
                    onPress={(panel) => calendar.openMonths(date, panel)}
                    ref={calendar.titleRef}
                  />

                  <div className={styles.menu}>
                    <Button
                      aria-label="Previous month"
                      className={styles.arrow}
                      disabled={prevMonthButtonDisabled}
                      onClick={decreaseMonth}
                      size="x-small"
                      svgOnly
                      type="button"
                      variant="outline"
                    >
                      <ArrowIOSBackwardIcon />
                    </Button>
                    <Button
                      aria-label="Next month"
                      className={styles.arrow}
                      disabled={nextMonthButtonDisabled}
                      onClick={increaseMonth}
                      size="x-small"
                      svgOnly
                      type="button"
                      variant="outline"
                    >
                      <ArrowIOSForwardIcon />
                    </Button>
                  </div>
                </>
              )}
              selected={value}
              showPopperArrow={false}
            />
          </div>
        </Popover.Content>
      </Popover>
    </div>
  );
}
