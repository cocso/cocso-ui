"use client";

import {
  ArrowIOSBackwardIcon,
  ArrowIOSForwardIcon,
} from "@cocso-ui/react-icons";
import type { Locale } from "date-fns";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { ComponentProps, ReactElement } from "react";
import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { cn } from "../../cn";
import { Button } from "../button";
import { Dropdown } from "../dropdown";
import { Typography } from "../typography";
import styles from "./date-time-picker.module.css";

export interface DateTimePickerProps
  extends Omit<ComponentProps<"div">, "children"> {
  dateFormat?: string;
  disabled?: boolean;
  filterTime?: (date: Date) => boolean;
  locale?: Locale;
  maxDate?: Date;
  /** The latest time of day. Taken from `maxDate` on the day it falls on. */
  maxTime?: Date;
  minDate?: Date;
  /** The earliest time of day. Taken from `minDate` on the day it falls on. */
  minTime?: Date;
  onValueChange?: (value: Date | null) => void;
  timeCaption?: string;
  timeIntervals?: number;
  trigger?: ReactElement;
  value?: Date;
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const atTime = (day: Date, hours: number, minutes: number) => {
  const time = new Date(day);
  time.setHours(hours, minutes, 0, 0);
  return time;
};

const startOfDay = (day: Date) => atTime(day, 0, 0);
const endOfDay = (day: Date) => atTime(day, 23, 59);

/**
 * The time a day opens on when there is no value yet: the next interval on
 * today, midnight on any other day. Today at midnight is already past, and
 * `filterTime` would then reject the day's own default.
 */
const openingTime = (day: Date, intervals: number, now: Date) => {
  if (!isSameDay(day, now)) {
    return startOfDay(day);
  }
  const minutes = Math.ceil((now.getMinutes() + 1) / intervals) * intervals;
  return atTime(day, now.getHours(), 0).getTime() + minutes * 60_000 >
    endOfDay(day).getTime()
    ? endOfDay(day)
    : new Date(atTime(day, now.getHours(), 0).getTime() + minutes * 60_000);
};

export function DateTimePicker({
  ref,
  className,
  value,
  onValueChange,
  disabled,
  trigger,
  locale = ko,
  dateFormat = "yyyy년 MM월 dd일 HH:mm",
  timeCaption = "시각",
  timeIntervals = 30,
  minDate,
  maxDate,
  minTime,
  maxTime,
  filterTime,
  ...props
}: DateTimePickerProps) {
  const [open, setOpen] = useState<boolean>(false);
  // The day the reader is working on before they have picked a time. A date
  // click leaves the popover open, so this is what the calendar shows and what
  // the time list is bounded against.
  const [draft, setDraft] = useState<Date | null>(null);
  const selected = value ?? draft;

  // The month to open on: `minDate`'s, if it is still ahead of today.
  const openToDate = useMemo(() => {
    if (selected) {
      return undefined;
    }
    const now = new Date();
    return minDate && minDate.getTime() > now.getTime() ? minDate : undefined;
  }, [selected, minDate]);

  // A bound that only applies on the day it falls on: on any other day the
  // whole day is open. Without this a `minDate` of 3pm today would also cut
  // every morning off every later day.
  const bounds = useMemo(() => {
    const day = selected ?? minDate ?? new Date();
    const lower =
      minTime ??
      (minDate && isSameDay(day, minDate) ? minDate : startOfDay(day));
    const upper =
      maxTime ?? (maxDate && isSameDay(day, maxDate) ? maxDate : endOfDay(day));
    return { maxTime: upper, minTime: lower };
  }, [selected, minDate, maxDate, minTime, maxTime]);

  const handleChange = (next: Date | null) => {
    if (!next) {
      setDraft(null);
      onValueChange?.(null);
      setOpen(false);
      return;
    }
    // react-datepicker reports a date click and a time click through the same
    // callback. A date click keeps the day's current time, so "the time moved"
    // is what tells the two apart — and what closes the popover.
    const previous = selected;
    const dayChanged = !(previous && isSameDay(previous, next));
    if (dayChanged) {
      const now = new Date();
      const withTime = previous
        ? atTime(next, previous.getHours(), previous.getMinutes())
        : openingTime(next, timeIntervals, now);
      setDraft(withTime);
      return;
    }
    setDraft(null);
    onValueChange?.(next);
    setOpen(false);
  };

  return (
    <div className={cn(styles.root, className)} ref={ref} {...props}>
      <Dropdown onOpenChange={setOpen} open={open}>
        <Dropdown.Trigger
          render={
            trigger ?? (
              <Button disabled={disabled} size="small" variant="outline">
                {value
                  ? format(value, dateFormat, { locale })
                  : "Select date and time"}
              </Button>
            )
          }
        />
        <Dropdown.Content
          aria-label="Select date and time"
          className={styles.content}
        >
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
            filterTime={filterTime}
            inline
            locale={locale}
            maxDate={maxDate}
            maxTime={bounds.maxTime}
            minDate={minDate}
            minTime={bounds.minTime}
            onChange={handleChange}
            openToDate={openToDate}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <>
                <Typography size="small" type="body" weight="semibold">
                  {date.toLocaleDateString(locale.code ?? "ko-KR", {
                    year: "numeric",
                    month: "long",
                  })}
                </Typography>

                <div className={styles.menu}>
                  <Button
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
            selected={selected ?? undefined}
            showPopperArrow={false}
            showTimeSelect
            timeCaption={timeCaption}
            timeIntervals={timeIntervals}
          />
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
