"use client";

import {
  ArrowIOSBackwardIcon,
  ArrowIOSForwardIcon,
} from "@cocso-ui/react-icons";
import { ko } from "date-fns/locale";
import type { ComponentProps, ReactElement } from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { cn } from "../../cn";
import { Button } from "../button";
import { Dropdown } from "../dropdown";
import { Typography } from "../typography";
import styles from "./month-picker.module.css";

/** Props for the {@link MonthPicker} component. */
export interface MonthPickerProps
  extends Omit<ComponentProps<"div">, "children"> {
  /** Whether the picker is disabled. */
  disabled?: boolean;
  /** The latest selectable date. */
  maxDate?: Date;
  /** The earliest selectable date. */
  minDate?: Date;
  /** Callback invoked when the selected month changes. Receives `null` when cleared. */
  onValueChange?: (value: Date | null) => void;
  /** Custom trigger element rendered inside the dropdown trigger. */
  trigger?: ReactElement;
  /** The currently selected date. */
  value?: Date;
}

/** A month-year picker rendered inside a dropdown. Uses a year-navigation header and closes automatically on month selection. */
export function MonthPicker({
  ref,
  className,
  value,
  onValueChange,
  trigger,
  minDate,
  maxDate,
  disabled,
  ...props
}: MonthPickerProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (date: Date | null) => {
    onValueChange?.(date);
    setOpen(false);
  };

  return (
    <div className={cn(styles.root, className)} ref={ref} {...props}>
      <Dropdown onOpenChange={setOpen} open={open}>
        <Dropdown.Trigger render={trigger} />
        <Dropdown.Content className={styles.content}>
          <DatePicker
            dateFormat="yyyy년 MM월 dd일"
            disabled={disabled}
            inline
            locale={ko}
            maxDate={maxDate}
            minDate={minDate}
            onChange={handleChange}
            renderCustomHeader={({
              date,
              decreaseYear,
              increaseYear,
              prevYearButtonDisabled,
              nextYearButtonDisabled,
            }) => (
              <>
                <Button
                  disabled={prevYearButtonDisabled}
                  onClick={decreaseYear}
                  size="x-small"
                  type="button"
                  variant="secondary"
                >
                  <ArrowIOSBackwardIcon />
                </Button>
                <Typography type="body" weight="semibold">
                  {date.toLocaleDateString("ko-KR", { year: "numeric" })}
                </Typography>
                <Button
                  disabled={nextYearButtonDisabled}
                  onClick={increaseYear}
                  size="x-small"
                  type="button"
                  variant="secondary"
                >
                  <ArrowIOSForwardIcon />
                </Button>
              </>
            )}
            selected={value}
            showMonthYearPicker
            showPopperArrow={false}
          />
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
