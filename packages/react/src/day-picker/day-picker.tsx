'use client';

import { ArrowIOSBackwardIcon, ArrowIOSForwardIcon } from '@cocso-ui/react-icons';
import { clsx as cx } from 'clsx';
import { ko } from 'date-fns/locale';
import { type ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from '../button';
import { Dropdown } from '../dropdown';
import { Typography } from '../typography';
import styles from './day-picker.module.css';

export interface DayPickerProps extends ComponentPropsWithoutRef<'div'> {
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onValueChange?: (value: Date | null) => void;
  value?: Date;
}

export const DayPicker = forwardRef<HTMLDivElement, DayPickerProps>(
  ({ className, value, onValueChange, disabled, children, minDate, maxDate, ...props }, ref) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = (date: Date | null) => {
      onValueChange?.(date);
      setOpen(false);
    };

    return (
      <div className={cx(styles.root, className)} ref={ref} {...props}>
        <Dropdown onOpenChange={setOpen} open={open}>
          <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content aria-label="날짜 선택" className={styles.content}>
              <DatePicker
                dateFormat="yyyy년 MM월 dd일"
                dayClassName={date => {
                  const day = date.getDay();
                  if (day === 0) {
                    return styles.sunday;
                  }
                  if (day === 6) {
                    return styles.saturday;
                  }
                  return '';
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
                      size="xs"
                      type="button"
                      variant="secondary"
                    >
                      <ArrowIOSBackwardIcon />
                    </Button>
                    <Typography type="body" weight="semibold">
                      {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                    </Typography>
                    <Button
                      disabled={nextMonthButtonDisabled}
                      onClick={increaseMonth}
                      size="xs"
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
          </Dropdown.Portal>
        </Dropdown>
      </div>
    );
  }
);

DayPicker.displayName = 'DayPicker';
