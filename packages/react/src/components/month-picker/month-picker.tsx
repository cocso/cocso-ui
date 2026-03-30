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
import { Dropdown } from "../dropdown";
import { Typography } from "../typography";
import styles from "./month-picker.module.css";

export interface MonthPickerProps
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

export function MonthPicker({
  ref,
  className,
  value,
  onValueChange,
  trigger,
  locale = ko,
  dateFormat = "yyyy년 MM월",
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
        <Dropdown.Trigger
          render={
            trigger ?? (
              <Button size="small" variant="outline">
                {value ? format(value, dateFormat, { locale }) : "Select month"}
              </Button>
            )
          }
        />
        <Dropdown.Content aria-label="Select month" className={styles.content}>
          <DatePicker
            dateFormat={dateFormat}
            disabled={disabled}
            inline
            locale={locale}
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
                <Typography size="small" type="body" weight="semibold">
                  {date.toLocaleDateString(locale.code ?? "ko-KR", {
                    year: "numeric",
                  })}
                </Typography>

                <div className={styles.menu}>
                  <Button
                    className={styles.arrow}
                    disabled={prevYearButtonDisabled}
                    onClick={decreaseYear}
                    size="x-small"
                    svgOnly
                    type="button"
                    variant="outline"
                  >
                    <ArrowIOSBackwardIcon />
                  </Button>
                  <Button
                    className={styles.arrow}
                    disabled={nextYearButtonDisabled}
                    onClick={increaseYear}
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
            showFourColumnMonthYearPicker
            showMonthYearPicker
            showPopperArrow={false}
          />
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
