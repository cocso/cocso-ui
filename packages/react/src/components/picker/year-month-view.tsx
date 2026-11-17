"use client";

import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  ArrowIOSBackwardIcon,
  ArrowIOSForwardIcon,
} from "@cocso-ui/react-icons";
import type { Locale } from "date-fns";
import { endOfMonth, format, startOfMonth } from "date-fns";
import type { Ref } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../button";
import { Typography } from "../typography";
import styles from "./year-month-view.module.css";

const MONTHS = Array.from({ length: 12 }, (_, month) => month);

export type CalendarView = "day" | "month";

/**
 * The state behind a calendar header that opens a year-and-month grid, shared
 * by DayPicker and DateTimePicker so a date years away is a few clicks in
 * either of them instead of one click per month.
 */
export function useYearMonthView(initial: () => Date) {
  const [view, setView] = useState<CalendarView>("day");
  const [viewDate, setViewDate] = useState<Date>(initial);
  // Remounts the calendar after a jump. A live calendar follows its keyboard
  // cursor before `openToDate`, so a fresh mount is the reliable way to land
  // on the picked month.
  const [calendarKey, setCalendarKey] = useState(0);
  // The day grid's height, held by the month grid so the panel does not
  // shrink under the pointer — a panel opened above its trigger would jump.
  const [dayViewHeight, setDayViewHeight] = useState<number>();
  const focusAfterViewChange = useRef(false);
  const titleElement = useRef<HTMLButtonElement | null>(null);
  // Set when the day view should take focus but its header is not mounted yet.
  // A remounted calendar draws its header in a later pass when it carries a
  // time list (DateTimePicker), after the view effect has already run.
  const titleFocusPending = useRef(false);
  const currentMonthRef = useRef<HTMLButtonElement>(null);

  const titleRef = useCallback((element: HTMLButtonElement | null) => {
    titleElement.current = element;
    if (element && titleFocusPending.current) {
      titleFocusPending.current = false;
      element.focus();
    }
  }, []);

  // A view change unmounts the control that had focus. Hand it to the
  // matching control in the new view instead of dropping it on the body.
  useEffect(() => {
    if (!focusAfterViewChange.current) {
      return;
    }
    focusAfterViewChange.current = false;
    if (view === "month") {
      currentMonthRef.current?.focus();
      return;
    }
    const title = titleElement.current;
    if (title?.isConnected) {
      title.focus();
    } else {
      titleFocusPending.current = true;
    }
  }, [view]);

  const changeView = (next: CalendarView) => {
    focusAfterViewChange.current = true;
    setView(next);
  };

  /** Back to the day grid on `date`'s month, as when the panel opens. */
  const reset = (date: Date) => {
    setView("day");
    setViewDate(date);
    setCalendarKey((key) => key + 1);
  };

  const openMonths = (date: Date, calendar: Element | null | undefined) => {
    setDayViewHeight(calendar?.getBoundingClientRect().height);
    setViewDate(date);
    changeView("month");
  };

  const jumpTo = (year: number, month: number) => {
    setViewDate(new Date(year, month, 1));
    setCalendarKey((key) => key + 1);
    changeView("day");
  };

  return {
    calendarKey,
    changeView,
    currentMonthRef,
    dayViewHeight,
    jumpTo,
    openMonths,
    reset,
    setViewDate,
    titleRef,
    view,
    viewDate,
  };
}

interface CalendarTitleProps {
  date: Date;
  locale: Locale;
  onPress: (calendar: Element | null) => void;
  ref?: Ref<HTMLButtonElement>;
}

/** The day grid's "2026년 10월 ▾", pressed to open the month grid. */
export function CalendarTitle({
  date,
  locale,
  onPress,
  ref,
}: CalendarTitleProps) {
  return (
    <button
      aria-label="Choose year and month"
      className={styles.title}
      onClick={(event) =>
        onPress(event.currentTarget.closest(".react-datepicker"))
      }
      ref={ref}
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
  );
}

interface YearMonthViewProps {
  currentMonthRef: Ref<HTMLButtonElement>;
  hidden: boolean;
  locale: Locale;
  maxDate?: Date;
  minDate?: Date;
  minHeight?: number;
  onBack: () => void;
  onPick: (year: number, month: number) => void;
  onYearChange: (date: Date) => void;
  /** The month marked as chosen: the picker's value. */
  selected?: Date | null;
  viewDate: Date;
}

/** The year's twelve months, with the year paged by the header's arrows. */
export function YearMonthView({
  currentMonthRef,
  hidden,
  locale,
  maxDate,
  minDate,
  minHeight,
  onBack,
  onPick,
  onYearChange,
  selected,
  viewDate,
}: YearMonthViewProps) {
  const year = viewDate.getFullYear();
  const monthDisabled = (month: number) => {
    const first = startOfMonth(new Date(year, month, 1));
    return (
      (minDate !== undefined && endOfMonth(first) < minDate) ||
      (maxDate !== undefined && first > maxDate)
    );
  };

  return (
    <div className={styles.monthView} hidden={hidden} style={{ minHeight }}>
      <div className={styles.monthHeader}>
        <button
          aria-label="Back to days"
          className={styles.title}
          onClick={onBack}
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
            disabled={minDate !== undefined && year - 1 < minDate.getFullYear()}
            onClick={() => onYearChange(new Date(year - 1, 0, 1))}
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
            disabled={maxDate !== undefined && year + 1 > maxDate.getFullYear()}
            onClick={() => onYearChange(new Date(year + 1, 0, 1))}
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
            selected != null &&
            selected.getFullYear() === year &&
            selected.getMonth() === month;
          const isViewed = viewDate.getMonth() === month;
          return (
            <button
              aria-current={current ? "date" : undefined}
              className={styles.monthCell}
              data-selected={current || undefined}
              disabled={monthDisabled(month)}
              key={month}
              onClick={() => onPick(year, month)}
              ref={isViewed ? currentMonthRef : undefined}
              type="button"
            >
              {format(new Date(year, month, 1), "LLL", { locale })}
            </button>
          );
        })}
      </div>
    </div>
  );
}
