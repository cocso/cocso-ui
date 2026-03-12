"use client";

import {
  ArrowIOSBackwardIcon,
  ArrowIOSForwardIcon,
} from "@cocso-ui/react-icons";
import { ko } from "date-fns/locale";
import type { ComponentProps, ReactElement } from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { Button } from "../button";
import { cn } from "../cn";
import { Dropdown } from "../dropdown";
import { Typography } from "../typography";
import styles from "./day-picker.module.css";

/** Props for the {@link DayPicker} component. */
export interface DayPickerProps
  extends Omit<ComponentProps<"div">, "children"> {
  /** Whether the date picker is disabled. */
  disabled?: boolean;
  /** The latest selectable date. */
  maxDate?: Date;
  /** The earliest selectable date. */
  minDate?: Date;
  /** Callback fired when the selected date changes. */
  onValueChange?: (value: Date | null) => void;
  /** Custom trigger element that opens the calendar dropdown. */
  trigger?: ReactElement;
  /** The currently selected date. */
  value?: Date;
}

/**
 * A date picker component that renders a calendar inside a dropdown.
 * Supports date range constraints, a custom trigger element, and Korean locale formatting.
 *
 * @param props - {@link DayPickerProps}
 */
export function DayPicker({
  ref,
  className,
  value,
  onValueChange,
  disabled,
  trigger,
  minDate,
  maxDate,
  ...props
}: DayPickerProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (date: Date | null) => {
    onValueChange?.(date);
    setOpen(false);
  };

  return (
    <div className={cn(styles.root, className)} ref={ref} {...props}>
      <Dropdown onOpenChange={setOpen} open={open}>
        <Dropdown.Trigger render={trigger} />
        <Dropdown.Content aria-label="날짜 선택" className={styles.content}>
          <DatePicker
            dateFormat="yyyy년 MM월 dd일"
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
            inline
            locale={ko}
            maxDate={maxDate}
            minDate={minDate}
            onChange={handleChange}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <>
                <Button
                  disabled={prevMonthButtonDisabled}
                  onClick={decreaseMonth}
                  size="x-small"
                  type="button"
                  variant="secondary"
                >
                  <ArrowIOSBackwardIcon />
                </Button>
                <Typography type="body" weight="semibold">
                  {date.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                  })}
                </Typography>
                <Button
                  disabled={nextMonthButtonDisabled}
                  onClick={increaseMonth}
                  size="x-small"
                  type="button"
                  variant="secondary"
                >
                  <ArrowIOSForwardIcon />
                </Button>
              </>
            )}
            selected={value}
            showPopperArrow={false}
          />
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
