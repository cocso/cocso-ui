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
              <Button disabled={disabled} size="small" variant="outline">
                {value ? format(value, dateFormat, { locale }) : "Select date"}
              </Button>
            )
          }
        />
        <Dropdown.Content aria-label="Select date" className={styles.content}>
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
            inline
            locale={locale}
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
            selected={value}
            showPopperArrow={false}
          />
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
