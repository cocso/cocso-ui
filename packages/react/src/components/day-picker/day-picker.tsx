"use client";

import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  ArrowIOSBackwardIcon,
  ArrowIOSForwardIcon,
} from "@cocso-ui/react-icons";
import type { Locale } from "date-fns";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import type { ComponentProps, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { cn } from "../../cn";
import { Button } from "../button";
import { Popover } from "../popover";
import { Typography } from "../typography";
import "../picker/picker-chrome.module.css";
import "../picker/picker-day-grid.module.css";
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

type View = "day" | "month";

const MONTHS = Array.from({ length: 12 }, (_, month) => month);

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
  const [view, setView] = useState<View>("day");
  const [viewDate, setViewDate] = useState<Date>(() =>
    initialViewDate(value, minDate, maxDate)
  );
  // Remounts the calendar after a jump. A live calendar follows its keyboard
  // cursor before `openToDate`, so a fresh mount is the reliable way to land
  // on the picked month.
  const [calendarKey, setCalendarKey] = useState(0);
  // The day grid's height, held by the month grid so the panel does not
  // shrink under the pointer — a panel opened above its trigger would jump.
  const [dayViewHeight, setDayViewHeight] = useState<number>();
  const focusAfterViewChange = useRef(false);
  const titleRef = useRef<HTMLButtonElement>(null);
  const currentMonthRef = useRef<HTMLButtonElement>(null);

  // A view change unmounts the control that had focus. Hand it to the
  // matching control in the new view instead of dropping it on the body.
  useEffect(() => {
    if (!focusAfterViewChange.current) {
      return;
    }
    focusAfterViewChange.current = false;
    (view === "month" ? currentMonthRef : titleRef).current?.focus();
  }, [view]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setView("day");
      setViewDate(initialViewDate(value, minDate, maxDate));
      setCalendarKey((key) => key + 1);
    }
  };

  const handleChange = (date: Date | null) => {
    onValueChange?.(date);
    setOpen(false);
  };

  const changeView = (next: View) => {
    focusAfterViewChange.current = true;
    setView(next);
  };

  const jumpTo = (year: number, month: number) => {
    setViewDate(new Date(year, month, 1));
    setCalendarKey((key) => key + 1);
    changeView("day");
  };

  const year = viewDate.getFullYear();
  const monthDisabled = (month: number) => {
    const first = startOfMonth(new Date(year, month, 1));
    return (
      (minDate !== undefined && endOfMonth(first) < minDate) ||
      (maxDate !== undefined && first > maxDate)
    );
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
          <div
            className={styles.monthView}
            hidden={view !== "month"}
            style={{ minHeight: dayViewHeight }}
          >
            <div className={styles.monthHeader}>
              <button
                aria-label="Back to days"
                className={styles.title}
                onClick={() => changeView("day")}
                type="button"
              >
                <Typography size="small" type="body" weight="semibold">
                  {viewDate.toLocaleDateString(locale.code ?? "ko-KR", {
                    year: "numeric",
                  })}
                </Typography>
                <ArrowDropUpIcon aria-hidden size={16} />
              </button>

              <div className={styles.menu}>
                <Button
                  aria-label="Previous year"
                  className={styles.arrow}
                  disabled={
                    minDate !== undefined && year - 1 < minDate.getFullYear()
                  }
                  onClick={() => setViewDate(new Date(year - 1, 0, 1))}
                  size="x-small"
                  svgOnly
                  type="button"
                  variant="outline"
                >
                  <ArrowIOSBackwardIcon />
                </Button>
                <Button
                  aria-label="Next year"
                  className={styles.arrow}
                  disabled={
                    maxDate !== undefined && year + 1 > maxDate.getFullYear()
                  }
                  onClick={() => setViewDate(new Date(year + 1, 0, 1))}
                  size="x-small"
                  svgOnly
                  type="button"
                  variant="outline"
                >
                  <ArrowIOSForwardIcon />
                </Button>
              </div>
            </div>

            <div className={styles.monthGrid}>
              {MONTHS.map((month) => {
                const current =
                  value !== undefined &&
                  value.getFullYear() === year &&
                  value.getMonth() === month;
                const isViewed = viewDate.getMonth() === month;
                return (
                  <button
                    aria-current={current ? "date" : undefined}
                    className={styles.monthCell}
                    data-selected={current || undefined}
                    disabled={monthDisabled(month)}
                    key={month}
                    onClick={() => jumpTo(year, month)}
                    ref={isViewed ? currentMonthRef : undefined}
                    type="button"
                  >
                    {format(new Date(year, month, 1), "LLL", { locale })}
                  </button>
                );
              })}
            </div>
          </div>
          <div hidden={view !== "day"}>
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
              key={calendarKey}
              locale={locale}
              maxDate={maxDate}
              minDate={minDate}
              onChange={handleChange}
              onMonthChange={setViewDate}
              openToDate={viewDate}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <>
                  <button
                    aria-label="Choose year and month"
                    className={styles.title}
                    onClick={(event) => {
                      setDayViewHeight(
                        event.currentTarget
                          .closest(".react-datepicker")
                          ?.getBoundingClientRect().height
                      );
                      setViewDate(date);
                      changeView("month");
                    }}
                    ref={titleRef}
                    type="button"
                  >
                    <Typography size="small" type="body" weight="semibold">
                      {date.toLocaleDateString(locale.code ?? "ko-KR", {
                        year: "numeric",
                        month: "long",
                      })}
                    </Typography>
                    <ArrowDropDownIcon aria-hidden size={16} />
                  </button>

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
